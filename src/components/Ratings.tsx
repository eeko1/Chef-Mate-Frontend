import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text} from '@rneui/base';
import React, {useEffect, useState} from 'react';
import {View, ViewStyle} from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import {useRating} from '../hooks/apiHooks';
import {MediaItemWithOwner} from '../types/DBTypes';

const Ratings = ({item, size}: {item: MediaItemWithOwner; size: number}) => {
  const [averageRating, setAverageRating] = useState<number>(0);
  const [userRating, setUserRating] = useState<number>(0);
  const {postRating, getRatingByMediaId, getUserRatings} = useRating();

  const ratingChange = async (ratingValue: number) => {
    setUserRating(Math.round(ratingValue));
  };

  const ratingCompleted = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        if (userRating >= 1 && userRating <= 5) {
          const response = await postRating(item.media_id, userRating, token);
          console.log('rating completed', response);
          fetchRating();
          fetchUserRating();
        } else {
          console.log('Rating value is not within the expected range (1-5)');
        }
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const fetchRating = async () => {
    try {
      const ratingResult = await getRatingByMediaId(item.media_id);
      const average = Number(ratingResult.average);
      if (isNaN(average)) {
        console.log('Fetched average rating is not a number');
        setAverageRating(0);
      } else {
        setAverageRating(average);
      }
    } catch (error) {
      console.log((error as Error).message);
      setAverageRating(0);
    }
  };

  const fetchUserRating = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const userRatings = await getUserRatings(token);
        console.log('userRatings', userRatings);
        const userRating = userRatings.find(
          (rating) => rating.media_id === item.media_id,
        );
        if (userRating) {
          setUserRating(userRating.rating_value);
        }
      }
    } catch (error) {
      console.log('fetcUserRating', (error as Error).message);
      setUserRating(0);
    }
  };

  useEffect(() => {
    fetchRating();
    fetchUserRating();
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      {averageRating === 0 ? (
        <Text>No ratings yet</Text>
      ) : (
        <>
          {userRating > 0 && <Text>Your rating: {userRating}</Text>}
          <Text>Average rating: {averageRating}</Text>
        </>
      )}
      <StarRating
        onChange={ratingChange}
        rating={averageRating}
        onRatingEnd={ratingCompleted}
        starSize={size}
      />
    </View>
  );
};

export default Ratings;
