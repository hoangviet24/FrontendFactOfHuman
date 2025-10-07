import axios from '../api/axios';
const BASE_URL = import.meta.env.VITE_API_URL
export const getAllPosts = async (skip = 0, take = 30) => {
  const response = await axios.get(`/api/Post/get-all?skip=${skip}&take=${take}`);
  return response.data;
};
export const getTop10 = async () => {
  const response = await axios.get('/api/Post/Get-top-10');
  return response.data;
}
export const getPostById = async (id) => {
  const response = await axios.get(`/api/Post/Get-By-Id/${id}`);
  return response.data;
};

export async function createPost(postFormData, token) {
  // ✅ Nhận FormData đã được tạo sẵn, không tạo mới
  try {
    const res = await fetch(`${BASE_URL}/api/Post/Post`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: postFormData // ✅ Dùng luôn FormData đã truyền vào
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.log('FormData entries:', [...postFormData.entries()]); // Debug
      throw new Error('Không thể tạo bài viết: ' + errorText);
    }

    const data = await res.json();
    return data.id;
  } catch (err) {
    console.error('createPost error:', err);
    throw err;
  }
}
export async function likePost(postId) {
  const token = localStorage.getItem('Token');
  const res = await fetch(`${BASE_URL}/api/Reaction/create?targetType=0&typeReaction=0`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ targetId: postId })
  });

  if (!res.ok) {
    // Lấy status code từ response
    const errorData = await res.json().catch(() => ({}));
    const error = new Error(errorData.message || "Like bài viết thất bại");
    error.status = res.status; // tự thêm thuộc tính status
    throw error;
  }

  return res.json(); // phải .json() để lấy data
}

export async function unlikePost(reactionId) {
  const token = localStorage.getItem('Token');
  const res = await fetch(`${BASE_URL}/api/Reaction/delete/${reactionId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Unlike thất bại");
  }

  return await res.json(); // API của cậu trả { message: "..."} → nên .json()
}

export async function getLikesByPost(postId) {
  const res = await fetch(`${BASE_URL}/api/Reaction/get-by-post/${postId}`);
  if (!res.ok) throw new Error("Không thể lấy danh sách like");

  return await res.json(); // fetch → dùng .json(), không có res.data
}


export async function createPostBlock(blockFormData, token) {
  try {
    console.log('Token gửi lên:', token);
    const res = await fetch(`${BASE_URL}/api/PostBlock`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        // ✅ KHÔNG set Content-Type, để browser tự set cho multipart/form-data
      },
      body: blockFormData
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('PostBlock error:', errorText);
      throw new Error("Không thể tạo block: " + errorText);
    }

    return await res.json(); // ✅ Sửa từ res.data thành res.json()
  } catch (err) {
    console.error('createPostBlock error:', err);
    throw err;
  }
}
export async function getAuthorPosts() {
  const token = localStorage.getItem('Token');
  const res = await fetch(BASE_URL + '/api/Post/Get-With-Author?skip=0&take=30', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error('Không thể lấy bài viết của tác giả');
  return await res.json();
}
export const getPostsByUserId = async (userId) => {
  const token = localStorage.getItem('Token');
  const res = await fetch(`${BASE_URL}/api/Post/Get-By-UserId?userId=${userId}&skip=0&take=30`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Không lấy được bài viết');
  return await res.json();
};
export async function deletePostById(id) {
  const token = localStorage.getItem('Token');
  const res = await fetch(BASE_URL + `/api/Post/Delete/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Xóa bài viết thất bại');
  }

  return true;
}
