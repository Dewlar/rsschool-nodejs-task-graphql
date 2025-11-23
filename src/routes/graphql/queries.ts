import { GraphQLObjectType } from 'graphql/type/index.js';
import { membersTypeQuery, memberTypeQuery } from './query-types/member-type-queries.js';
import { postQuery, postsQuery } from './query-types/post-queries.js';
import { profileQuery, profilesQuery } from './query-types/profile-queries.js';
import { userQuery, usersQuery } from './query-types/user-queries.js';

export const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: userQuery,
    users: usersQuery,

    post: postQuery,
    posts: postsQuery,


    profile: profileQuery,
    profiles: profilesQuery,

    memberType: memberTypeQuery,
    memberTypes: membersTypeQuery,
  },
});
