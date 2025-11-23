import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql/type/index.js';
import { Context } from './types/context.js';
import {
  ChangePostDto,
  ChangeProfileDto,
  ChangeUserDto,
  CreatePostDto,
  CreateProfileDto,
  CreateUserDto,
} from './types/dto.js';
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
      type: new GraphQLNonNull(Post),
      args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
      resolve: async (_, { dto }: { dto: CreatePostDto }, { prisma }: Context) =>
        await prisma.post.create({ data: dto }),
    },

    createUser: {
      type: new GraphQLNonNull(User),
      args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
      resolve: async (_, { dto }: { dto: CreateUserDto }, { prisma }: Context) =>
        await prisma.user.create({ data: dto }),
    },

    createProfile: {
      type: new GraphQLNonNull(Profile),
      args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
      resolve: async (_, { dto }: { dto: CreateProfileDto }, { prisma }: Context) =>
        await prisma.profile.create({ data: dto }),
    },

    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }, { prisma }: Context) => {
        const post = await prisma.post.delete({ where: { id } });
        return post.id;
      },
    },

    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }, { prisma }: Context) => {
        const user = await prisma.user.delete({ where: { id } });
        return user.id;
      },
    },

    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }, { prisma }: Context) => {
        const profile = await prisma.profile.delete({ where: { id } });
        return profile.id;
      },
    },

    changePost: {
      type: new GraphQLNonNull(Post),
      args: { id: { type: new GraphQLNonNull(UUIDType) }, dto: { type: new GraphQLNonNull(ChangePostInput) } },
      resolve: async (_, { id, dto }: { id: string; dto: ChangePostDto }, { prisma }: Context) =>
        await prisma.post.update({ where: { id }, data: dto })
    },

    changeUser: {
      type: new GraphQLNonNull(User),
      args: { id: { type: new GraphQLNonNull(UUIDType) }, dto: { type: new GraphQLNonNull(ChangeUserInput) } },
      resolve: async (_, { id, dto }: { id: string; dto: ChangeUserDto }, { prisma }: Context) =>
        await prisma.user.update({ where: { id }, data: dto })
    },

    changeProfile: {
      type: new GraphQLNonNull(Profile),
      args: { id: { type: new GraphQLNonNull(UUIDType) }, dto: { type: new GraphQLNonNull(ChangeProfileInput) } },
      resolve: async (_, { id, dto }: { id: string; dto: ChangeProfileDto }, { prisma }: Context) =>
        await prisma.profile.update({ where: { id }, data: dto }),
    },

    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_, { userId, authorId }: { userId: string, authorId: string }, { prisma }: Context) => {
        await prisma.subscribersOnAuthors.create({ data: { subscriberId: userId, authorId } });
        return userId;
      },
    },

    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_, { userId, authorId }: { userId: string, authorId: string }, { prisma }: Context) =>
        (await prisma.subscribersOnAuthors.delete({
          where: { subscriberId_authorId: { subscriberId: userId, authorId } },
        })).authorId,
    }
  })
});
