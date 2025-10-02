import { useEffect, useState } from 'react';
import {
    getAllTags,
    deleteTagById,
    createTag,
} from '../../../services/tagService';
import { toast } from 'react-toastify';

export default function TagManager() {
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [tagToDelete, setTagToDelete] = useState(null);

    useEffect(() => {
        getAllTags().then(setTags).catch(() => setTags([]));
    }, []);

    const openDeleteModal = (id) => {
        setTagToDelete(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteTagById(tagToDelete);
            toast.success('🗑️ Đã xóa');
            setTags(prev => prev.filter(t => t.id !== tagToDelete));
        } catch (err) {
            toast.error('❌ ' + err.message);
        } finally {
            setShowModal(false);
            setTagToDelete(null);
        }
    };

    const handleAdd = async () => {
        if (!newTag.trim()) return;
        try {
            await createTag({ name: newTag });
            toast.success('✅ Đã thêm thẻ');
            setNewTag('');
            const updated = await getAllTags();
            setTags(updated);
        } catch (err) {
            toast.error('❌ ' + err.message);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-10 px-6 bg-neutral-950 border border-neutral-800 rounded-xl shadow">
            <h1 className="text-2xl font-bold text-neutral-100 mb-6 text-center">
                🏷️ Quản lý thẻ
            </h1>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
                        <h2 className="text-lg font-semibold text-neutral-100 mb-4">
                            Xác nhận xóa
                        </h2>
                        <p className="text-neutral-400 mb-6">
                            Bạn có chắc muốn xóa thẻ này không?
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
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder="Thêm thẻ mới..."
                    className="flex-1 px-4 py-2 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-600 bg-neutral-900 text-neutral-100"
                />
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 rounded border border-neutral-700 text-neutral-200 hover:bg-neutral-800 transition font-semibold"
                >
                    ➕ Thêm
                </button>
            </div>

            {/* Danh sách thẻ */}
            <div className="flex flex-wrap gap-3">
                {tags.map(tag => (
                    <div
                        key={tag.id}
                        className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 text-neutral-200 px-4 py-2 rounded-full shadow-sm hover:bg-neutral-800 transition"
                    >
                        <span className="font-medium">{tag.name}</span>
                        <button
                            onClick={() => openDeleteModal(tag.id)}
                            className="text-neutral-400 hover:text-neutral-200 text-sm"
                            title="Xóa"
                        >
                            ✖
                        </button>
                    </div>
                ))}
                {tags.length === 0 && (
                    <p className="text-neutral-500 italic">Chưa có thẻ nào.</p>
                )}
            </div>
        </div>
    );
}
