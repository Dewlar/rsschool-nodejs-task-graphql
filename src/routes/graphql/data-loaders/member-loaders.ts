import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export const getMemberTypeByIdLoader = (prisma: PrismaClient) =>
  new DataLoader(async (memberTypeIDs: readonly string[]) => {
    const members = await prisma.memberType.findMany({ where: { id: { in: [...memberTypeIDs] }}});
    return memberTypeIDs.map((id) => members.find((memberType) => memberType.id === id));
  });
