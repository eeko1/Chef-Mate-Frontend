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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUserContext} from '../hooks/ContextHooks';
import colors from '../styles/colors';
import UploadImage from '../components/ImagePicker';
import {useUser} from '../hooks/apiHooks';
import {Credentials} from '../types/LocalTypes';
import {User, UserWithNoPassword} from '../types/DBTypes';
import {useUpdateContext} from '../hooks/UpdateHook';

const Profile = () => {
  const {handleLogout, user, handlePut} = useUserContext();
  const navigation = useNavigation();
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

  const {getEmailAvailable, getUserById} = useUser();

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

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)} // Open modal when pressed
        >
          <Icon name="edit" color="white" style={styles.edit} />
        </TouchableOpacity>
        <Card.Image
          style={{
            width: 150,
            height: 150,
            borderWidth: 2,
            borderRadius: 150,
            marginTop: 10,
          }}
          source={{uri: user.profile_picture_url}}
        />
        <ListItem containerStyle={styles.listItem}>
          <ListItem.Title style={styles.listItemTitle}>
            @{user.username}
          </ListItem.Title>
        </ListItem>
        <View style={styles.stats}>
          <ListItem containerStyle={styles.listItem}>
            <ListItem.Title style={styles.listItemTitle}>
              Followers: 57
            </ListItem.Title>
          </ListItem>
          <ListItem containerStyle={styles.listItem}>
            <ListItem.Title style={styles.listItemTitle}>
              Recipes: 2
            </ListItem.Title>
          </ListItem>
        </View>
        <View style={styles.stats}>
          <ListItem containerStyle={styles.listItem}>
            <ListItem.Title style={styles.listItemTitle}>
              Following: 48
            </ListItem.Title>
          </ListItem>
          <ListItem containerStyle={styles.listItem}>
            <ListItem.Title style={styles.listItemTitle}>
              Reviews: 1
            </ListItem.Title>
          </ListItem>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.button}
           // onPress={() => navigation.navigate('My Files')}
          >
            <Text style={styles.buttonText}>My Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>My saved posts</Text>
          </TouchableOpacity>
        </View>
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
                  style={styles.username}
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
  edit: {},
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
  username: {
    color: 'black',
    padding: 10,
  },
  email: {
    color: 'black',
    padding: 10,
  },
});

export default Profile;
