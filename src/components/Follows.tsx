import React, {useEffect, useReducer} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {UserFollow, UserIdWithFollow} from '../types/DBTypes';
import {useFollow} from '../hooks/apiHooks';

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
        await deleteFollow(Number(followState.followUser.followed_id), token);
        // dispaching is already done in the getFollows and getFollowCount functions
        // other way, is to do update locally after sucessful api call
        // for deleting it's ok because there is no need to get any data from the api
        followDispatch({type: 'setFollowCount', count: followState.count - 1});
        followDispatch({type: 'follow', follow: null});
      } else {
        // post the follow and dispatch the new follow count to the state. Dispatching is already done in the getFollows and getFollowCount functions
        console.log('followedId', followedId, 'token', token);
        const result = await postFollow(Number(followedId), token);
        console.log('result', result);
        getFollows();
        getFollowCount();
      }
    } catch (e) {
      console.log('follow error', (e as Error).message);
    }
  };

  console.log(followState);

  return (
    <View>
      <Text>Follows: {followState.count}</Text>
      <TouchableOpacity onPress={handleFollow}>
        {followState.followUser ? (
          <Icon name="heart" size={30} color="red" />
        ) : (
          <Icon name="heart" size={30} color="black" />
        )}
        <Text>{followState.followUser ? 'Unfollow' : 'Follow'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Follows;
