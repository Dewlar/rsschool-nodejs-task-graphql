import { PrismaClient } from '@prisma/client';
import { getDataLoaders } from '../loaders.js';

export interface Context {
  prisma: PrismaClient;
  dataLoader: ReturnType<typeof getDataLoaders>;
}
