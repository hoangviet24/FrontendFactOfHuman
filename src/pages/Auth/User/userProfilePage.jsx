import { useEffect, useState } from 'react';
import { getCurrentUser } from '../../../services/authService';
import { Link, useParams } from 'react-router-dom';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const authMethodMap = {
    local: "Ứng dụng",
    google: "Bên thứ 3 (Google)",
    facebook: "Bên thứ 3 (Facebook)",
    github: "Bên thứ 3 (GitHub)"
  };
  const roleMap = {
    Admin: "Quản trị viện",
    Author: "Người sáng tạo",
    Reader: "Người đọc"
  };
  useEffect(() => {
    getCurrentUser(id).then(setUser).catch(() => setUser(null));
  }, [id]);

  if (!user) return <p className="text-center text-gray-500 mt-20">Đang tải thông tin người dùng...</p>;

  return (
    <div className="min-h-[80vh] mt-16 mx-auto px-4 py-10 bg-gray-900 text-white rounded-xl shadow-2xl max-w-3xl">
      <h2 className="text-3xl font-bold text-blue-400 mb-8 text-center">👤 Hồ sơ cá nhân</h2>

      <div className="flex flex-col items-center gap-4 mb-8">
        <img
          src={BASE_URL + user.avatarUrl}
          alt="avatar"
          className="w-36 h-36 rounded-full object-cover border-4 border-blue-500 shadow-md"
        />
        <p className="italic text-gray-300 text-center">{user.bio || 'Chưa có tiểu sử'}</p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
          <p><strong>👤 Tên:</strong> {user.name}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
          <p><strong>📧 Email:</strong> {user.email}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
          <p><strong>📅 Ngày tạo:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
          <p>
            <strong>🔐 Phương thức đăng nhập:</strong>{" "}
            {authMethodMap[user.authProvider.toLowerCase()] || "Không xác định"}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
          <p>
            <strong>🎭 Vai trò:</strong>{" "}
            {roleMap[user.roles] || "Không xác định"}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
          <p><strong>✅ Trạng thái:</strong> {user.isActive ? 'Hoạt động' : 'Không hoạt động'}</p>
        </div>
        <div className='mt-8 text-center'>
          <Link
            to={`/profile-posts/${user.id}`}
            className='inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition'>
            📃 Xem bài viết
          </Link>
        </div>
      </div>
    </div>
  );
}
