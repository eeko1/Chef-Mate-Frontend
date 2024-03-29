import {View, Text, TouchableOpacity} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {Card, Icon, ListItem, Button} from '@rneui/base';
import moment from 'moment';
import {MediaItemWithOwner} from '../types/DBTypes';
import {useUserContext} from '../hooks/ContextHooks';

type Props = {
  item: MediaItemWithOwner;
  navigation: NavigationProp<ParamListBase>;
};

const MediaListItem = ({item, navigation}: Props) => {
  const {user} = useUserContext();
  return (
    <Card containerStyle={{backgroundColor: '#144b29'}}>
      <Text>
        @{item.username} {moment(item.created_at).fromNow()}{' '}
      </Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Single Media', item);
        }}
      >
        <Card.Image
          style={{aspectRatio: 1, height: 300}}
          source={{uri: 'http:' + item.thumbnail}}
        />
        <Card.Divider />
        <Card.Title>{item.title}</Card.Title>
        <Card.Divider />
        <ListItem>
          {user && user.user_id === item.user_id ? (
            <>
              <Button
                onPress={() => {
                  navigation.navigate('Modify', item);
                }}
              >
                <Icon type="ionicon" name="create" color="white" />
              </Button>
              <Button
                color="error"
                onPress={() => {
                  console.log('delete');
                }}
              >
                {' '}
                <Icon type="ionicon" name="trash" color="white" />
              </Button>
            </>
          ) : (
            <>
              <Icon
                type="ionicon"
                name={item.media_type.includes('image') ? 'image' : 'film'}
              />
              <ListItem.Chevron color={'black'} />
            </>
          )}
        </ListItem>
      </TouchableOpacity>
    </Card>
  );
};
export default MediaListItem;
