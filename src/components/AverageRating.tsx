import React, {useState, useEffect} from 'react';
import {Text} from 'react-native';
import {MediaItemWithOwner} from '../types/DBTypes';
import {useRating} from '../hooks/apiHooks';

const AverageRating = ({item}: {item: MediaItemWithOwner}) => {
  const [averageRating, setAverageRating] = useState<number>(0);
  const {getRatingByMediaId} = useRating();

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

  useEffect(() => {
    fetchRating();
  }, []);

  return typeof averageRating === 'number' ? averageRating.toFixed(1) : '0';
};

export default AverageRating;
