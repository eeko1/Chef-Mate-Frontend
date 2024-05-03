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
import React, {useState} from 'react';
import {useUserContext} from '../hooks/ContextHooks';
import colors from '../styles/colors';
import MyFiles from './MyFiles';
import MyLikedPosts from './MyLikedPosts';

const Profile = () => {
  const {handleLogout, user} = useUserContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const [view, setView] = useState<'My posts' | 'My saved posts'>('My posts');

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
                Followers
              </ListItem.Title>
            </ListItem>
            <ListItem containerStyle={styles.listItem}>
              <ListItem.Title style={styles.listItemTitle}>
                Recipes
              </ListItem.Title>
            </ListItem>
          </View>
          <View style={styles.stats}>
            <ListItem containerStyle={styles.listItem}>
              <ListItem.Title style={styles.listItemTitle}>
                Following
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
              onPress={() => setView('My saved posts')}
            >
              <Text style={styles.buttonText}>My liked posts</Text>
            </TouchableOpacity>
            <Card.Divider />
          </View>
          {view === 'My posts' && <MyFiles navigation={navigation} />}
          {view === 'My saved posts' && (
            <MyLikedPosts navigation={navigation} />
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
