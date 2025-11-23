import { GraphQLNonNull, GraphQLResolveInfo } from 'graphql/type/index.js';
import { Context } from '../types/context.js';
import { NonNullListOfNonNull } from '../types/non-null.js';
import { MemberId, MemberType } from '../types/types.js';

export const memberTypeQuery = {
  type: MemberType,
  args: { id: { type: new GraphQLNonNull(MemberId) } },
  resolve: async (_, { id }: { id: string }, { prisma }: Context, _info: GraphQLResolveInfo) =>
    await prisma.memberType.findUnique({ where: { id }})
}

export const membersTypeQuery = {
  type: NonNullListOfNonNull(MemberType),
  resolve: async (_, _args, { prisma }: Context) => await prisma.memberType.findMany()
}
