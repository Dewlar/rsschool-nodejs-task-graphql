import { GraphQLList, GraphQLNonNull, GraphQLNullableType } from 'graphql';

export const NonNullListOfNonNull = <T extends GraphQLNullableType>(type: T) =>
  new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(type)));
