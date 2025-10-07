import { useState } from 'react';
import { login } from '../../../services/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const data = await login(email, password);
      localStorage.setItem('Token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      console.log(data.token);
      toast.success('✅ Đăng nhập thành công!');
      window.dispatchEvent(new Event('authChanged'));
      navigate('/');
    } catch (err) {
      if (err.response) {
        const { status } = err.response;

        if (status === 400) {
          toast.error('⚠️ Email và mật khẩu không được để trống!');
        }
        else if(status === 401) {
          toast.error('❌ Sai email!');
        }
        else if(status === 409) {
          toast.error('❌ Sai mật khẩu!');
        }
        else if (status === 403) {
          toast.error('⚠️ Tài khoản chưa được kích hoạt!');
        } else {
          toast.error('🚨 Đăng nhập thất bại, thử lại sau!');
        }
      } else {
        toast.error('🚨 Lỗi kết nối, thử lại sau!');
      }
    }
  };
  return (
    <div className="min-h-[80vh] flex items-center justify-center ">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Đăng nhập</h2>
        <input
          type="text"
          placeholder="Email or username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {/* Input mật khẩu + nút hiện/ẩn */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
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
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
}
