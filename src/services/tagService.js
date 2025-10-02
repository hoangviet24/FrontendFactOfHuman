const BASE_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem('Token');
export async function getAllTags() {
  const res = await fetch(`${BASE_URL}/api/Tag/Get-All`);
  if (!res.ok) throw new Error('Không thể lấy danh sách thẻ');
  return res.json();
}

export async function createTag(data) {
  const res = await fetch(`${BASE_URL}/api/Tag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' ,
      Authorization: `Bearer ${token}`,

    },
    body: JSON.stringify(data),

  });
  if (!res.ok) throw new Error('Không thể tạo thẻ');
  return res.json();
}

export async function deleteTagById(id) {
  const res = await fetch(`${BASE_URL}/api/Tag/Delete-By-Id/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  if (!res.ok) throw new Error('Không thể xóa thẻ');
}
