import React, {useEffect, useReducer} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {UserFollow, UserIdWithFollow} from '../types/DBTypes';
import {useFollow} from '../hooks/apiHooks';
import colors from '../styles/colors';
import {useUpdateContext} from '../hooks/UpdateHook';

type FollowState = {
  count: number;
  followUser: UserFollow | null;
};

type FollowAction = {
  type: 'setFollowCount' | 'follow';
  count?: number;
  follow?: UserFollow | null;
};

const followInitialState: FollowState = {
  count: 0,
  followUser: null,
};

const followReducer = (
  state: FollowState,
  action: FollowAction,
): FollowState => {
  switch (action.type) {
    case 'setFollowCount':
      return {...state, count: action.count ?? 0};
    case 'follow':
      if (action.follow !== undefined) {
        return {...state, followUser: action.follow};
      }
      return state; // no change if action.follow is undefined
  }
  return state; // Return the unchanged state if no action type is not recognized
};

const Follows = ({userId, followedId}: UserIdWithFollow) => {
  const [followState, followDispatch] = useReducer(
    followReducer,
    followInitialState,
  );
  const {getUserFollow, postFollow, deleteFollow, getFollowCountByFollowedId} =
    useFollow();

  const {update, setUpdate} = useUpdateContext();

  // get user follow
  const getFollows = async () => {
    if (!userId) {
      return;
    }
    try {
      const followResponse = await getUserFollow(followedId);

      followDispatch({type: 'follow', follow: followResponse});
    } catch (e) {
      console.log('get user like error', (e as Error).message);
    }
  };

  // get follow count
  const getFollowCount = async () => {
    try {
      const countResponse = await getFollowCountByFollowedId(followedId);
      followDispatch({type: 'setFollowCount', count: countResponse});
    } catch (e) {
      followDispatch({type: 'setFollowCount', count: 0});
      console.log('get follow count error', (e as Error).message);
    }
  };

  useEffect(() => {
    getFollows();
    getFollowCount();
  }, [userId, followedId]);

  const handleFollow = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!userId || !followedId || !token) {
        return;
      }
      console.log('followedId', followedId, 'userId', userId);
      if (followedId === userId) {
        Alert.alert('You cannot follow yourself');
      }

      // If user has already followed, then delete the follow, otherwise post the follow
      if (followState.followUser !== null) {
        // delete the follow and dispatch the new follow count to the state
        const result = await deleteFollow(Number(followState.followUser.followed_id), token);
        if (!result) {
          return;
        }
        // dispaching is already done in the getFollows and getFollowCount functions
        // other way, is to do update locally after sucessful api call
        // for deleting it's ok because there is no need to get any data from the api
        followDispatch({type: 'setFollowCount', count: followState.count - 1});
        followDispatch({type: 'follow', follow: null});
        setUpdate((prevState) => !prevState);
      } else {
        // post the follow and dispatch the new follow count to the state. Dispatching is already done in the getFollows and getFollowCount functions
        console.log('followedId', followedId, 'token', token);
        const result = await postFollow(Number(followedId), token);
        if (!result) {
          return;
        }
        console.log('result', result);
        getFollows();
        getFollowCount();
        setUpdate((prevState) => !prevState);
      }
    } catch (e) {
      console.log('follow error', (e as Error).message);
    }
  };

  console.log(followState);

  return (
    <View style={{alignItems: 'center', justifyContent: 'center', padding: 20}}>
      {/* <Text>Follows: {followState.count}</Text> */}
      <TouchableOpacity
        onPress={handleFollow}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          backgroundColor: colors.sage,
          borderRadius: 5,
        }}
      >
        <Icon
          name="check"
          size={15}
          color={followState.followUser ? 'black' : 'white'}
        />
        <Text style={{marginLeft: 10}}>
          {followState.followUser ? 'Unfollow' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Follows;
