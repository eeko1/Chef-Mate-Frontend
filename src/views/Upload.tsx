import {Controller, useForm} from 'react-hook-form';
import {Button, Card, Input, Text} from '@rneui/base';
import * as ImagePicker from 'expo-image-picker';
import {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Alert,
  StyleSheet,
  View,
} from 'react-native';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import React from 'react';
import {useFile, useMedia} from '../hooks/apiHooks';
import {useUpdateContext} from '../hooks/UpdateHook';
import colors from '../styles/colors';

const Upload = () => {
  const [image, setImage] = useState<ImagePicker.ImagePickerResult | null>(
    null,
  );
  const {postExpoFile} = useFile();
  const {postMedia} = useMedia();
  const {update, setUpdate} = useUpdateContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const initValues = {title: '', description: '', ingredients: ''};
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: initValues,
  });

  const resetForm = () => {
    reset();
    setImage(null);
  };

  const doUpload = async (inputs) => {
    if (!image) {
      Alert.alert('No media selected');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const fileResponse = await postExpoFile(image.assets![0].uri, token);
        const mediaResponse = await postMedia(fileResponse, inputs, token);
        setUpdate(!update);
        Alert.alert(mediaResponse.message);
        navigation.navigate('Home');
        resetForm();
      }
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    });

    if (!result.canceled) {
      setImage(result);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      resetForm();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => Keyboard.dismiss()}
        style={styles.touchable}
        activeOpacity={1}
      >
        <Card containerStyle={styles.cardContainer}>
          {image && image.assets![0].mimeType?.includes('video') ? (
            <Video
              source={{uri: image.assets![0].uri}}
              style={styles.video}
              useNativeControls
            />
          ) : (
            <>
              <Card.Image
                onPress={pickImage}
                style={styles.image}
                source={{
                  uri: image
                    ? image.assets![0].uri
                    : 'https://via.placeholder.com/150?text=Choose+media',
                }}
              />
            </>
          )}
          <Card.Divider />
          <Text style={styles.label}>Recipe Title</Text>
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Recipe title is required',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder=""
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.title?.message}
                inputContainerStyle={styles.inputContainer}
                containerStyle={styles.inputContainerStyle}
              />
            )}
            name="title"
          />
          <Text style={styles.label}>Ingredients</Text>
          <Controller
            control={control}
            rules={{
              maxLength: {
                value: 1000,
                message: 'Instructions cannot exceed 1000 characters',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder=""
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.ingredients?.message}
                inputContainerStyle={styles.inputContainer}
                containerStyle={styles.inputContainerStyle}
              />
            )}
            name="ingredients"
          />
          <Text style={styles.label}>Instructions</Text>
          <Controller
            control={control}
            rules={{
              maxLength: {
                value: 1000,
                message: 'Instructions cannot exceed 1000 characters',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder=""
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.description?.message}
                multiline={true}
                numberOfLines={5}
                inputContainerStyle={styles.inputContainerLarge}
                containerStyle={styles.inputContainerStyle}
              />
            )}
            name="description"
          />
          <Card.Divider />
          <View style={styles.buttonContainer}>
            <Button
              title="Reset"
              onPress={resetForm}
              buttonStyle={styles.resetButton}
              containerStyle={styles.buttonTop}
            />
            <Button
              title="Upload"
              onPress={handleSubmit(doUpload)}
              buttonStyle={styles.uploadButton}
              containerStyle={styles.buttonBottom}
            />
          </View>
          <Card.Divider />
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightgreen,
  },
  touchable: {
    flex: 1,
    backgroundColor: colors.lightgreen,
  },
  cardContainer: {
    backgroundColor: colors.lightgreen,
    borderWidth: 0,
    shadowColor: 'transparent',
    paddingHorizontal: 20,
  },
  video: {
    height: 300,
  },
  image: {
    aspectRatio: 1,
    height: 300,
    borderRadius: 10,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: colors.text,
  },
  inputContainer: {
    backgroundColor: colors.sage,
    borderBottomWidth: 0,
    borderRadius: 10,
    padding: 5,
  },
  inputContainerLarge: {
    backgroundColor: colors.sage,
    borderBottomWidth: 0,
    minHeight: 100,
    borderRadius: 10,
    padding: 5,
  },
  inputContainerStyle: {
    paddingHorizontal: 0,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonTop: {
    marginBottom: 10,
  },
  buttonBottom: {
    marginTop: 0,
  },
  resetButton: {
    backgroundColor: 'lightgray',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 30,
    color: 'black',
  },
  uploadButton: {
    backgroundColor: 'lightgray',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 30,
    color: 'black',
  },
});

export default Upload;
