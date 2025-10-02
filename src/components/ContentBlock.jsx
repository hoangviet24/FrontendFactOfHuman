import './filecss/ContentBlock.css';

export default function ContentBlock({
  index,
  block,
  onChange,
  onFileChange,
  onRemove,
  canRemove,
}) {
  return (
    <div className="space-y-6 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md hover:shadow-lg transition duration-300">
      <h4 className="text-xl font-bold text-blue-400">📦 Khối nội dung #{index + 1}</h4>

      {/* Nội dung phần đầu */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">📝 Nội dung phần đầu</label>
        <textarea
          value={block.topContent}
          onChange={(e) => onChange(index, 'topContent', e.target.value)}
          rows={5}
          placeholder="Nhập nội dung phần đầu..."
          className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onFileChange(index, 'topImage', e.target.files[0])}
          className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 hover:border-blue-500 transition"
        />
        {block.topImagePreview && (
          <img
            src={block.topImagePreview}
            alt={`Preview top ${index}`}
            className="mt-2 max-h-40 rounded-lg border border-gray-600 shadow"
          />
        )}
      </div>

      {/* Phân cách */}
      <hr className="border-gray-600 my-4" />

      {/* Nội dung phần cuối */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">📝 Nội dung phần cuối</label>
        <textarea
          value={block.bottomContent}
          onChange={(e) => onChange(index, 'bottomContent', e.target.value)}
          rows={5}
          placeholder="Nhập nội dung phần cuối..."
          className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onFileChange(index, 'bottomImage', e.target.files[0])}
          className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 hover:border-blue-500 transition"
        />
        {block.bottomImagePreview && (
          <img
            src={block.bottomImagePreview}
            alt={`Preview bottom ${index}`}
            className="mt-2 max-h-40 rounded-lg border border-gray-600 shadow"
          />
        )}
      </div>

      {/* Nút xóa */}
      {canRemove && (
        <div className="pt-4">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            🗑️ Xóa khối này
          </button>
        </div>
      )}
    </div>
  );
}
