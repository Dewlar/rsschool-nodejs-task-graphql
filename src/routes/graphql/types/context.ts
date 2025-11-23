import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export interface Context {
  prisma: PrismaClient;
  dataLoaders: DataLoader;
}
