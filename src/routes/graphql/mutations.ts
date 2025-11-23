import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql/type/index.js';
import { Context } from './types/context.js';
import {
  ChangePostInput, ChangeProfileInput,
  ChangeUserInput,
  CreatePostInput,
  CreateProfileInput,
  CreateUserInput, Post, Profile, User,
} from './types/types.js';
import { UUIDType } from './types/uuid.js';

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createPost: {
      type: Post,
      args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
      resolve: async (_, { dto }, { prisma }: Context) => await prisma.post.create({ data: dto }),
    },

    createUser: {
      type: User,
      args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
      resolve: async (_, { dto }, { prisma }: Context) => await prisma.user.create({ data: dto }),
    },

    createProfile: {
      type: Profile,
      args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
      resolve: async (_, { dto }, { prisma }: Context) => await prisma.profile.create({ data: dto }),
    },

    deletePost: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }, { prisma }: Context) => {
        const post = await prisma.post.delete({ where: { id } });
        return post.id;
      },
    },

    deleteUser: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }, { prisma }: Context) => {
        const user = await prisma.user.delete({ where: { id } });
        return user.id;
      },
    },

    deleteProfile: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }, { prisma }: Context) => {
        const profile = await prisma.profile.delete({ where: { id } });
        return profile.id;
      },
    },

    changePost: {
      type: Post,
      args: { id: { type: new GraphQLNonNull(UUIDType) }, dto: { type: ChangePostInput } },
      resolve: async (_, { id, dto }, { prisma }: Context) => await prisma.post.update({ where: { id }, data: dto })
    },

    changeUser: {
      type: User,
      args: { id: { type: new GraphQLNonNull(UUIDType) }, dto: { type: ChangeUserInput } },
      resolve: async (_, { id, dto }, { prisma }: Context) => await prisma.user.update({ where: { id }, data: dto })
    },

    changeProfile: {
      type: Profile,
      args: { id: { type: new GraphQLNonNull(UUIDType) }, dto: { type: ChangeProfileInput } },
      resolve: async (_, { id, dto }, { prisma }: Context) => await prisma.profile.update({ where: { id }, data: dto }),
    },

    subscribeTo: {
      type: GraphQLString,
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType }
      },
      resolve: async (_parent, { userId, authorId }, { prisma }: Context) => {
        await prisma.subscribersOnAuthors.create({ data: { subscriberId: userId, authorId } });
        return userId;
      },
    },

    unsubscribeFrom: {
      type: GraphQLString,
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType }
      },
      resolve: async (_parent, { userId, authorId }, { prisma }: Context) => (await prisma.subscribersOnAuthors.delete({
        where: { subscriberId_authorId: { subscriberId: userId, authorId } },
      })).authorId,
    }
  })
});
