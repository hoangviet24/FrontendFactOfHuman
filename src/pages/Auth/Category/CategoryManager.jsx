import { useEffect, useState } from 'react';
import {
    getAllCategories,
    deleteCategoryById,
    createCategory,
} from '../../../services/categoryService';
import { toast } from 'react-toastify';

export default function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [newName, setNewName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [cateToDelete, setCateToDelete] = useState(null);

    useEffect(() => {
        getAllCategories().then(setCategories).catch(() => setCategories([]));
    }, []);

    const openDeleteModal = (id) => {
        setCateToDelete(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteCategoryById(cateToDelete);
            toast.success('🗑️ Đã xóa');
            setCategories(prev => prev.filter(t => t.id !== cateToDelete));
        } catch (err) {
            toast.error('❌ ' + err.message);
        } finally {
            setShowModal(false);
            setCateToDelete(null);
        }
    };

    const handleAdd = async () => {
        if (!newName.trim()) return;
        try {
            await createCategory({ name: newName });
            toast.success('✅ Đã thêm thể loại');
            setNewName('');
            const updated = await getAllCategories();
            setCategories(updated);
        } catch (err) {
            toast.error('❌ ' + err.message);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-10 px-6 bg-neutral-950 border border-neutral-800 rounded-xl shadow">
            <h1 className="text-2xl font-bold text-neutral-100 mb-6 text-center">
                📁 Quản lý thể loại
            </h1>
            
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
                        <h2 className="text-lg font-semibold text-neutral-100 mb-4">
                            Xác nhận xóa
                        </h2>
                        <p className="text-neutral-400 mb-6">
                            Bạn có chắc muốn xóa thể loại này không?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded border border-neutral-700 text-neutral-200 hover:bg-neutral-800 transition"
                            >
                                Xóa
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded border border-neutral-700 text-neutral-200 hover:bg-neutral-800 transition"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Form thêm mới */}
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                    placeholder="Thêm thể loại mới..."
                    className="flex-1 px-4 py-2 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-600 bg-neutral-900 text-neutral-100"
                />
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 rounded border border-neutral-700 text-neutral-200 hover:bg-neutral-800 transition font-semibold"
                >
                    ➕ Thêm
                </button>
            </div>

            {/* Danh sách thể loại */}
            <div className="flex flex-wrap gap-3">
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 text-neutral-200 px-4 py-2 rounded-full shadow-sm hover:bg-neutral-800 transition"
                    >
                        <span className="font-medium">{cat.name}</span>
                        <button
                            onClick={() => openDeleteModal(cat.id)}
                            className="text-neutral-400 hover:text-neutral-200 text-sm"
                            title="Xóa"
                        >
                            ✖
                        </button>
                    </div>
                ))}
                {categories.length === 0 && (
                    <p className="text-neutral-500 italic">Chưa có thể loại nào.</p>
                )}
            </div>
        </div>
    );
}
