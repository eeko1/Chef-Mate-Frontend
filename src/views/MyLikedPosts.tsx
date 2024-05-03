import {FlatList, View} from 'react-native';
import {Text} from '@rneui/base';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import React from 'react';
import {useUserContext} from '../hooks/ContextHooks';
import {useMyLikedPosts} from '../hooks/apiHooks';
import MediaListItem from '../components/MediaListItem';
import {UserWithNoPassword} from '../types/DBTypes';

const MyLikedPosts = ({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) => {
  const {myLikedPosts} = useMyLikedPosts();
  const {user} = useUserContext();

  if (!user) {
    return (
      <View>
        <Text>You haven't liked any posts.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={myLikedPosts}
      renderItem={({item}) => (
        <MediaListItem navigation={navigation} item={item} />
      )}
    />
  );
};

export default MyLikedPosts;
