import { authApi } from "../services/api";

/**
 * Creates a new comment
 * @async
 * @function createComment
 * @param {Object} currentUser - The current user object
 * @param {Object} data - The data to be created
 * @param {string} data.postId - The ID of the post to create the comment on
 * @param {string} data.content - The content of the comment to create
 * @returns {Promise<Object>} - The response object from the server
 * @throws {Object} - Error object if the request fails
 */
export const createComment = async (data) => {
  const { user, postId, content } = data;
  try {
    const response = await authApi.post("/comments", {
      user,
      postId,
      content,
    });
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Delete comment
 * @async
 * @function deleteComment
 * @param {string} id - The ID of the comment to delete
 * @returns {Promise<Object>} - The response object from the server
 * @throws {Object} - Error object if the request fails
 */
export const deleteComment = async (id) => {
  try {
    const response = await authApi.patch(`/comments/delete/${id}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Fetches comments associated with a specific post ID.
 * @async
 * @function getCommentsByPostId
 * @param {string} postId - The ID of the post whose comments are to be fetched.
 * @returns {Promise<Object>} - The response object from the server containing the comments.
 * @throws {Object} - Error object if the request fails.
 */

export const getCommentsByPostId = async (postId) => {
  try {
    const response = await authApi.get(`/comments/post/${postId}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Update a comment
 * @async
 * @function updateComment
 * @param {string} id - The ID of the comment to update
 * @param {string} data - The new content for the comment
 * @returns {Promise<Object>} - Response object from the server
 * @throws {Object} - Error object if the request fails
 */

export const updateComment = async (id, data) => {
  try {
    const response = await authApi.patch(`/comments/update/${id}`, {
      content: data,
    });
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Get all comments
 * @async
 * @function getAllComments
 * @param {Number} [page=1] - Page number
 * @param {Number} [limit=10] - Number of comments to return
 * @returns {Promise<Object>} - Response object with comments
 * @throws {Object} - Error object if the request fails
 */
export const getAllComments = async (page = 1, limit = 10) => {
  try {
    const response = await authApi.get(`/comments?page=${page}&limit=${limit}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const getFilteredComments = async (filter) => {
  try {
    const params = new URLSearchParams(filter).toString();
    const response = await authApi.get("/commentreport", params);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};
