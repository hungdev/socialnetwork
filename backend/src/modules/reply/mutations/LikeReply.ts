import { mutationWithClientMutationId, fromGlobalId } from "graphql-relay";
import { GraphQLString } from "graphql";
import ReplyType from "../ReplyType";
import { IUser } from "../../../modules/users/UserModel";
import Reply from "../ReplyModel";

const LikeReply = mutationWithClientMutationId({
    name: 'LikeReplay',
    description: 'Handle likes for replies',
    inputFields: {
        reply: {
            type: GraphQLString
        }
    },
    outputFields: {
        reply: {
            type: ReplyType,
            resolve: (reply) => reply
        }
    },
    mutateAndGetPayload: async ({reply}: {reply: string}, {user}: {user: IUser}) => {
        try {
            const {type, id} = fromGlobalId(reply);
            const replyId = id;
            const replyFounded = await Reply.findById(replyId);
            if (replyFounded.likes.includes(user.id)) {
                const indexOf = replyFounded.likes.indexOf(user.id);
                replyFounded.likes.splice(indexOf, 1);
                await replyFounded.save();
                return replyFounded;
            }
            replyFounded.likes.push(user.id);
            await replyFounded.save();
            return replyFounded;
        } catch(error) {
            console.log(error);
        }
    }
});

export default LikeReply