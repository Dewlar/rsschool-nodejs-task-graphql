import { GraphQLNonNull, GraphQLString } from 'graphql/type/index.js';
import { Context } from '../types/context.js';
import { ChangeProfileDto, CreateProfileDto } from '../types/dto.js';
import { ChangeProfileInput, CreateProfileInput, Profile } from '../types/types.js';
import { UUIDType } from '../types/uuid.js';

export const createProfileMutation = {
  type: new GraphQLNonNull(Profile),
  args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
  resolve: async (_, { dto }: { dto: CreateProfileDto }, { prisma }: Context) =>
    await prisma.profile.create({ data: dto }),
}

export const changeProfileMutation = {
  type: new GraphQLNonNull(Profile),
  args: { id: { type: new GraphQLNonNull(UUIDType) }, dto: { type: new GraphQLNonNull(ChangeProfileInput) } },
  resolve: async (_, { id, dto }: { id: string; dto: ChangeProfileDto }, { prisma }: Context) =>
    await prisma.profile.update({ where: { id }, data: dto }),
}

export const deleteProfileMutation = {
  type: new GraphQLNonNull(GraphQLString),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, { id }: { id: string }, { prisma }: Context) => {
    const profile = await prisma.profile.delete({ where: { id } });
    return profile.id;
  },
}
