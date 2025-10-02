import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-neutral-900 text-neutral-200">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-950 border-r border-neutral-800 p-6 flex flex-col">
        <h2 className="text-xl font-bold text-neutral-100 mb-8">🛠️ Admin Panel</h2>

        <nav className="flex flex-col space-y-2">
          <Link 
            to="/admin/categories" 
            className="px-3 py-2 rounded-md hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
          >
            📁 Quản lý thể loại
          </Link>
          <Link 
            to="/admin/tags" 
            className="px-3 py-2 rounded-md hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
          >
            🏷️ Quản lý thẻ
          </Link>
          <Link 
            to="/admin/users" 
            className="px-3 py-2 rounded-md hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
          >
            👥 Quản lý người dùng
          </Link>
          <Link 
            to="/admin/stats" 
            className="px-3 py-2 rounded-md hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
          >
            📊 Thống kê
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-neutral-800 text-sm text-neutral-500">
          © 2025 Admin Dashboard
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 bg-neutral-900">
        <Outlet />
      </main>
    </div>
  );
}
