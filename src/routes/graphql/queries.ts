import { GraphQLNonNull, GraphQLObjectType, GraphQLResolveInfo } from 'graphql/type/index.js';
import { Context } from './types/context.js';
import { NonNullListOfNonNull } from './types/non-null.js';
import { MemberId, MemberType, Post, Profile, User } from './types/types.js';
import { UUIDType } from './types/uuid.js';
import { ResolveTree, simplifyParsedResolveInfoFragmentWithType, parseResolveInfo } from 'graphql-parse-resolve-info';
import { User as PrismaUser } from '@prisma/client';

export const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: NonNullListOfNonNull(User),
      resolve: async (_, _args, { prisma, dataLoader }: Context, _info: GraphQLResolveInfo) => {
        const parsedResolveInfo = parseResolveInfo(_info) as ResolveTree;
        const { fields } = simplifyParsedResolveInfoFragmentWithType(parsedResolveInfo, NonNullListOfNonNull(User));

        const includeUserSubscribedTo = 'userSubscribedTo' in fields;
        const includeSubscribedToUser = 'subscribedToUser' in fields;

        const users = await prisma.user.findMany({
          include: { userSubscribedTo: includeUserSubscribedTo, subscribedToUser: includeSubscribedToUser }
        });

        if (includeSubscribedToUser || includeUserSubscribedTo) {
          const usersSet = new Set<PrismaUser>();
          users.forEach((u) => usersSet.add(u));

          users.forEach((user) => {
            if (includeUserSubscribedTo) {
              dataLoader.userSubscribedTo.prime(
                user.id,
                user.userSubscribedTo.map((u) => Array.from(usersSet.values())
                .find(j => j.id === u.authorId) as PrismaUser));
            }

            if (includeSubscribedToUser) {
              dataLoader.subscribedToUser.prime(
                user.id,
                user.subscribedToUser.map((u) => Array.from(usersSet.values())
                .find(j => j.id === u.subscriberId) as PrismaUser));
            }
          });
        }

        return users;
      }
    },

    posts: {
      type: NonNullListOfNonNull(Post),
      resolve: async (_, _args, { prisma }: Context) => await prisma.post.findMany()
    },

    memberTypes: {
      type: NonNullListOfNonNull(MemberType),
      resolve: async (_, _args, { prisma }: Context) => await prisma.memberType.findMany()
    },

    profiles: {
      type: NonNullListOfNonNull(Profile),
      resolve: async (_, _args, { prisma }: Context) => await prisma.profile.findMany()
    },

    user: {
      type: User,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }, { prisma }: Context, _info: GraphQLResolveInfo) =>
        await prisma.user.findUnique({ where: { id }})
    },

    post: {
      type: Post,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }, { prisma }: Context, _info: GraphQLResolveInfo) =>
        await prisma.post.findUnique({ where: { id }})
    },

    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberId) } },
      resolve: async (_, { id }: { id: string }, { prisma }: Context, _info: GraphQLResolveInfo) =>
        await prisma.memberType.findUnique({ where: { id }})
    },

    profile: {
      type: Profile,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }, { prisma }: Context, _info: GraphQLResolveInfo) =>
        await prisma.profile.findUnique({ where: { id }})
    }
  }
})
