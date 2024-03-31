import {Card, Text, ListItem, Icon} from '@rneui/themed';
import {Video, ResizeMode} from 'expo-av';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {MediaItemWithOwner} from '../types/DBTypes';
import Ratings from '../components/Ratings';
import Comments from '../components/Comments';
import Likes from '../components/Likes';

const Single = ({route}: any) => {
  const item: MediaItemWithOwner = route.params;
  const [fileType, fileFormat] = item.media_type.split('&#x2F;');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Card>
            <Card.Title>{item.title}</Card.Title>
            <Likes item={item} />
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
            <Card.FeaturedSubtitle style={{color: 'black'}}>
              {item.description}
            </Card.FeaturedSubtitle>
            <ListItem>
              <Icon name="today" />
              <Text>{new Date(item.created_at).toLocaleString('fi-FI')}</Text>
            </ListItem>
            <ListItem>
              <Icon name="person" />
              <Text>{item.username}</Text>
            </ListItem>
            <ListItem>
              <Icon name="image" />
              <Text>
                {fileType} / {fileFormat}, {Math.round(item.filesize / 1024)} kB
              </Text>
            </ListItem>
            <Ratings item={item} size={35} />
            <Comments item={item} />
          </Card>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Single;
