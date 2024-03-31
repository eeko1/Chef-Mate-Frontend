import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Icon, Badge} from '@rneui/base';
import {useEffect, useReducer} from 'react';
import {useLike} from '../hooks/apiHooks';
import {Like, MediaItemWithOwner} from '../types/DBTypes';

type LikeState = {
  count: number;
  userLike: Like | null;
};

type LikeAction = {
  type: 'setLikeCount' | 'like';
  count?: number;
  like?: Like | null;
};

const likeInitialState: LikeState = {
  count: 0,
  userLike: null,
};

const likeReducer = (state: LikeState, action: LikeAction): LikeState => {
  switch (action.type) {
    case 'setLikeCount':
      return {...state, count: action.count ?? 0};
    case 'like':
      if (action.like !== undefined) {
        return {...state, userLike: action.like};
      }
      return state; // no change if action.like is undefined
  }
  return state; // Return the unchanged state if the action type is not recognized
};

const Likes = ({item}: {item: MediaItemWithOwner}) => {
  const [likeState, likeDispatch] = useReducer(likeReducer, likeInitialState);
  const {getUserLike, getCountByMediaId, postLike, deleteLike} = useLike();

  // get user like
  const getLikes = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!item || !token) {
      return;
    }
    try {
      const userLike = await getUserLike(item.media_id, token);
      likeDispatch({type: 'like', like: userLike});
    } catch (e) {
      likeDispatch({type: 'like', like: null});
      // FAKE like object for testing only
      //likeDispatch({type: 'like', like: {like_id: 3, media_id: 5, user_id: 3, created_at: new Date()}});
      console.log('get user like error', (e as Error).message);
    }
  };

  // get like count
  const getLikeCount = async () => {
    try {
      const countResponse = await getCountByMediaId(item.media_id);
      likeDispatch({type: 'setLikeCount', count: countResponse.count});
    } catch (e) {
      likeDispatch({type: 'setLikeCount', count: 0});
      console.log('get user like error', (e as Error).message);
    }
  };

  useEffect(() => {
    getLikes();
    getLikeCount();
  }, [item]);

  const handleLike = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!item || !token) {
        return;
      }
      // If user has liked the media, delete the like. Otherwise, post the like.
      if (likeState.userLike) {
        // delete the like and dispatch the new like count to the state.
        await deleteLike(likeState.userLike.like_id, token);
        // Dispatching is already done in the getLikes and getLikeCount functions.
        // other way, is to do update locally after succesfull api call
        // for deleting it's ok because there is no need to get any data from the api
        likeDispatch({type: 'setLikeCount', count: likeState.count - 1});
        likeDispatch({type: 'like', like: null});
      } else {
        // post the like and dispatch the new like count to the state. Dispatching is already done in the getLikes and getLikeCount functions.
        await postLike(item.media_id, token);
        getLikes();
        getLikeCount();
      }
    } catch (e) {
      console.log('like error', (e as Error).message);
    }
  };

  console.log(likeState);

  return (
    <Button
      onPress={handleLike}
      type="clear"
      containerStyle={{
        position: 'absolute',
        top: 1,
        right: 3,
        zIndex: 1,
      }}
    >
      <Icon
        type="material-community"
        color="#333"
        name={likeState.userLike ? 'thumb-up' : 'thumb-up-outline'}
      />
      <Badge
        value={likeState.count}
        containerStyle={{position: 'absolute', top: 0, right: 0}}
      />
    </Button>
  );
};

export default Likes;
