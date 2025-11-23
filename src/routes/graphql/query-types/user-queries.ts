import { User as PrismaUser } from '@prisma/client';
import { parseResolveInfo, ResolveTree, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';
import { GraphQLNonNull, GraphQLResolveInfo } from 'graphql/type/index.js';
import { Context } from '../types/context.js';
import { NonNullListOfNonNull } from '../types/non-null.js';
import { User } from '../types/types.js';
import { UUIDType } from '../types/uuid.js';

export const userQuery = {
  type: User,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, { id }: { id: string }, { prisma }: Context, _info: GraphQLResolveInfo) =>
    await prisma.user.findUnique({ where: { id }})
}

export const usersQuery = {
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
}
