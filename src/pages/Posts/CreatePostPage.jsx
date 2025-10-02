import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ContentBlock from '../../components/ContentBlock';
import { MantineProvider } from '@mantine/core';
import { createPost, createPostBlock } from '../../services/postService';

export default function CreatePostPage() {
  const [form, setForm] = useState({
    title: '',
    summary: '',
    categoryId: '',
    tags: [],
    readingMinutes: 1,
    coverImage: null
  });

const [contentBlocks, setContentBlocks] = useState([
  { 
    topContent: '', 
    bottomContent: '', 
    topImage: null, 
    bottomImage: null,
    topImagePreview: null,
    bottomImagePreview: null
  }
]);


  const [categories, setCategories] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [step, setStep] = useState('post'); // 'post' | 'content'
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [categorySearch, setCategorySearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [coverPreview, setCoverPreview] = useState(null);
  //tìm category
  const searchTerm = String(categorySearch ?? '').trim().toLowerCase();
  const filteredCategories = (categories || []).filter(cat =>
    String(cat?.name ?? '').toLowerCase().includes(searchTerm)
  );
  const filteredTags = tagsList.filter(tag =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );
  useEffect(() => {
    fetch(`${BASE_URL}/api/Category/Get-All`)
      .then(res => res.json())
      .then(setCategories)
      .catch(() => setCategories([]));

    fetch(`${BASE_URL}/api/Tag/Get-All`)
      .then(res => res.json())
      .then(setTagsList)
      .catch(() => setTagsList([]));
  }, [BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
      setForm(prev => ({ ...prev, coverImage: file })); // 👈 thêm dòng này
    }
  };


  const toggleTag = (tagId) => {
    setForm(prev => {
      const isSelected = prev.tags.includes(tagId);
      const updatedTags = isSelected
        ? prev.tags.filter(t => t !== tagId)
        : [...prev.tags, tagId];
      return { ...prev, tags: updatedTags };
    });
  };

  const handleBlockChange = (index, field, value) => {
    const updated = [...contentBlocks];
    updated[index][field] = value;
    setContentBlocks(updated);
  };

  const handleBlockFile = (index, field, file) => {
  const updated = [...contentBlocks];
  updated[index][field] = file;
  updated[index][field + 'Preview'] = file ? URL.createObjectURL(file) : null;
  setContentBlocks(updated);
};


  const addBlock = () => {
    setContentBlocks(prev => [...prev, {
      topContent: '',
      bottomContent: '',
      topImage: null,
      bottomImage: null
    }]);
  };

  const removeBlock = (index) => {
    setContentBlocks(prev => prev.filter((_, i) => i !== index));
  };

  const goToContentStep = (e) => {
    e.preventDefault();
    if (!form.title || !form.summary || !form.categoryId || form.tags.length === 0 || !form.coverImage) {
      toast.error('❌ Vui lòng điền đầy đủ thông tin bài viết và chọn tag/ảnh');
      return;
    }
    setStep('content');
  };

  const handleSubmitAll = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('Token');

      // --- Tạo post ---
      const postForm = new FormData();
      postForm.append('Title', form.title);
      postForm.append('Summary', form.summary);
      postForm.append('CategoryId', form.categoryId);
      postForm.append('ReadingMinutes', parseInt(form.readingMinutes));
      if (form.coverImage) postForm.append('CoverImage', form.coverImage);

      form.tags.forEach(tagId => postForm.append('Tags', tagId));

      const postId = await createPost(postForm, token);

      // --- Tạo content blocks ---
      for (const block of contentBlocks) {
        if (!block.topContent && !block.bottomContent && !block.topImage && !block.bottomImage) continue;

        const blockForm = new FormData();
        blockForm.append('PostId', postId);
        blockForm.append('TopContent', block.topContent || '');
        blockForm.append('BottomContent', block.bottomContent || '');
        if (block.topImage) blockForm.append('TopImageUrl', block.topImage);
        if (block.bottomImage) blockForm.append('BottomImageUrl', block.bottomImage);

        await createPostBlock(blockForm, token);
      }

      toast.success('✅ Bài viết và nội dung đã được đăng!');
      window.location.href = '/';
    } catch (err) {
      toast.error('❌ ' + err.message);
      console.error('createPost error:', err);
    }
  };

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <div className="max-w-4xl mx-auto mt-16 px-6 py-10 bg-gray-900 text-white rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">✍️ Tạo bài viết mới</h2>

        {step === 'post' ? (
          <form onSubmit={goToContentStep} className="space-y-6">
            <input type="text" name="title" placeholder="Tiêu đề" value={form.title} onChange={handleChange} className="w-full p-3 rounded bg-gray-800 text-white" />
            <textarea name="summary" placeholder="Tóm tắt" value={form.summary} onChange={handleChange} className="w-full p-3 rounded bg-gray-800 text-white" />
            <div className="space-y-3">
              <label className="block mb-2 font-medium text-blue-300">
                🖼️ Ảnh bìa
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-600 file:text-white
                   hover:file:bg-blue-500"
              />

              {coverPreview && (
                <div className="mt-3">
                  <img
                    src={coverPreview}
                    alt="Preview"
                    className="max-h-48 rounded-lg border border-gray-700 shadow-md"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              {/* Ô tìm kiếm (controlled + onChange rõ ràng) */}
              <input
                type="text"
                placeholder="🔍 Tìm thể loại..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              />

              {/* Danh sách category */}
              <div className="max-h-60 overflow-y-auto bg-gray-800 rounded-lg border border-gray-700 divide-y divide-gray-700 shadow">
                {filteredCategories.length === 0 ? (
                  <div className="px-4 py-3 text-gray-400 italic">Không có thể loại nào phù hợp</div>
                ) : (
                  filteredCategories.map(cat => {
                    const selected = String(form.categoryId) === String(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, categoryId: cat.id }))}
                        className={`flex items-center gap-3 w-full text-left px-4 py-3 transition ${selected ? "bg-blue-600 text-white font-semibold" : "text-gray-300 hover:bg-gray-700"
                          }`}
                      >
                        <span className={`w-4 h-4 flex-shrink-0 rounded-full border ${selected ? "bg-white border-white" : "border-gray-400"}`} />
                        <span>{cat.name}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block mb-2 font-medium text-blue-300">🏷️ Chọn tag</label>

              {/* Ô tìm kiếm tag */}
              <input
                type="text"
                placeholder="🔍 Tìm tag..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              />

              {/* Danh sách tag */}
              <div className="max-h-32 overflow-y-auto flex flex-wrap gap-3 p-3 bg-gray-800 rounded border border-gray-700">
                {filteredTags.length > 0 ? (
                  filteredTags.map(tag => {
                    const isSelected = form.tags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                      >
                        {tag.name}
                      </button>
                    );
                  })
                ) : (
                  <span className="text-gray-400 italic">Không tìm thấy tag nào...</span>
                )}
              </div>
            </div>

            <input type="number" name="readingMinutes" placeholder="Thời lượng đọc" value={form.readingMinutes} onChange={handleChange} className="w-full p-3 rounded bg-gray-800 text-white" />

            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded mt-6">
              ➡️ Tiếp tục viết nội dung
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitAll} className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-300">📦 Nội dung bài viết</h3>
            <button type="button" onClick={() => setStep('post')} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded shadow">
              ⬅️ Quay lại chỉnh sửa bài viết
            </button>

            {contentBlocks.map((block, index) => (
              <ContentBlock
                key={index}
                index={index}
                block={block}
                onChange={handleBlockChange}
                onFileChange={handleBlockFile}
                onRemove={removeBlock}
                canRemove={contentBlocks.length > 1}
              />
            ))}

            <button type="button" onClick={addBlock} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow">
              ➕ Thêm khối nội dung
            </button>

            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded mt-6">
              ✅ Đăng bài viết
            </button>
          </form>
        )}
      </div>
    </MantineProvider>
  );
}
