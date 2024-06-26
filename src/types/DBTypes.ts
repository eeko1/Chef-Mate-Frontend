type UserLevel = {
  level_id: number; // REST API
  // level_id: string; // GraphQL
  level_name: 'Admin' | 'User' | 'Guest';
};

type User = {
  user_id: number;
  username: string;
  password: string;
  email: string;
  user_level_id: number;
  // profile_picture_filename?: string; // Optional profile picture filename
  //profile_picture_filesize?: number; // Optional profile picture filesize
  //profile_picture_media_type?: string; // Optional profile picture media type
  profile_picture_url?: string; // Optional profile picture URL
  created_at: Date | string;
};


type MediaItem = {
  media_id: number; // REST API
  user_id: number; // REST API
  // media_id: string; // GraphQL
  // user_id: string; // GraphQL
  filename: string;
  thumbnail: string;
  filesize: number;
  media_type: string;
  title: string;
  ingredients: string | null;
  description: string | null;
  created_at: Date | string;
  profile_picture_url?: string;
};

type Comment = {
  comment_id: number; // REST API
  media_id: number; // REST API
  // comment_id: string; // GraphQL
  // media_id: string; // GraphQL
  user_id: number;
  comment_text: string;
  created_at: Date;
};

type Like = {
  like_id: number; // REST API
  media_id: number; // REST API
  user_id: number; // REST API
  // like_id: string; // GraphQL
  // media_id: string; // GraphQL
  // user_id: string; // GraphQL
  created_at: Date;
};

type Rating = {
  rating_id: number; // REST API
  media_id: number; // REST API
  user_id: number; // REST API
  // rating_id: string; // GraphQL
  // media_id: string; // GraphQL
  // user_id: string; // GraphQL
  rating_value: number;
  created_at: Date;
};

type UserFollow = {
  userfollow_id: number;
  follower_id: number;
  followed_id: number;
  created_at: Date | string;
};

type Tag = {
  tag_id: number; // REST API
  // tag_id: string; // GraphQL
  tag_name: string;
};

type MediaItemTag = {
  media_id: number; // REST API
  tag_id: number; // REST API
  // media_id: string; // GraphQL
  // tag_id: string; // GraphQL
};

type TagResult = MediaItemTag & Tag;

type UploadResult = {
  message: string;
  data?: {
    image: string;
  };
};

type MostLikedMedia = Pick<
  MediaItem,
  | 'media_id'
  | 'filename'
  | 'filesize'
  | 'media_type'
  | 'title'
  | 'description'
  | 'ingredients'
  | 'created_at'
> &
  Pick<User, 'user_id' | 'username' | 'email' | 'created_at'> & {
    likes_count: bigint;
  };

// type gymnastics to get rid of user_level_id from User type and replace it with level_name from UserLevel type
type UserWithLevel = Omit<User, 'user_level_id'> &
  Pick<UserLevel, 'level_name'>;

type UserWithNoPassword = Omit<UserWithLevel, 'password'> & {token: string};

type TokenContent = Pick<User, 'user_id'> & Pick<UserLevel, 'level_name'>;

// for REST API
type MediaItemWithOwner = MediaItem &
  Pick<User, 'username'> & {
    likes: Like[];
    id?: number;
    tags?: Tag[];
    ratings?: Rating[];
    likes_count: number;
    average_rating?: number;
    comments_count: number;
    myLikedMedia?: number;
  };

type UserIdWithFollow = {
  userId: number;
  followedId: number;
};

// FOR GRAPHQL
// type MediaItemWithOwner = MediaItem & {
//   owner: User;
//   tags?: Tag[];
//   likes?: Like[];
//   ratings?: Rating[];
//   likes_count: number;
//   average_rating?: number;
//   comments_count: number;
// };

// for upload server
type FileInfo = {
  filename: string;
  user_id: number;
};

export type {
  UserLevel,
  User,
  MediaItem,
  Comment,
  Like,
  UserFollow,
  Rating,
  Tag,
  MediaItemTag,
  TagResult,
  UploadResult,
  MostLikedMedia,
  UserWithLevel,
  UserWithNoPassword,
  TokenContent,
  MediaItemWithOwner,
  UserIdWithFollow,
  FileInfo,
};
