import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Card, Icon, ListItem} from '@rneui/base';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  FlatList,
} from 'react-native';
import React, {useEffect, useReducer, useState} from 'react';
import {useUserContext} from '../hooks/ContextHooks';
import {useFollow} from '../hooks/apiHooks';
import colors from '../styles/colors';
import Follows from '../components/Follow';
import {useUpdateContext} from '../hooks/UpdateHook';
import {UserIdWithFollow} from '../types/DBTypes';
import MyFiles from './MyFiles';


const Profile = () => {
  const {handleLogout, user} = useUserContext();
  const {getFollowCountByFollowedId, getFollowingCountByFollowerId} = useFollow();
  const [followCount, setFollowCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const [view, setView] = useState<'My posts' | 'My liked posts'>('My posts');
  const {update} = useUpdateContext();

  const getFollowerCount = async () => {
    try {
      const count = await getFollowCountByFollowedId(user.user_id);
      if (count) {
        setFollowCount(count);
        console.log('follow count', count);
      }
    } catch (e) {
      console.log('get follow count error', (e as Error).message);
    }
  };

  const getFollowingCount = async () => {
    try {
      const count = await getFollowingCountByFollowerId(user.user_id);
      if (count) {
        console.log('following count', count);
        setFollowingCount(count);
      }
    } catch (e) {
      console.log('get following count error', (e as Error).message);
    }
  };

  useEffect(() => {
    getFollowerCount();
    getFollowingCount();
  }, [update]);

  return (
    <>
      {user && (
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileModal')}>
            <Icon name="edit" color="white" style={styles.edit} />
          </TouchableOpacity>
          <Card.Image
            source={{uri: 'https://placekitten.com/300/300'}}
            style={styles.image}
          />
          <ListItem containerStyle={styles.listItem}>
            <ListItem.Title style={styles.listItemTitle}>
              @{user.username}
            </ListItem.Title>
          </ListItem>
          <View style={styles.stats}>
            <ListItem containerStyle={styles.listItem}>
              <ListItem.Title style={styles.listItemTitle}>
                Followers: {followCount}
              </ListItem.Title>
            </ListItem>
            <ListItem containerStyle={styles.listItem}>
              <ListItem.Title style={styles.listItemTitle}>
                Recipes:
              </ListItem.Title>
            </ListItem>
          </View>
          <View style={styles.stats}>
            <ListItem containerStyle={styles.listItem}>
              <ListItem.Title style={styles.listItemTitle}>
                Following: {followingCount}
              </ListItem.Title>
            </ListItem>
            <ListItem containerStyle={styles.listItem}>
              <ListItem.Title style={styles.listItemTitle}>
                Reviews
              </ListItem.Title>
            </ListItem>
          </View>
          <View style={styles.buttons}>
            <Card.Divider />
            <TouchableOpacity
              style={styles.button}
              onPress={() => setView('My posts')}
            >
              <Text style={styles.buttonText}>My Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setView('My liked posts')}
            >
              <Text style={styles.buttonText}>My liked posts</Text>
            </TouchableOpacity>
            <Card.Divider />
          </View>
          {view === 'My posts' && <MyFiles navigation={navigation} />}
          {view === 'My liked posts' && (
            <View>
              <Text>My liked posts</Text>
            </View>
          )}
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
            <Icon name="logout" color="black" />
          </TouchableOpacity>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#7EAA92',
  },
  edit: {},
  image: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    borderWidth: 3,
    borderColor: 'black',
  },
  username: {
    color: 'white',
    backgroundColor: '#0a1c13',
  },
  listItem: {
    backgroundColor: colors.lightgreen,
  },
  listItemTitle: {
    backgroundColor: '#7EAA92',
    color: 'white',
  },
  stats: {
    flexDirection: 'row',
    padding: 5,
  },
  button: {
    backgroundColor: '#7EAA92',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.darkgreen,
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
  },
});

export default Profile;
