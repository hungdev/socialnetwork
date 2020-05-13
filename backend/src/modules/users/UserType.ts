import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';

import { IUser } from './UserModel';
import { userLoader, loadUser } from './UserLoader';
import { connectionDefinitions, connectionArgs, connectionFromArray } from 'graphql-relay';
import PostType from '../posts/PostType';


const userType = new GraphQLObjectType<IUser>({
    name: 'UserType',
    description: 'User type',
    fields: () => (
        {
            name: {
                type: GraphQLString,
                resolve: (user, _) => {
                    console.log('user: ', user);
                    console.log('underline: ', _);
                    return user.name
                }
            },
            password: {
                type: GraphQLString,
                resolve: (user, _) => user.password
            },
            email: {
                type: GraphQLString,
                resolve: (user, _) => user.email
            },
            token: {
                type: GraphQLString,
                resolve: (user, _) => user.tokens[0].token
            },
            friends: {
                type: UserConnection,
                args: connectionArgs,
                resolve: (user, args) => {
                        console.log(user)
                        return connectionFromArray(
                        user.friends.map(id => loadUser(id)),
                        args
                    )
                }
            },
            posts: {
                type: PostConnection,
                args: connectionArgs,
                resolve: (user, args) => {
                        console.log(user)
                        return connectionFromArray(
                            user.posts.map(id => loadUser(id)),
                        args
                    )
                }
            },
            _id: {
                type: GraphQLString,
                resolve: (user, _) => userLoader(user, '_id')
            }
        }
    )
});

const {connectionType: UserConnection} =
  connectionDefinitions({nodeType: userType});

export const {connectionType: PostConnection} =
        connectionDefinitions({nodeType: PostType})

export default userType;