import { GraphQLNonNull, GraphQLResolveInfo } from 'graphql/type/index.js';
import { Context } from '../types/context.js';
import { NonNullListOfNonNull } from '../types/non-null.js';
import { Post } from '../types/types.js';
import { UUIDType } from '../types/uuid.js';

export const postQuery = {
  type: Post,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, { id }: { id: string }, { prisma }: Context, _info: GraphQLResolveInfo) =>
    await prisma.post.findUnique({ where: { id }})
}

export const postsQuery =  {
  type: NonNullListOfNonNull(Post),
  resolve: async (_, _args, { prisma }: Context) => await prisma.post.findMany()
}
