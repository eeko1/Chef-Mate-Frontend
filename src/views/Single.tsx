import {Card, Text, ListItem, Icon, Image} from '@rneui/themed';
import {Video, ResizeMode} from 'expo-av';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  View,
} from 'react-native';
import {MediaItemWithOwner} from '../types/DBTypes';
import Ratings from '../components/Ratings';
import Comments from '../components/Comments';
import Likes from '../components/Likes';
import colors from '../styles/colors';

const Single = ({route}: any) => {
  const item: MediaItemWithOwner = route.params;
  const [fileType, fileFormat] = item.media_type.split('&#x2F;');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={{
          backgroundColor: colors.darkgreen,
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Card containerStyle={{backgroundColor: colors.darkgreen}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                top: 20,
                zIndex: 1,
              }}
            >
              <Image
                source={{
                  uri: 'https://placehold.co/600x400/000000/FFFFFF/png?text=Profile\nImage',
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginRight: 10,
                }}
              />
              <Text
                style={{color: colors.blue, fontSize: 20, paddingBottom: 10}}
              >
                @{item.username}
              </Text>
            </View>
            {fileType === 'image' ? (
              <Card.Image
                style={{height: 350, aspectRatio: 1}}
                resizeMode="contain"
                source={{uri: 'http:' + item.filename}}
              />
            ) : (
              <Video
                style={{height: 350}}
                source={{uri: 'http:' + item.filename}}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
              />
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: -20,
              }}
            >
              <Icon type="ionicon" name="heart" color="red" />
              <Text style={{color: colors.blue, fontSize: 20}}>
                {item.Likes ? item.Likes.length : ' ' + 0}
              </Text>
              <Text
                style={{
                  color: colors.text,
                  marginLeft: 10,
                  fontSize: 20,
                }}
              >
                {item.title}
              </Text>
            </View>
            <Ratings item={item} size={35} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 5,
                  flex: 1,
                  alignItems: 'center',
                  marginRight: 5,
                }}
              >
                <Text>Reviews</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 5,
                  flex: 1,
                  alignItems: 'center',
                  marginLeft: 5,
                }}
              >
                <Text>Recipe Details</Text>
              </TouchableOpacity>
            </View>
            <Comments item={item} />
          </Card>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Single;
