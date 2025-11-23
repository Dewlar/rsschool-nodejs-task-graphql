import { GraphQLNonNull, GraphQLString } from 'graphql/type/index.js';
import { Context } from '../types/context.js';
import { ChangeUserDto, CreateUserDto } from '../types/dto.js';
import { ChangeUserInput, CreateUserInput, User } from '../types/types.js';
import { UUIDType } from '../types/uuid.js';

export const createUserMutation = {
  type: new GraphQLNonNull(User),
  args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
  resolve: async (_, { dto }: { dto: CreateUserDto }, { prisma }: Context) =>
    await prisma.user.create({ data: dto }),
}

export const changeUserMutation = {
  type: new GraphQLNonNull(User),
  args: { id: { type: new GraphQLNonNull(UUIDType) }, dto: { type: new GraphQLNonNull(ChangeUserInput) } },
  resolve: async (_, { id, dto }: { id: string; dto: ChangeUserDto }, { prisma }: Context) =>
    await prisma.user.update({ where: { id }, data: dto })
}

export const deleteUserMutation = {
  type: new GraphQLNonNull(GraphQLString),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, { id }: { id: string }, { prisma }: Context) => {
    const user = await prisma.user.delete({ where: { id } });
    return user.id;
  },
}
