import {Controller, useForm} from 'react-hook-form';
import {Text, Card, Input, Icon} from '@rneui/base';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useUserContext} from '../hooks/ContextHooks';
import {Credentials} from '../types/LocalTypes';

const LoginForm = () => {
  const {handleLogin} = useUserContext();
  const initValues: Credentials = {username: '', password: '', email: ''};
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: initValues,
  });

  const doLogin = async (inputs: Credentials) => {
    handleLogin(inputs);
  };

  return (
    <Card containerStyle={styles.container}>
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Username is required',
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
      <TouchableOpacity style={styles.button} onPress={handleSubmit(doLogin)}>
        <Text style={styles.button}>Login</Text>
        <Icon name="logout" color="black" />
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
  button: {
    backgroundColor: '#7EAA92',
    color: 'black',
    alignItems: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default LoginForm;
