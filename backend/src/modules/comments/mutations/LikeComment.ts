import { mutationWithClientMutationId, fromGlobalId } from "graphql-relay";
import { GraphQLString } from "graphql";

import CommentType from "../CommentType";
import Comment from '../CommentModel';
import { IUser } from "../../../modules/users/UserModel";

const LikeComment = mutationWithClientMutationId({
    name: 'LikeComment',
    description: 'Update total likes for a comment type',
    inputFields: {
        comment: {
            type: GraphQLString
        }
    },
    outputFields: {
        comment: {
            type: CommentType,
            resolve: (comment) => comment
        }
    },
    mutateAndGetPayload: async ({comment}, {user}: {user: IUser}) => {
        try {
            const {type, id} = fromGlobalId(comment);
            const commentId = id;
            const commentFound = await Comment.findOne({_id: commentId});
            if (commentFound.likes.includes(user.id)) {
                const indexOf = commentFound.likes.indexOf(user.id);
                commentFound.likes.splice(indexOf, 1);
                await commentFound.save();
                return commentFound
            };
            commentFound.likes.push(user.id);
            await commentFound.save();
            return commentFound;
        } catch (err) {
            console.log(err);
        }
    }
});

export default LikeComment;