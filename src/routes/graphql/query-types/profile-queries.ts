import { GraphQLNonNull, GraphQLResolveInfo } from 'graphql/type/index.js';
import { Context } from '../types/context.js';
import { NonNullListOfNonNull } from '../types/non-null.js';
import { Profile } from '../types/types.js';
import { UUIDType } from '../types/uuid.js';

export const profileQuery = {
  type: Profile,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, { id }: { id: string }, { prisma }: Context, _info: GraphQLResolveInfo) =>
    await prisma.profile.findUnique({ where: { id }})
}

export const profilesQuery = {
  type: NonNullListOfNonNull(Profile),
  resolve: async (_, _args, { prisma }: Context) => await prisma.profile.findMany()
}
