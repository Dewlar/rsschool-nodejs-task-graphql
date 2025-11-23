import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType,
  GraphQLString,
} from 'graphql/type/index.js';
import { MemberTypeId } from '../../member-types/schemas.js';
import { UUIDType } from './uuid.js';

export const MemberId: GraphQLEnumType = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberTypeId.BASIC]: { value: MemberTypeId.BASIC },
    [MemberTypeId.BUSINESS]: { value: MemberTypeId.BUSINESS }
  }
});

export const Profile: GraphQLObjectType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    user: { type: User },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberId) },
    memberType: {
      type: MemberType,
      resolve: async ({ memberTypeId }, _args, { dataLoader }) => await dataLoader.memberType.load(memberTypeId)
    },
  })
});

export const User: GraphQLObjectType  = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: GraphQLFloat },
    profile: {
      type: Profile,
      resolve: async ({ id }, _args, { dataLoader }) => await dataLoader.profile.load(id)
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: async ({ id }, _args, { dataLoader }) => await dataLoader.posts.load(id)
    },
    userSubscribedTo: {
      type: new GraphQLList(User),
      resolve: async ({ id }, _args, { dataLoader }) => await dataLoader.userSubscribedTo.load(id)
    },
    subscribedToUser: {
      type: new GraphQLList(User),
      resolve: async ({ id }, _args, { dataLoader }) => await dataLoader.subscribedToUser.load(id)
    }
  })
});

export const MemberType: GraphQLObjectType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
    profiles: { type: new GraphQLList(Profile) }
  })
});

export const Post: GraphQLObjectType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    author: { type: User }
  })
});

export const CreatePostInput: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType }
  })
});

export const CreateUserInput: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat }
  })
});

export const CreateProfileInput: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberId }
  })
});

export const ChangePostInput: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType }
  })
});

export const ChangeUserInput: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat }
  })
});

export const ChangeProfileInput: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberId }
  })
});
