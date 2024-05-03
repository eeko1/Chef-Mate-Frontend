import {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {Input, Card, Button, ListItem} from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useUserContext} from '../hooks/ContextHooks';
import {Comment, MediaItemWithOwner} from '../types/DBTypes';
import {useComment} from '../hooks/apiHooks';
import colors from '../styles/colors';
import React from 'react';

const Comments = ({item}: {item: MediaItemWithOwner}) => {
  const [comments, setComments] = useState<
    (Comment & {
      username: string;
    })[]
  >([]);
  const {user} = useUserContext();
  const {getCommentsByMediaId, postComment} = useComment();
  const navigation = useNavigation();

  const initValues = {comment_text: ''};

  const {
    reset,
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: initValues,
  });

  const doComment = async (inputs: {comment_text: string}) => {
    const token = await AsyncStorage.getItem('token');
    if (!user || !token) {
      return;
    }
    try {
      await postComment(inputs.comment_text, item.media_id, token);
      await getComments();
      // resetoi lomake
      reset();
    } catch (error) {
      console.error('postComment failed', error);
    }
  };

  const getComments = async () => {
    try {
      const comments = await getCommentsByMediaId(item.media_id);
      setComments(comments);
    } catch (error) {
      console.log('getComments failed', error);
      setComments([]);
    }
  };

  useEffect(() => {
    getComments();

    const unsubscribe = navigation.addListener('focus', () => {
      reset();
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <Card containerStyle={{backgroundColor: colors.sage, borderRadius: 5}}>
        <Card.Title style={{color: colors.text, fontSize: 18}}>
          Reviews
        </Card.Title>

        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <View
              key={index}
              style={{
                backgroundColor: colors.sage,
                marginBottom: 10,
                padding: 8,
                borderRadius: 5,
              }}
            >
              <Text style={{color: colors.text, fontWeight: 'bold'}}>
                {comment.username}:
              </Text>
              <Text style={{color: colors.text}}>{comment.comment_text}</Text>
              <Text style={{color: colors.text}}>
                Posted on{' '}
                {new Date(comment.created_at).toLocaleDateString('fi-FI')}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{color: colors.text, textAlign: 'center', padding: 10}}>
            No reviews yet.
          </Text>
        )}

        {user && (
          <>
            <Card.Divider style={{backgroundColor: colors.text}} />
            <Card.Title style={{color: colors.text, fontSize: 18}}>
              Post Review
            </Card.Title>
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'A review is required.',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.comment_text?.message}
                  placeholder="Write a review"
                  multiline={true}
                  inputStyle={{
                    backgroundColor: colors.comment,
                    color: colors.text,
                  }}
                  placeholderTextColor={colors.text}
                />
              )}
              name="comment_text"
            />
            <Button
              onPress={handleSubmit(doComment)}
              title={'Post'}
              buttonStyle={{backgroundColor: colors.comment, marginTop: 10}}
              titleStyle={{color: colors.text}}
            />
          </>
        )}
      </Card>
    </>
  );
};

export default Comments;
