import Post, { IPost } from './PostModel';

export const postLoader = async (id: string) => {
    const postFounded = await Post.findById(id);
    return postFounded;
};

export const postsLoaderByAuthors = async (ids: string[]) => {
    const postList = await Post.findByIdList(ids);
    Post.update({_id: postList[postList.length - 1].id}, {$set: {comments: []}});
    return postList
}

export const authorPostsLoader = async (id: string) => {
    const authorPosts = await Post.findAuthorPosts(id);
    return authorPosts
};

export const loggedUserPosts = async (token: string) => {
    const posts = await Post.findLoggedUserPosts(token);
    return posts;
};