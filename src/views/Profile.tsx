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
        <ScrollView style={{backgroundColor: '#144b29'}}>
          <Card>
            <Card.Image source={{uri: 'https://placekitten.com/300/300'}} />
            <ListItem>
              <Icon name="person" />
              <ListItem.Title>{user.username}</ListItem.Title>
            </ListItem>
            <Card.Divider />
            <Button onPress={() => navigation.navigate('My Files')}>
              My Posts &nbsp;
              <Icon name="folder" color="#0a1c13" />
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
