import React, {useState, useEffect} from 'react';
import {Card, Text, Icon, Image} from '@rneui/themed';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  View,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MediaItemWithOwner} from '../types/DBTypes';
import Ratings from '../components/Ratings';
import Comments from '../components/Comments';
import Follows from '../components/Follow';
import Likes from '../components/Likes';
import colors from '../styles/colors';
import {useUserContext} from '../hooks/ContextHooks';

const Single = ({route}: any) => {
  const item: MediaItemWithOwner = route.params;
  const [fileType, fileFormat] = item.media_type.split('&#x2F;');
  const [view, setView] = useState<'reviews' | 'details'>('reviews');
  const [likes, setLikes] = useState(item.likes ? item.likes.length : 0);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const {user} = useUserContext();

  // LIKE USEEFFECT
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Card containerStyle={styles.cardContainer}>
            <View style={styles.profileSection}>
              <Image
                source={{
                  uri: 'https://placehold.co/600x400/000000/FFFFFF/png?text=Profile\nImage',
                }}
                style={styles.profileImage}
              />
              <Text style={styles.usernameText}>@{item.username}</Text>
              <Follows userId={user.user_id} followedId={item.user_id} />
            </View>
            <Card.Image
              style={styles.cardImage}
              resizeMode="contain"
              source={{uri: item.filename}}
            />

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                type="ionicon"
                name={userHasLiked ? 'heart-dislike' : 'heart'}
                color="red"
                onPress={handleLike}
                size={50}
              />
              <Text style={{color: colors.blue, fontSize: 20}}>{likes}</Text>
            </View>
            <Ratings item={item} size={50} />
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                onPress={() => setView('reviews')}
                style={styles.tabButton}
              >
                <Text style={{fontWeight: 'bold'}}>Recipe Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setView('details')}
                style={styles.tabButton}
              >
                <Text style={{fontWeight: 'bold'}}>Reviews</Text>
              </TouchableOpacity>
            </View>
            {view === 'details' && (
              <View>
                <Comments item={item} />
              </View>
            )}
            {view === 'reviews' && (
              <View style={styles.detailsContainer}>
                <Text style={styles.ingredinetsHeaderText}>Ingredients:</Text>
                <Text style={styles.detailsText}>{item.ingredients}</Text>
                <Text style={styles.detailsHeaderText}>Instructions:</Text>
                <Text style={styles.detailsText}>{item.description}</Text>
              </View>
            )}
          </Card>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: colors.lightgreen,
  },
  cardContainer: {
    backgroundColor: colors.lightgreen,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 20,
    zIndex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  usernameText: {
    color: colors.blue,
    fontSize: 20,
    paddingBottom: 10,
  },
  cardImage: {
    height: 400,
  },
  likesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -20,
    marginBottom: 20,
  },
  likesText: {
    color: colors.blue,
    fontSize: 20,
  },
  titleText: {
    color: colors.text,
    marginLeft: 10,
    fontSize: 20,
  },
  ingredientsText: {
    fontSize: 16,
    marginVertical: 10,
    padding: 8,
    backgroundColor: colors.sage,
    borderRadius: 5,
    lineHeight: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  tabButton: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginRight: 5,
    marginLeft: 5,
  },
  detailsContainer: {
    backgroundColor: colors.sage,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
  detailsHeaderText: {
    color: 'black',
    fontSize: 18,
    paddingBottom: 10,
    paddingTop: 10,
    fontWeight: 'bold',
  },
  detailsText: {
    color: 'black',
    fontSize: 16,
  },
  ingredinetsHeaderText: {
    color: 'black',
    fontSize: 18,
    paddingBottom: 10,
    fontWeight: 'bold',
  },
});

export default Single;
