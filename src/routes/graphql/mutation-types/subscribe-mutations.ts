import { GraphQLNonNull, GraphQLString } from 'graphql/type/index.js';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';

export const subscribeToMutations = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) }
  },
  resolve: async (_, { userId, authorId }: { userId: string, authorId: string }, { prisma }: Context) => {
    await prisma.subscribersOnAuthors.create({ data: { subscriberId: userId, authorId } });
    return userId;
  },
}

export const unsubscribeFromMutations = {
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
