import { useEffect, useState } from 'react';
import { getCurrentUser, updateUser } from '../../../services/authService';
import { toast } from 'react-toastify';
import CropAvatarModal from '../../../components/CropAvatarModal';

export default function UpdateProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', bio: '', avatarUrl: '', roles: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [rawAvatarFile, setRawAvatarFile] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    getCurrentUser().then(data => {
      setUser(data);
      setForm({
        name: data.name || '',
        bio: data.bio || '',
        avatarUrl: data.avatarUrl || '',
        roles: data.roles || ''
      });
    });
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('bio', form.bio);

      if (form.avatarFile) {
        formData.append('avatarUrl', form.avatarFile);
      }

      await updateUser(formData, form.roles);
      toast.success('✅ Cập nhật hồ sơ thành công!', { autoClose: 1000 });
      setTimeout(() => {
        window.location.href = '/profile';
      }, 1000);
    } catch (error) {
      alert('❌ Lỗi khi cập nhật: ' + error.message);
    }
  };

  if (!user) return <p className="text-center text-gray-500 mt-20">Đang tải thông tin...</p>;

  const roleOptions = [
    { label: "Reader", value: 0 },
    { label: "Author", value: 1 },
  ];

  return (
    <div className="max-w-xl mx-auto mt-16 px-6 py-10  text-white rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold  mb-6 text-center">✏️ Cập nhật hồ sơ</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1">Tên</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded  text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1">Tiểu sử</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 rounded  text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">Ảnh đại diện</label>

          {/* Nút chọn file */}
          <div className="flex items-center gap-3">
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setRawAvatarFile(file);
                  setShowCropModal(true);
                }
              }}
              className="hidden"
            />
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow 
                 hover:bg-blue-700 transition flex items-center gap-2"
            >
              📁 Chọn ảnh
            </label>
            {rawAvatarFile && (
              <span className="text-gray-400 text-sm italic">{rawAvatarFile.name}</span>
            )}
          </div>

          {/* So sánh ảnh cũ - mới */}
          <div className="flex items-center justify-center gap-10 mt-4">
            {form.avatarUrl && (
              <div className="text-center">
                <p className="text-sm font-medium text-gray-400 mb-2">Ảnh cũ</p>
                <img
                  src={BASE_URL + form.avatarUrl}
                  alt="old avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-500 shadow-md"
                />
              </div>
            )}
            {avatarPreview && (
              <div className="text-center">
                <p className="text-sm font-medium text-gray-400 mb-2">Ảnh mới</p>
                <img
                  src={avatarPreview}
                  alt="new avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-400 shadow-md"
                />
              </div>
            )}
          </div>
        </div>


        {user.roles !== 'Admin' && (
          <div>
            <label className="block mb-1">Vai trò</label>
            <select
              name="roles"
              value={form.roles}
              onChange={handleChange}
              className="w-full p-3 rounded  text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roleOptions.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        )}
        {user.roles === 'Admin' && (
          <p className="text-sm text-gray-400 italic">Admin không thể thay đổi vai trò của mình.</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded transition"
        >
          Lưu thay đổi
        </button>
      </form>

      {/* Modal crop ảnh */}
      {showCropModal && rawAvatarFile && (
        <CropAvatarModal
          file={rawAvatarFile}
          onCropDone={(croppedFile) => {
            setForm(prev => ({ ...prev, avatarFile: croppedFile }));
            setAvatarPreview(URL.createObjectURL(croppedFile));
            setShowCropModal(false);
          }}
          onCancel={() => setShowCropModal(false)}
        />
      )}
    </div>
  );
}
