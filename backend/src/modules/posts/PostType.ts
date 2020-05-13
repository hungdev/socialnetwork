import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } from 'graphql';

import userType from '../users/UserType';
import { IPost } from './PostModel';
import { connectionDefinitions, connectionArgs, connectionFromArray } from 'graphql-relay';
import CommentType from '../comments/CommentType';
import { commentLoader } from '../comments/CommentLoader';
import { loadUser } from '../users/UserLoader';

const PostType = new GraphQLObjectType<IPost>({
    name: 'PostType',
    description: 'Post type',
    fields: () => ({
        author: {
            type: userType,
            resolve: async (post) => await loadUser(post.author)
        },
        content: {
            type: GraphQLString,
            resolve: (post) => post.content
        },
        likes: {
            type: GraphQLInt,
            resolve: (post) => post.likes
        },
        comments: {
            type: CommentConnection,
            args: connectionArgs,
            resolve: (post, args) => connectionFromArray(
                post.comments.map(commentLoader),
                args
            )
        }
    })
})

const {connectionType: CommentConnection} =
  connectionDefinitions({nodeType: CommentType});

export default PostType;