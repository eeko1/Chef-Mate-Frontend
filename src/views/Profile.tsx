import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icon, ListItem} from '@rneui/base';
import {Controller, useForm} from 'react-hook-form';
import {Card, Input} from 'react-native-elements';
import {useUserContext} from '../hooks/ContextHooks';
import {useFollow, useUser} from '../hooks/apiHooks';
import colors from '../styles/colors';
import UploadImage from '../components/ImagePicker';
import {Credentials} from '../types/LocalTypes';
import {User} from '../types/DBTypes';
import {useUpdateContext} from '../hooks/UpdateHook';
import MyFiles from './MyFiles';
import MyLikedPosts from './MyLikedPosts';

const Profile = () => {
  const {handleLogout, user, handlePut} = useUserContext();
  const {getFollowCountByFollowedId, getFollowingCountByFollowerId} =
    useFollow();
  const [followCount, setFollowCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {update, setUpdate} = useUpdateContext();
  const [modalVisible, setModalVisible] = useState(false);
  const initValues: Credentials = {username: '', password: '', email: ''};
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: initValues,
  });

  const {getEmailAvailable} = useUser();

  const onSubmit = async (data) => {
    try {
      const inputs: Pick<User, 'username' | 'email'> = {
        username: data.username || user.username,
        email: data.email || user.email,
      };

      await handlePut(user.user_id, inputs);
      setUpdate(!update);
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const [view, setView] = useState<'My posts' | 'My liked posts'>('My posts');

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
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="edit" color="white" />
        </TouchableOpacity>
        <Card.Image
          style={{
            width: 150,
            height: 150,
            borderWidth: 2,
            borderRadius: 150,
            marginTop: 10,
          }}
          source={
            (user.profile_picture_url && {uri: user.profile_picture_url}) ||
            require('../../assets/katti.png')
          }
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
              Reviews:
            </ListItem.Title>
          </ListItem>
        </View>
        <View style={styles.buttons}>
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
        </View>
        {view === 'My posts' && <MyFiles navigation={navigation} />}
        {view === 'My saved posts' && <MyLikedPosts navigation={navigation} />}
        <TouchableOpacity style={{padding: 10}} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
          <Icon name="logout" color="black" />
        </TouchableOpacity>
      </ScrollView>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{flex: 1, justifyContent: 'center', margin: 10}}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              borderColor: 'black',
              borderWidth: 2,
            }}
          >
            <View
              style={{
                alignItems: 'center',
              }}
            >
              <Text style={{padding: 10, fontWeight: 'bold'}}>
                Modify user information
              </Text>
              <UploadImage />
            </View>
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  placeholder={user.username}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  errorMessage={errors.username?.message}
                  style={styles.usernameEdit}
                />
              )}
              name="username"
            />
            <Controller
              control={control}
              rules={{
                maxLength: 100,
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Invalid email address',
                },
                validate: async (value) => {
                  try {
                    const {available} = await getEmailAvailable(value);
                    return available ? available : 'Email taken';
                  } catch (error) {
                    console.log((error as Error).message);
                  }
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  placeholder={user.email}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                  autoCapitalize="none"
                  style={styles.email}
                />
              )}
              name="email"
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{padding: 20}}
              >
                <Icon name="close" color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSubmit(onSubmit)()}
                style={{padding: 20}}
              >
                <Icon name="save" color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  usernameEdit: {
    color: 'black',
    padding: 10,
  },
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
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 30,
    marginTop: 10,
    margin: 5,
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 2,
  },
  buttonText: {
    color: colors.darkgreen,
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
  },
  email: {
    color: 'black',
    padding: 10,
  },
});

export default Profile;
