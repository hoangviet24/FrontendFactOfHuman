const BASE_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem('Token');
export async function getAllCategories() {
  const res = await fetch(`${BASE_URL}/api/Category/Get-All`);
  if (!res.ok) throw new Error('Không thể lấy danh sách thể loại');
  return res.json();
}

export async function createCategory(data) {
  const res = await fetch(`${BASE_URL}/api/Category/Post-Category`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
     },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Không thể tạo thể loại');
  return res.json();
}

export async function deleteCategoryById(id) {
  const res = await fetch(`${BASE_URL}/api/Category/Delete-By-Id/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  if (!res.ok) throw new Error('Không thể xóa thể loại');
}
