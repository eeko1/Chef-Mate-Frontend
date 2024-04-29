import {User, UserWithNoPassword} from './DBTypes';
export type Credentials = Pick<User, 'username' | 'password' | 'email'>;

export type AuthContextType = {
  user: UserWithNoPassword | null;
  handleLogin: (credentials: Credentials) => void;
  handleLogout: () => void;
  handleAutoLogin: () => void;
  handlePut: (
    userId: number,
    inputs: Pick<UserWithNoPassword, 'username' | 'email'>,
  ) => void;
};

type GraphQLResponse<T> = {
  data: T;
  errors?: {message: string}[];
};
export type {GraphQLResponse};
