import {FlatList, View} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {Card, SearchBar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import {useMedia} from '../hooks/apiHooks';
import MediaListItem from '../components/MediaListItem';
import colors from '../styles/colors';

const Home = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  const {mediaArray} = useMedia();

  return (
    <>
      <View
        style={{
          backgroundColor: colors.lightgreen,
        }}
      >
        <Card.Image
          source={require('../../assets/logo.png')}
          style={{
            height: 100,
            width: 200,
            marginLeft: 70,
          }}
        />
        <SearchBar
          placeholder="Search for a recipe"
          containerStyle={{
            backgroundColor: colors.lightgreen,
            borderBottomColor: 'transparent',
            borderTopColor: 'transparent',
          }}
          inputContainerStyle={{backgroundColor: colors.sage}}
          inputStyle={{color: colors.darkgreen, fontSize: 20}}
          placeholderTextColor={colors.darkgreen}
          onBlur={undefined}
          onChangeText={undefined}
          onFocus={undefined}
          value={''}
          platform={'default'}
          clearIcon={undefined}
          searchIcon={<Icon name="search" color={colors.darkgreen} />}
          loadingProps={undefined}
          showLoading={false}
          onClear={undefined}
          onCancel={undefined}
          lightTheme={false}
          round={true}
          cancelButtonTitle={''}
          cancelButtonProps={undefined}
          showCancel={false}
        />
      </View>
      <FlatList
        style={{backgroundColor: colors.lightgreen}}
        data={mediaArray}
        renderItem={({item}) => (
          <MediaListItem navigation={navigation} item={item} />
        )}
      />
    </>
  );
};

export default Home;
