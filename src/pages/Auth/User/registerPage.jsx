import { useState } from 'react';
import { register } from '../../../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await register({ name, email, password });
      toast.success('✅ Đăng ký thành công! Hãy kiểm tra email để kích hoạt tài khoản.');
      navigate('/login');
    } catch (error) {
      toast.error('❌ Đăng ký thất bại: ' + (error.message || 'Có lỗi xảy ra'));
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
        
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        
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
