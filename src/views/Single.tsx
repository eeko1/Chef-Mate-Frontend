import React, {useState} from 'react';
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
import {MediaItemWithOwner} from '../types/DBTypes';
import Ratings from '../components/Ratings';
import Comments from '../components/Comments';
import Follows from '../components/Follows';
import colors from '../styles/colors';
import {useUserContext} from '../hooks/ContextHooks';

const Single = ({route}: any) => {
  const item: MediaItemWithOwner = route.params;
  const [view, setView] = useState<'reviews' | 'details'>('reviews');
  const {user} = useUserContext();

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

            <View style={styles.likesSection}>
              <Icon type="ionicon" name="heart" color="red" />
              <Text style={styles.likesText}>
                {item.Likes ? item.Likes.length : ' ' + 0}
              </Text>
              <Text style={styles.titleText}>{item.title}</Text>
            </View>
            <Text style={styles.ingredientsText}>{item.ingredients}</Text>
            <Ratings item={item} size={35} />
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                onPress={() => setView('reviews')}
                style={styles.tabButton}
              >
                <Text>Reviews</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setView('details')}
                style={styles.tabButton}
              >
                <Text>Recipe Details</Text>
              </TouchableOpacity>
            </View>
            {view === 'reviews' && (
              <View>
                <Comments item={item} />
              </View>
            )}
            {view === 'details' && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsHeaderText}>Recipe Details:</Text>
                <Text style={styles.detailsText}>
                  Instructions: {item.description}
                </Text>
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
    color: 'white',
    fontSize: 18,
    paddingBottom: 10,
  },
  detailsText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Single;
