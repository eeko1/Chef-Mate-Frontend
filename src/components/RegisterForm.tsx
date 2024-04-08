import {Controller, useForm} from 'react-hook-form';
import {Card, Input} from '@rneui/base';
import {Alert, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {useUser} from '../hooks/apiHooks';
import UploadImage from './ImagePicker';

const RegisterForm = ({handleToggle}: {handleToggle: () => void}) => {
  const {postUser, getUsernameAvailable, getEmailAvailable} = useUser();
  const initValues = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  };
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: initValues,
    mode: 'onBlur',
  });

  const doRegister = async (inputs: {
    username: string;
    password: string;
    confirmPassword?: string;
    email: string;
  }) => {
    try {
      delete inputs.confirmPassword;
      await postUser(inputs);
      Alert.alert('User created', 'You can now login');
      handleToggle();
    } catch (error) {
      console.log('Error', (error as Error).message);
    }
  };

  return (
    <Card containerStyle={styles.container}>
      <UploadImage />
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Username is required',
          },
          validate: async (value) => {
            try {
              const {available} = await getUsernameAvailable(value);
              console.log('username available?', value, available);
              return available ? available : 'Username taken';
            } catch (error) {
              console.log((error as Error).message);
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            errorMessage={errors.username?.message}
            style={styles.username}
          />
        )}
        name="username"
      />

      <Controller
        control={control}
        rules={{
          maxLength: 100,
          // pattern: {
          //   value:
          //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,}$/,
          //   message:
          //     'Password must contain at least 5 characters, 1 special character (@, $, !, %, *, #, ?, &), and 1 number',
          // },
          required: {value: true, message: 'Password is required'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.password?.message}
            style={styles.password}
          />
        )}
        name="password"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Password is required'},
          validate: (value) =>
            value === getValues().password ? true : 'Passwords do not match',
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Confirm password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.confirmPassword?.message}
            style={styles.password}
          />
        )}
        name="confirmPassword"
      />

      <Controller
        control={control}
        rules={{
          maxLength: 100,
          required: {value: true, message: 'Email is required'},
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: 'Invalid email address',
          },
          validate: async (value) => {
            try {
              const {available} = await getEmailAvailable(value);
              return available ? available : 'Email taken';
            } catch (error) {
              console.log((error as Error).message);
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.email?.message}
            autoCapitalize="none"
            style={styles.email}
          />
        )}
        name="email"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(doRegister)}
      >
        <Text style={styles.button}>Register</Text>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#7EAA92',
  },
  username: {
    color: 'white',
    backgroundColor: '#C8E4B2',
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
  },
  password: {
    color: 'white',
    backgroundColor: '#C8E4B2',
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
  },
  email: {
    color: 'white',
    backgroundColor: '#C8E4B2',
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
  },
  button: {
    backgroundColor: '#7EAA92',
    color: 'black',
    alignItems: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default RegisterForm;
