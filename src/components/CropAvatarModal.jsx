import Cropper from 'react-easy-crop';
import { useState } from 'react';
import getCroppedImg from '../services/crop';
import { useEffect } from 'react';
export default function CropAvatarModal({ file, onCropDone, onCancel }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const handleCropComplete = (_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    };

    const handleDone = async () => {
        const croppedBlob = await getCroppedImg(file, croppedAreaPixels);
        const croppedFile = new File([croppedBlob], file.name, { type: 'image/jpeg' });
        onCropDone(croppedFile);
    };
    useEffect(() => {
        if (!file) return;

        const img = new Image();
        img.onload = () => {
            const { width, height } = img;
            const minEdge = Math.min(width, height); // 👈 cạnh ngắn nhất
            const zoomToFit = minEdge / minEdge; // luôn là 1, nhưng có thể điều chỉnh nếu cần

            setZoom(zoomToFit);
            setCrop({ x: 0, y: 0 }); // căn giữa
        };
        img.src = URL.createObjectURL(file);
    }, [file]);
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded shadow-lg w-[800px] h-[600px] relative overflow-hidden">
                {/* Cropper */}
                <div className="absolute inset-0 w-full h-full">
                    <Cropper
                        image={URL.createObjectURL(file)}
                        crop={crop}
                        zoom={zoom}
                        aspect={1} // 👈 khung vuông để vẽ hình tròn
                        cropShape="round"
                        objectFit="contain"
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={handleCropComplete}
                    />
                </div>

                {/* Thanh zoom */}
                <div className="absolute bottom-20 left-0 w-full px-6 z-10">
                    <input
                        type="range"
                        min={1}
                        max={10}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full mt-4"
                    />
                </div>

                {/* Nút điều khiển */}
                <div className="absolute bottom-4 right-4 flex gap-3 z-10">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleDone}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Xong
                    </button>
                </div>
            </div>
        </div>
    );

}
