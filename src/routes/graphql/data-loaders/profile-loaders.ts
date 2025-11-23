import { Static } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { profileSchema } from '../../profiles/schemas.js';

export const getProfileByUserIdLoader = (prisma: PrismaClient) =>
  new DataLoader(async (userIDs: readonly string[]) => {
    const profilesMap = new Map<string, Static<typeof profileSchema>>();
    const profiles = await prisma.profile.findMany({ where: { userId: { in: [...userIDs] }}});

    profiles.forEach((profile) => profilesMap.set(profile.userId, profile));

    return userIDs.map((id) => profilesMap.get(id));
  });
