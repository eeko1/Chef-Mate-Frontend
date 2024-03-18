import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Button, Card, Icon, ListItem} from '@rneui/base';
import {ScrollView} from 'react-native';
import {useUserContext} from '../hooks/ContextHooks';

const Profile = () => {
  const {handleLogout, user} = useUserContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  return (
    <>
      {user && (
        <ScrollView>
          <Card>
            <Card.Image source={{uri: 'https://placekitten.com/300/300'}} />
            <ListItem>
              <Icon name="person" />
              <ListItem.Title>{user.username}</ListItem.Title>
            </ListItem>
            <ListItem>
              <Icon name="email" />
              <ListItem.Title>{user.email}</ListItem.Title>
            </ListItem>
            <ListItem>
              <ListItem.Title>user id: {user.user_id}</ListItem.Title>
            </ListItem>
            <Card.Divider />
            <Button onPress={() => navigation.navigate('My Files')}>
              My Files &nbsp;
              <Icon name="folder" color="white" />
            </Button>
            <Card.Divider />
            <Button onPress={handleLogout}>
              Logout &nbsp;
              <Icon name="logout" color="white" />
            </Button>
          </Card>
        </ScrollView>
      )}
    </>
  );
};

export default Profile;
