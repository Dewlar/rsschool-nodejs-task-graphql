import { GraphQLNonNull, GraphQLString } from 'graphql/type/index.js';
import { Context } from '../types/context.js';
import { ChangePostDto, CreatePostDto } from '../types/dto.js';
import { ChangePostInput, CreatePostInput, Post } from '../types/types.js';
import { UUIDType } from '../types/uuid.js';

export const createPostMutation = {
  type: new GraphQLNonNull(Post),
    args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
  resolve: async (_, { dto }: { dto: CreatePostDto }, { prisma }: Context) =>
    await prisma.post.create({ data: dto }),
}

export const deletePostMutation = {
  type: new GraphQLNonNull(GraphQLString),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, { id }: { id: string }, { prisma }: Context) => {
    const post = await prisma.post.delete({ where: { id } });
    return post.id;
  },
}

export const changePostMutation = {
  type: new GraphQLNonNull(Post),
  args: { id: { type: new GraphQLNonNull(UUIDType) }, dto: { type: new GraphQLNonNull(ChangePostInput) } },
  resolve: async (_, { id, dto }: { id: string; dto: ChangePostDto }, { prisma }: Context) =>
    await prisma.post.update({ where: { id }, data: dto })
}
