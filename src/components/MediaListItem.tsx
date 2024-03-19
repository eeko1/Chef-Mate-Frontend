import {View, Text, TouchableOpacity} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {Card, Icon, ListItem, Button} from '@rneui/base';
import moment from 'moment';
import {MediaItemWithOwner} from '../types/DBTypes';
import {useUserContext} from '../hooks/ContextHooks';
import colors from '../styles/colors';

type Props = {
  item: MediaItemWithOwner;
  navigation: NavigationProp<ParamListBase>;
};

const MediaListItem = ({item, navigation}: Props) => {
  const {user} = useUserContext();
  return (
    <View style={{paddingBottom: 70}}>
      <Card
        containerStyle={{
          backgroundColor: colors.lightgreen,
          borderWidth: 0,
          shadowColor: 'transparent',
        }}
      >
        <Text style={{color: colors.blue, fontSize: 20, paddingBottom: 10}}>
          @{item.username}
        </Text>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            navigation.navigate('Single Media', item);
          }}
        >
          <Card.Image
            style={{aspectRatio: 1, height: 300}}
            source={{uri: 'http:' + item.thumbnail}}
          />

          <Card.Title style={{color: colors.blue, paddingTop: 10}}>
            {item.title}
          </Card.Title>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
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
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Single Media', item);
                }}
              ></TouchableOpacity>
            )}
          </View>
          <Text style={{paddingTop: 10, color: colors.blue}}>
            {moment(item.created_at).fromNow()}{' '}
          </Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
};
export default MediaListItem;
