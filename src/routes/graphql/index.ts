import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import depthLimit from 'graphql-depth-limit';
import { getDataLoaders } from './loaders.js';
import { Mutation } from './mutations.js';
import { RootQuery } from './queries.js';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, parse, validate } from 'graphql';

const gqlSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      const context: { prisma: PrismaClient, dataLoader: any } = {
        prisma,
        dataLoader: getDataLoaders(prisma)
      };

      const validation = validate(gqlSchema, parse(query), [depthLimit(5)]);

      if (validation.length > 0) {
        return { errors: validation };
      }

      try {
        const { data, errors } = await graphql({
          schema: gqlSchema,
          source: query,
          variableValues: variables,
          contextValue: context
        });

        return { data, errors };
      }
      catch (error) {
        return { errors: [error] };
      }
    },
  });
};

export default plugin;
