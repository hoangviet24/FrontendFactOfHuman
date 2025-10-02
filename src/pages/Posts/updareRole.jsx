import { useNavigate } from 'react-router-dom';
import { updateUser } from '../../services/authService';
import { toast } from 'react-toastify';

export default function UpgradeRolePage() {
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    try {
      const formData = new FormData();
      formData.append('roles', 'Author');
      await updateUser(formData, 'Author');
      toast.success('🎉 Bạn đã trở thành Author!');
      setTimeout(() => navigate('/create-post'), 3000);
    } catch (error) {
      toast.error('❌ Không thể nâng cấp: ' + error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 px-6 py-10 bg-gray-900 text-white rounded-xl shadow-2xl text-center">
      <h2 className="text-2xl font-bold text-blue-400 mb-6">🚀 Nâng cấp vai trò</h2>
      <p className="mb-6 text-gray-300">Bạn hiện là <strong>Reader</strong>. Để tạo bài viết, bạn cần nâng cấp lên <strong>Author</strong>.</p>
      <button
        onClick={handleUpgrade}
        className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded transition"
      >
        Nâng cấp ngay
      </button>
    </div>
  );
}
