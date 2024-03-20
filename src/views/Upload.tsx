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
import * as Font from 'expo-font';
import {useFile, useMedia} from '../hooks/apiHooks';
import {useUpdateContext} from '../hooks/UpdateHook';
import colors from '../styles/colors';

async function loadFonts() {
  await Font.loadAsync({
    LogoFont: require('../styles/Fonts/Cherish-Regular.ttf'),
  });
}

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

  const doUpload = async (inputs: {title: string; description: string; ingredients: string}) => {
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
    loadFonts();
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
            paddingHorizontal: 20,
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
                  fontFamily: 'LogoFont',
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
                inputContainerStyle={{
                  backgroundColor: colors.mossgreen,
                  borderBottomWidth: 0,
                }}
                containerStyle={{paddingHorizontal: 0}}
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
                inputContainerStyle={{
                  backgroundColor: colors.mossgreen,
                  borderBottomWidth: 0,
                }}
                containerStyle={{paddingHorizontal: 0}}
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
                inputContainerStyle={{
                  height: 120,
                  textAlignVertical: 'top',
                  backgroundColor: colors.mossgreen,
                  borderBottomWidth: 0,
                }}
                containerStyle={{paddingHorizontal: 0}}
              />
            )}
            name="description"
          />
          <Card.Divider />
          <Button
            title="Upload"
            onPress={handleSubmit(doUpload)}
            buttonStyle={{
              borderWidth: 0.5,
              borderColor: 'black',
              backgroundColor: colors.softgreen,
            }}
            titleStyle={{color: 'black'}}
          />
          <Card.Divider />
          <Button title="Reset" onPress={resetForm} />
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Upload;
