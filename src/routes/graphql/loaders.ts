import { PrismaClient } from '@prisma/client';
import { getMemberTypeByIdLoader } from './data-loaders/member-loaders.js';
import { getPostsByAuthorIdLoader } from './data-loaders/post-loaders.js';
import { getProfileByUserIdLoader } from './data-loaders/profile-loaders.js';
import {
  getSubscribedToUserByIdLoader,
  getUserSubscribedToByIdLoader,
} from './data-loaders/subscribe-loaders.js';

export const getDataLoaders = (prisma: PrismaClient) => {
  return {
    profile: getProfileByUserIdLoader(prisma),
    posts: getPostsByAuthorIdLoader(prisma),
    memberType: getMemberTypeByIdLoader(prisma),
    userSubscribedTo: getUserSubscribedToByIdLoader(prisma),
    subscribedToUser: getSubscribedToUserByIdLoader(prisma),
  };
};
