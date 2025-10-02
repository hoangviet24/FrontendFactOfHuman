import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getCommentsByPostId = async (postId) => {
    const res = await axios.get(`${BASE_URL}/api/Comment/Get-Comments/${postId}`);
    return res.data;
};

export const createComment = async ( postId, content) => {
    const token = localStorage.getItem('Token');
    const res = await axios.post(
        `${BASE_URL}/api/Comment/Post-Comment`,
        { content, postId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
};
export const deleteComment = async(commentId) => {
    const token = localStorage.getItem('Token');
    const res = await axios.delete(`${BASE_URL}/api/Comment/Delete-Comment/${commentId}`, { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
}