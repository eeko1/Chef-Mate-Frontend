import React, {useState} from 'react';
import {Image, View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMedia } from '../hooks/apiHooks'; // Import the postProfilePic function

export default function UploadImage() {
  const [image, setImage] = useState<ImagePicker.ImagePickerResult | null>(
    null,
  );
  const {postProfilePic} = useMedia();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.6,
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const token = await AsyncStorage.getItem('token');
        setImage(result);
        const selectedImage = result.assets[0];
        // Call the postProfilePic function with the selected image data
        await postProfilePic(selectedImage, token); // Pass your token here
      } else {
        console.log('Image selection cancelled.');
      }
    } catch (error) {
      console.log('Error picking image: ', error);
    }
  };

  return (
    <View style={imageUploaderStyles.container}>
      {image && (
        <Image
          source={{uri: image.assets[0].uri}}
          style={{width: 200, height: 200}}
        />
      )}
      <View style={imageUploaderStyles.uploadBtnContainer}>
        <TouchableOpacity
          onPress={pickImage}
          style={imageUploaderStyles.uploadBtn}
        >
          <Text>{image ? 'Edit' : 'Upload'} Image</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const imageUploaderStyles = StyleSheet.create({
  container: {
    height: 150,
    width: 150,
    backgroundColor: '#efefef',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 150 / 2,
    borderWidth: 3,
    borderColor: 'black',
    margin: 5,
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'lightgrey',
    width: '100%',
    height: '25%',
  },
  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
