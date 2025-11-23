import { Static } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { postSchema } from '../posts/schemas.js';
import { profileSchema } from '../profiles/schemas.js';

export const getDataLoaders = (prisma: PrismaClient) => {
  return {
    profile: getProfileByUserIdLoader(prisma),
    posts: getPostsByAuthorIdLoader(prisma),
    memberType: getMemberTypeByIdLoader(prisma),
    userSubscribedTo: getUserSubscribedToByIdLoader(prisma),
    subscribedToUser: getSubscribedToUserByIdLoader(prisma)
  }
}

export const getProfileByUserIdLoader = (prisma: PrismaClient) =>
  new DataLoader(async (userIDs: readonly string[]) => {
    const profilesMap = new Map<string, Static<typeof profileSchema>>();
    const profiles = await prisma.profile.findMany({ where: { userId: { in: [...userIDs] }}});

    profiles.forEach((profile) => profilesMap.set(profile.userId, profile));

    return userIDs.map((id) => profilesMap.get(id));
  });

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

export const getMemberTypeByIdLoader = (prisma: PrismaClient) =>
  new DataLoader(async (memberTypeIDs: readonly string[]) => {
    const members = await prisma.memberType.findMany({ where: { id: { in: [...memberTypeIDs] }}});
    return memberTypeIDs.map((id) => members.find((memberType) => memberType.id === id));
  });

export const getUserSubscribedToByIdLoader = (prisma: PrismaClient) =>
  new DataLoader(async (userIDs: readonly string[]) => {
    const usersWithAuthors = await prisma.user.findMany({
      where: { id: { in: Array.from(userIDs) } },
      include: { userSubscribedTo: { select: { author: true } } },
    });
    const subscribedAuthorsMap = new Map<string, { id: string; name: string }[]>();

    usersWithAuthors.forEach((user) => {
      const subscribedAuthors = user.userSubscribedTo.map((subscription) => subscription.author);
      subscribedAuthorsMap.set(user.id, subscribedAuthors);
    });

    return userIDs.map((id) => subscribedAuthorsMap.get(id) || []);
  });

export const getSubscribedToUserByIdLoader = (prisma: PrismaClient) =>
  new DataLoader(async (userIDs: readonly string[]) => {
    const usersWithSubs = await prisma.user.findMany({
      where: { id: { in: Array.from(userIDs) } },
      include: { subscribedToUser: { select: { subscriber: true }}}
    });
    const subscribersMap = new Map<string, { id: string; name: string }[]>();

    usersWithSubs.forEach((user) => {
      if (!subscribersMap.get(user.id)) {
        subscribersMap.set(user.id, []);
      }

      subscribersMap.get(user.id)?.push(...user.subscribedToUser.map((sub) => sub.subscriber));
    });

    return userIDs.map((id) => subscribersMap.get(id) || []);
  });
