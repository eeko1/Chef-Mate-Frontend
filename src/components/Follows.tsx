import React, {useEffect, useReducer} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {UserFollow, UserIdWithFollow} from '../types/DBTypes';
import {useFollow} from '../hooks/apiHooks'
type FollowState = {
  count: number;
  userFollow: UserFollow | null;
}

type FollowAction = {
  type: 'setFollowCount' | 'follow';
  count?: number;
  follow?: UserFollow | null;
};

const initialState: FollowState = {
  count: 0,
  userFollow: null,
};

const followReducer = (state: FollowState, action: FollowAction): FollowState => {
  switch (action.type) {
    case 'setFollowCount':
      return {...state, count: action.count ?? 0};
    case 'follow':
      return {...state, userFollow: action.follow || null};
      }
      return state;
    }
  return state;
};

  return (
    <View>
      <TouchableOpacity onPress={handleFollow}>
        <Icon name="user" size={20} color="black" />
        <Text>{state.count}</Text>
      </TouchableOpacity>
    </View>
  );
};

