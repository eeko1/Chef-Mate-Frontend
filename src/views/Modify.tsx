import {Controller, useForm} from 'react-hook-form';
import {Button, Card, Input} from '@rneui/base';
import {useEffect} from 'react';
import {TouchableOpacity, Keyboard, ScrollView, Alert} from 'react-native';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useMedia} from '../hooks/apiHooks';
import {useUpdateContext} from '../hooks/UpdateHook';
import {MediaItem, MediaItemWithOwner} from '../types/DBTypes';

const Modify = ({route}: any) => {
  const item: MediaItemWithOwner = route.params;
  const {putMedia} = useMedia();
  const {update, setUpdate} = useUpdateContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const initValues: Pick<MediaItem, 'title' | 'description'> = {
    title: item.title,
    description: item.description,
  };
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: initValues,
  });

  const resetForm = () => {
    reset(initValues);
  };

  const doModify = async (inputs: Pick<MediaItem, 'title' | 'description'>) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const mediaResponse = await putMedia(inputs, token, item.media_id);
        setUpdate(!update);
        Alert.alert(mediaResponse.message);
        navigation.navigate('My Files');
        resetForm();
      }
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      resetForm();
    });

    return unsubscribe;
  }, []);

  return (
    <ScrollView>
      <TouchableOpacity
        onPress={() => Keyboard.dismiss()}
        style={{flex: 1}}
        activeOpacity={1}
      >
        <Card>
          {item && item.media_type.includes('video') ? (
            <Video
              source={{uri: 'http:' + item.filename}}
              style={{height: 300}}
              useNativeControls
            />
          ) : (
            <Card.Image
              style={{aspectRatio: 1, height: 300}}
              source={{
                uri: 'http:' + item.filename,
              }}
            />
          )}
          <Card.Divider />
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Title tarttis laittaa',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Title"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.title?.message}
              />
            )}
            name="title"
          />

          <Controller
            control={control}
            rules={{
              maxLength: 1000,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Description"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value!} // hölmö virheilmoitus, laitoin !
                errorMessage={errors.description?.message}
                multiline={true}
                numberOfLines={5}
                style={{height: 120, textAlignVertical: 'top'}}
              />
            )}
            name="description"
          />
          <Button title="Modify" onPress={handleSubmit(doModify)} />
          <Card.Divider />
          <Button title="Reset" onPress={resetForm} />
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Modify;
