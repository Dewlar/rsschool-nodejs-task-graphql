import { GraphQLList, GraphQLObjectType } from 'graphql/type/index.js';
import { MemberId, MemberType, Post, Profile, User } from './types/types.js';
import { UUIDType } from './types/uuid.js';
import { ResolveTree, simplifyParsedResolveInfoFragmentWithType, parseResolveInfo } from 'graphql-parse-resolve-info';
import { User as UserModel } from '@prisma/client';

export const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(User),
      resolve: async (_, _args, { prisma, dataLoader }, _info) => {

        const { fields } = simplifyParsedResolveInfoFragmentWithType(parseResolveInfo(_info) as ResolveTree, new GraphQLList(User));
        const includeUserSubscribedTo = 'userSubscribedTo' in fields;
        const includeSubscribedToUser = 'subscribedToUser' in fields;

        const users = await prisma.user.findMany({
          include: { userSubscribedTo: includeUserSubscribedTo, subscribedToUser: includeSubscribedToUser }
        });

        if (includeSubscribedToUser || includeUserSubscribedTo) {
          const usersSet = new Set<UserModel>();
          users.forEach((i: any) => usersSet.add(i));

          users.forEach((user: any) => {
            if (includeUserSubscribedTo) {
              dataLoader.userSubscribedTo.prime(
                user.id,
                user.userSubscribedTo.map((i: any) => Array.from(usersSet.values())
                .find(j => j.id === i.authorId) as UserModel));
            }

            if (includeSubscribedToUser) {
              dataLoader.subscribedToUser.prime(
                user.id,
                user.subscribedToUser.map((i: any) => Array.from(usersSet.values())
                .find(j => j.id === i.subscriberId) as UserModel));
            }
          });
        }

        return users;
      }
    },

    posts: {
      type: new GraphQLList(Post),
      resolve: async (_, _args, { prisma }) => await prisma.post.findMany()
    },

    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_, _args, { prisma }) => await prisma.memberType.findMany()
    },

    profiles: {
      type: new GraphQLList(Profile),
      resolve: async (_, _args, { prisma }) => await prisma.profile.findMany()
    },

    user: {
      type: User,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }, { prisma }, _info) => await prisma.user.findUnique({ where: { id }})
    },

    post: {
      type: Post,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }, { prisma }, _info) => await prisma.post.findUnique({ where: { id }})
    },

    memberType: {
      type: MemberType,
      args: { id: { type: MemberId } },
      resolve: async (_, { id }, { prisma }, _info) => await prisma.memberType.findUnique({ where: { id }})
    },

    profile: {
      type: Profile,
      args: { id: { type: UUIDType } },
      resolve: async (_, { id }, { prisma }, _info) => await prisma.profile.findUnique({ where: { id }})
    }
  }
})
