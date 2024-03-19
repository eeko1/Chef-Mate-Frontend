import {Controller, useForm} from 'react-hook-form';
import {Button, Card, Input, Text} from '@rneui/base';
import * as ImagePicker from 'expo-image-picker';
import {useEffect, useState} from 'react';
import {TouchableOpacity, Keyboard, ScrollView, Alert} from 'react-native';
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
  const [image, setImage] = useState<ImagePicker.ImagePickerResult | null>(
    null,
  );
  const {postExpoFile} = useFile();
  const {postMedia} = useMedia();
  const {update, setUpdate} = useUpdateContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const initValues = {title: '', description: ''};
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

  const doUpload = async (inputs: {title: string; description: string}) => {
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
    // No permissions request is necessary for launching the image library
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
  }, []);

  return (
    <ScrollView style={{backgroundColor: colors.darkgreen}}>
      <TouchableOpacity
        onPress={() => Keyboard.dismiss()}
        style={{flex: 1, backgroundColor: colors.darkgreen}}
        activeOpacity={1}
      >
        <Card
          containerStyle={{
            backgroundColor: colors.darkgreen,
            borderWidth: 0,
            shadowColor: 'transparent',
          }}
        >
          {image && image.assets![0].mimeType?.includes('video') ? (
            <Video
              source={{uri: image.assets![0].uri}}
              style={{height: 300}}
              useNativeControls
            />
          ) : (
            <>
              <Text
                style={{
                  fontSize: 30,
                  marginBottom: 15,
                  textAlign: 'center',
                  color: colors.text,
                }}
              >
                Chef Mate
              </Text>
              <Card.Image
                onPress={pickImage}
                style={{aspectRatio: 1, height: 300}}
                source={{
                  uri: image
                    ? image.assets![0].uri
                    : 'https://via.placeholder.com/150?text=Choose+media',
                }}
              />
            </>
          )}
          <Card.Divider />
          <Text style={{fontSize: 20, marginBottom: 5, color: colors.text}}>
            Recipe Title
          </Text>
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
                style={{backgroundColor: colors.mossgreen}}
              />
            )}
            name="title"
          />
          <Text style={{fontSize: 20, marginBottom: 5, color: colors.text}}>
            Ingredients
          </Text>
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
                style={{backgroundColor: colors.mossgreen}}
              />
            )}
            name="ingredients"
          />
          <Text style={{fontSize: 20, marginBottom: 5, color: colors.text}}>
            Instructions
          </Text>
          <Controller
            control={control}
            rules={{
              maxLength: 1000,
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
                style={{
                  height: 120,
                  textAlignVertical: 'top',
                  backgroundColor: colors.mossgreen,
                }}
              />
            )}
            name="description"
          />
          <Button title="Choose media" onPress={pickImage} />
          <Card.Divider />
          <Button title="Upload" onPress={handleSubmit(doUpload)} />
          <Card.Divider />
          <Button title="Reset" onPress={resetForm} />
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Upload;
