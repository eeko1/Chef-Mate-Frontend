import {View, Text, TouchableOpacity, Image} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {Card, Icon, ListItem, Button} from '@rneui/base';
import moment from 'moment';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MediaItemWithOwner} from '../types/DBTypes';
import {useUserContext} from '../hooks/ContextHooks';
import colors from '../styles/colors';
import AverageRating from './AverageRating';
import Follows from './Follow';

type Props = {
  item: MediaItemWithOwner;
  navigation: NavigationProp<ParamListBase>;
};

const MediaListItem = ({item, navigation}: Props) => {
  const {user} = useUserContext();
  const [likes, setLikes] = useState(item.likes ? item.likes.length : 0);
  const [userHasLiked, setUserHasLiked] = useState(false);

  useEffect(() => {
    if (
      item.likes &&
      item.likes.some((like) => like.user_id === user.user_id)
    ) {
      setUserHasLiked(true);
    }
  }, []);

  const handleLike = async () => {
    try {
      //Get token from async storage
      const token = await AsyncStorage.getItem('token');
      let response;
      if (userHasLiked) {
        response = await fetch(
          `${process.env.EXPO_PUBLIC_MEDIA_API}/likes/${item.media_id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          },
        );
      } else {
        response = await fetch(`${process.env.EXPO_PUBLIC_MEDIA_API}/likes/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            media_id: item.media_id,
            user_id: user.user_id,
          }),
        });
      }

      if (!response.ok) {
        const responseBody = await response.json();
        console.log('Server response', responseBody);
        throw new Error('Error liking/unliking the post');
      }

      setLikes(userHasLiked ? likes - 1 : likes + 1);
      setUserHasLiked(!userHasLiked);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={{paddingBottom: 70}}>
      <Card
        containerStyle={{
          backgroundColor: colors.lightgreen,
          borderWidth: 0,
          shadowColor: 'transparent',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: 10,
          }}
        >
          <Image
            source={{
              uri: 'https://placehold.co/600x400/000000/FFFFFF/png?text=Profile\nImage',
            }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              marginRight: 10,
            }}
          />
          <Text style={{color: colors.blue, fontSize: 20, paddingBottom: 10}}>
            @{item.username}
          </Text>
          <Follows userId={user.user_id} followedId={item.user_id} />
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            navigation.navigate('Single Media', item);
          }}
        >
          <Card.Image
            style={{aspectRatio: 1, height: 300, borderRadius: 10}}
            source={{uri: item.thumbnail}}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 10,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 10,
              }}
            >
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  type="ionicon"
                  name={userHasLiked ? 'heart-dislike' : 'heart'}
                  color="red"
                  onPress={handleLike}
                  size={35}
                />
                <Text style={{color: colors.blue, fontSize: 20}}>{likes}</Text>
              </View>
              <Card.Title
                style={{
                  color: colors.blue,
                  paddingTop: 14,
                  paddingLeft: 10,
                  fontSize: 20,
                }}
              >
                {item.title}
              </Card.Title>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            {user && user.user_id === item.user_id ? (
              <>
                {/*  <Button
                  onPress={() => {
                    navigation.navigate('Modify', item);
                  }}
                >
                  <Icon type="ionicon" name="create" color="white" />
                </Button>
                <Button
                  color="error"
                  onPress={() => {
                    console.log('delete');
                  }}
                >
                  {' '}
                  <Icon type="ionicon" name="trash" color="white" />
                </Button> */}
              </>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Single Media', item);
                }}
              ></TouchableOpacity>
            )}
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: colors.blue, fontSize: 20, marginRight: 6}}>
              <AverageRating item={item} />
            </Text>
            <Icon type="ionicon" name="star" color="yellow" />
          </View>
          <Text style={{paddingTop: 10, color: colors.blue}}>
            {moment(item.created_at).fromNow()}{' '}
          </Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
};
export default MediaListItem;
