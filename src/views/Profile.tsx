import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Card, Icon, ListItem} from '@rneui/base';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import {useUserContext} from '../hooks/ContextHooks';

const Profile = () => {
  const {handleLogout, user} = useUserContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  return (
    <>
      {user && (
        <ScrollView contentContainerStyle={styles.container}>
          <Card.Image
            source={{uri: 'https://placekitten.com/300/300'}}
            style={styles.image}
          />
          <ListItem containerStyle={styles.listItem}>
            <ListItem.Title style={styles.listItemTitle}>
              {user.username}
            </ListItem.Title>
          </ListItem>
          <View style={styles.stats}>
            <ListItem containerStyle={styles.listItem}>
              <ListItem.Title style={styles.listItemTitle}>
                Followers
              </ListItem.Title>
            </ListItem>
            <ListItem containerStyle={styles.listItem}>
              <ListItem.Title style={styles.listItemTitle}>
                Recipes
              </ListItem.Title>
            </ListItem>
          </View>
          <View style={styles.stats}>
            <ListItem containerStyle={styles.listItem}>
              <ListItem.Title style={styles.listItemTitle}>
                Following
              </ListItem.Title>
            </ListItem>
            <ListItem containerStyle={styles.listItem}>
              <ListItem.Title style={styles.listItemTitle}>
                Reviews
              </ListItem.Title>
            </ListItem>
          </View>
          <View style={styles.buttons}>
            <Card.Divider />
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('My Files')}
            >
              <Text style={styles.buttonText}>My Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>My saved posts</Text>
            </TouchableOpacity>
            <Card.Divider />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
            <Icon name="logout" color="#86934f" />
          </TouchableOpacity>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#7EAA92',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    borderWidth: 3,
    borderColor: 'black',
  },
  username: {
    color: 'white',
    backgroundColor: '#0a1c13',
  },
  listItem: {
    backgroundColor: '#0a1c13',
  },
  listItemTitle: {
    backgroundColor: '#0a1c13',
    color: 'white',
  },
  stats: {
    flexDirection: 'row',
    padding: 5,
  },
  button: {
    backgroundColor: '#C8E4B2',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
  },
  buttons: {
    flexDirection: 'row',
  },
});

export default Profile;
