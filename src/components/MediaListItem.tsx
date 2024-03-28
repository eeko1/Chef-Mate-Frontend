import {View, Text, TouchableOpacity, Image} from 'react-native';
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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: 10,
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
          <Text style={{color: colors.blue, fontSize: 20, paddingBottom: 10}}>
            @{item.username}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            navigation.navigate('Single Media', item);
          }}
        >
          <Card.Image
            style={{aspectRatio: 1, height: 300, borderRadius: 10}}
            source={{uri: 'http:' + item.thumbnail}}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 10,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 10,
              }}
            >
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon type="ionicon" name="heart" color="red" />
                <Text style={{color: colors.blue, fontSize: 20}}>
                  {item.likes ? item.likes.length : ' ' + 0}
                </Text>
              </View>
              <Card.Title
                style={{
                  color: colors.blue,
                  paddingTop: 14,
                  paddingLeft: 10,
                  fontSize: 20,
                }}
              >
                {item.title}
              </Card.Title>
            </View>
          </View>
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: colors.blue, fontSize: 20}}>
              Reviews: {item.ratings ? item.ratings.length : 0} {' ('}
              {item.ratings
                ? (
                    item.ratings.reduce((a, b) => a + b, 0) /
                    item.ratings.length
                  ).toFixed(1)
                : 0}{' '}
            </Text>
            <Icon type="ionicon" name="star" color="yellow" />
            <Text style={{color: colors.blue, fontSize: 20}}>)</Text>
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
