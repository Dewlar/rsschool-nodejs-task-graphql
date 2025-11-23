import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

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
