import { Static } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { postSchema } from '../../posts/schemas.js';

export const getPostsByAuthorIdLoader = (prisma: PrismaClient) =>
  new DataLoader(async (authorIds: readonly string[]) => {
    const posts = await prisma.post.findMany({ where: { authorId: { in: [...authorIds] } } });
    const postMap = new Map<string, Static<typeof postSchema>[]>();

    posts.forEach((post) => {
      const author = postMap.get(post.authorId);
      author
        ? author.push(post)
        : postMap.set(post.authorId, [post]);
    });

    return authorIds.map((authorId) => postMap.get(authorId) || []);
  });
