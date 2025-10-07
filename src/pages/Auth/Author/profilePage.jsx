import { useEffect, useState } from 'react';
import { getCurrentUser } from '../../../services/authService';
import { Link , useNavigate} from 'react-router-dom';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const authMethodMap = {
    local: 'Ứng dụng',
    google: 'Bên thứ 3 (Google)',
    facebook: 'Bên thứ 3 (Facebook)',
    github: 'Bên thứ 3 (GitHub)'
  };

  const roleMap = {
    Admin: "Quản trị viên",
    Author: "Người sáng tạo",
    Reader: "Người đọc"
  };

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => setUser(null));
  }, []);

  if (!user) return (
    <p className="text-center text-gray-400 mt-20 italic">
      Đang tải thông tin người dùng...
    </p>
  );

  return (
    <div className="min-h-[80vh] mt-16 mx-auto px-6 py-10 text-gray-100 max-w-3xl">
      {/* Nút quay lại */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 rounded-md border border-gray-600 hover:bg-gray-800 
                   transition text-sm font-medium flex"
      >
        ⬅️ Quay lại
      </button>
      {/* Title */}
      <h2 className="text-3xl font-extrabold mb-10 text-center tracking-wide">
        Hồ sơ cá nhân
      </h2>

      {/* Avatar + Bio */}
      <div className="flex flex-col items-center gap-4 mb-12">
        <div className="relative">
          <img
            src={BASE_URL + user.avatarUrl}
            alt="avatar"
            className="w-36 h-36 rounded-full object-cover border border-gray-500 shadow-lg"
          />
          <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-gray-900
                          bg-green-500"></span>
        </div>
        <p className="italic text-gray-400 text-center text-sm max-w-md">
          Tiểu sử: {user.bio || 'Chưa có tiểu sử'}
        </p>
      </div>

      {/* Info */}
      <div className="space-y-3">
        {[
          { label: "👤 Tên", value: user.name },
          { label: "📧 Email", value: user.email },
          { label: "📅 Ngày tạo", value: new Date(user.createdAt).toLocaleDateString() },
          { label: "🔐 Phương thức đăng nhập", value: authMethodMap[user.authProvider?.toLowerCase()] || "Không xác định" },
          { label: "🎭 Vai trò", value: roleMap[user.roles] || "Không xác định" },
          { label: "✅ Trạng thái", value: user.isActive ? 'Hoạt động' : 'Không hoạt động' }
        ].map((item, idx) => (
          <div key={idx} className="border-b border-gray-700 pb-3">
            <p className="flex justify-between text-sm md:text-base">
              <span className="text-gray-400">{item.label}:</span>
              <span className="font-medium">{item.value}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/update-profile"
          className="px-6 py-2 rounded-md border border-gray-600 hover:bg-gray-800 
                     text-sm font-medium transition"
        >
          ✏️ Chỉnh sửa
        </Link>
        <Link
          to="/profile-posts"
          className="px-6 py-2 rounded-md border border-gray-600 hover:bg-gray-800 
                     text-sm font-medium transition"
        >
          📃 Bài viết
        </Link>
      </div>

      {/* Admin Access */}
      {user.roles === 'Admin' && (
        <div className="mt-12 flex justify-center">
          <Link
            to="/admin"
            className="px-8 py-4 rounded-xl border border-gray-700 hover:bg-gray-800 
                       transition text-center shadow-md"
          >
            <p className="text-xl font-semibold">📁 Trang quản trị</p>
            <p className="text-gray-400 text-sm mt-1">Quản lý toàn hệ thống</p>
          </Link>
        </div>
      )}
    </div>
  );
}
