import {FlatList, View, Text} from 'react-native';
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
    if (!searchQuery) return mediaArray;

    const searchTerms = searchQuery
      .toLowerCase()
      .split(/\s+|,/)
      .map((term) => term.trim())
      .filter((term) => term);

    return mediaArray.filter((item) => {
      const ingredients = item.ingredients
        .toLowerCase()
        .split(/[,&]+| and /)
        .map((ingredient) => ingredient.trim());

      return searchTerms.every((term) =>
        ingredients.some((ingredient) => ingredient.includes(term)),
      );
    });
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
      {filteredMedia.length > 0 ? (
        <FlatList
          style={{backgroundColor: colors.lightgreen}}
          data={filteredMedia}
          renderItem={({item}) => (
            <MediaListItem navigation={navigation} item={item} />
          )}
          keyExtractor={(item) => item?.id?.toString()}
        />
      ) : (
        <View
          style={{
            backgroundColor: colors.lightgreen,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{color: 'black', fontSize: 20}}>
            Could not find any recipes by those ingredients.
          </Text>
        </View>
      )}
    </>
  );
};

export default Home;
