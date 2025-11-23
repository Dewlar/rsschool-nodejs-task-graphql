import { Static } from '@fastify/type-provider-typebox';
import { changePostByIdSchema, createPostSchema } from '../../posts/schemas.js';
import { changeProfileByIdSchema, createProfileSchema } from '../../profiles/schemas.js';
import { changeUserByIdSchema, createUserSchema } from '../../users/schemas.js';

export type CreateUserDto = Static<(typeof createUserSchema)['body']>;
export type ChangeUserDto = Static<(typeof changeUserByIdSchema)['body']>;

export type CreatePostDto = Static<(typeof createPostSchema)['body']>;
export type ChangePostDto = Static<(typeof changePostByIdSchema)['body']>;

export type CreateProfileDto = Static<(typeof createProfileSchema)['body']>;
export type ChangeProfileDto = Static<(typeof changeProfileByIdSchema)['body']>;
