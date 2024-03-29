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
} from 'react-native';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useFile, useMedia} from '../hooks/apiHooks';
import {useUpdateContext} from '../hooks/UpdateHook';
import colors from '../styles/colors';

const Upload = () => {
  const [image, setImage] = useState<ImagePicker.ImagePickerResult | null>(null);
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
              <Text style={styles.title}>Chef Mate</Text>
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
              required: {
                value: true,
                message: 'Ingredients are required',
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
              required: {
                value: true,
                message: 'Instructions are required',
              },
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
          <Button
            title="Upload"
            onPress={handleSubmit(doUpload)}
            buttonStyle={styles.uploadButton}
            titleStyle={styles.uploadButtonText}
          />
          <Card.Divider />
          <Button title="Reset" onPress={resetForm} />
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkgreen,
  },
  touchable: {
    flex: 1,
    backgroundColor: colors.darkgreen,
  },
  cardContainer: {
    backgroundColor: colors.darkgreen,
    borderWidth: 0,
    shadowColor: 'transparent',
    paddingHorizontal: 20,
  },
  video: {
    height: 300,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Lobster-Regular',
    marginBottom: 15,
    textAlign: 'center',
    color: colors.text,
  },
  image: {
    aspectRatio: 1,
    height: 300,
  },
  label: {
    fontSize: 20,
    marginBottom: 5,
    color: colors.text,
  },
  inputContainer: {
    backgroundColor: colors.lemon,
    borderBottomWidth: 0,
  },
  inputContainerLarge: {
    backgroundColor: colors.lemon,
    borderBottomWidth: 0,
    minHeight: 100,
  },
  inputContainerStyle: {
    paddingHorizontal: 0,
  },
  uploadButton: {
    borderColor: colors.darkgreen,
    backgroundColor: colors.lemon,
  },
  uploadButtonText: {
    color: colors.mossgreen,
  },
});

export default Upload;
