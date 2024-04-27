import {FlatList, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import {TextInput} from 'react-native-paper';
import {useMedia} from '../hooks/apiHooks';
import MediaListItem from '../components/MediaListItem';
import colors from '../styles/colors';

const Home = ({navigation}) => {
  const {mediaArray} = useMedia();
  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = (query) => setSearchQuery(query);

  const filteredMedia = useMemo(() => {
    return mediaArray.filter((item) =>
      item.ingredients.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, mediaArray]);

  return (
    <>
      <View style={{backgroundColor: colors.lightgreen}}>
        <TextInput
          placeholder="Search recipes by ingredients"
          value={searchQuery}
          onChangeText={onChangeSearch}
          style={{
            backgroundColor: colors.sage,
            margin: 10,
            minHeight: 50,
            fontSize: 20,
            borderRadius: 10,
          }}
        />
      </View>
      <FlatList
        style={{backgroundColor: colors.lightgreen}}
        data={filteredMedia}
        renderItem={({item}) => (
          <MediaListItem navigation={navigation} item={item} />
        )}
        keyExtractor={(item) => item?.id?.toString()}
      />
    </>
  );
};

export default Home;
