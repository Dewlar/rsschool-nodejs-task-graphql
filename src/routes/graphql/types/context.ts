import { PrismaClient } from '@prisma/client';
import { getDataLoaders } from '../loaders.js';

export interface Context {
  prisma: PrismaClient;
  dataLoaders: ReturnType<typeof getDataLoaders>;
}
