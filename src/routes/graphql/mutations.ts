import { GraphQLObjectType } from 'graphql/type/index.js';
import {
  changePostMutation,
  createPostMutation,
  deletePostMutation,
} from './mutation-types/post-mutations.js';
import {
  changeProfileMutation,
  createProfileMutation,
  deleteProfileMutation,
} from './mutation-types/profile-mutations.js';
import {
  subscribeToMutations,
  unsubscribeFromMutations,
} from './mutation-types/subscribe-mutations.js';
import {
  changeUserMutation,
  createUserMutation,
  deleteUserMutation,
} from './mutation-types/user-mutations.js';

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser: createUserMutation,
    changeUser: changeUserMutation,
    deleteUser: deleteUserMutation,

    createPost: createPostMutation,
    changePost: changePostMutation,
    deletePost: deletePostMutation,

    createProfile: createProfileMutation,
    changeProfile: changeProfileMutation,
    deleteProfile: deleteProfileMutation,

    subscribeTo: subscribeToMutations,
    unsubscribeFrom: unsubscribeFromMutations,
  }),
});
