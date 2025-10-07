import { useState } from 'react';
import { register } from '../../../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword ] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if(!email.includes('@')) {
      toast.error('❌ Email không hợp lệ!');
      return;
    }
    if(password.length < 6) {
      toast.error('❌ Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    try {
      await register({ name, email, password });
      toast.success('✅ Đăng ký thành công! Hãy kiểm tra email để kích hoạt tài khoản.');
      navigate('/login');
    } catch (error) {
      const status = error.response?.status;
      if (status === 409) {
        toast.error('⚠️ Username hoặc email đã tồn tại!');
      }
      else if (status === 400) {
        toast.error('username không được để trống!');
      }
      else if(!email.includes('@')) {
        toast.error('❌ Email không hợp lệ!');
      }
      else if(password.length < 6) {
        toast.error('❌ Mật khẩu phải có ít nhất 6 ký tự!');
      }
      else if (status === 500) {
        toast.error('🚨 Đăng ký thất bại, thử lại sau!');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">Đăng ký</h2>

        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />

         {/* Input mật khẩu + nút hiện/ẩn */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white "
          >
             {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>
        <button
          onClick={handleRegister}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
}
