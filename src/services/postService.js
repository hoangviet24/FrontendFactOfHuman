import axios from '../api/axios';
const BASE_URL = import.meta.env.VITE_API_URL
export const getAllPosts = async () => {
  const response = await axios.get('/api/Post/get-all');
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


export async function createPostBlock(blockFormData, token) {
  try {
    console.log('Token gửi lên:', token);
    const res = await fetch(`${BASE_URL}/api/PostBlock`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}` ,
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
