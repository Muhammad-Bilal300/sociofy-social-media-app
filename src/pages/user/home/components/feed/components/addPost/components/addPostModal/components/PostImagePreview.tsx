// components/PostImagePreview.tsx
import { IoIosClose } from "react-icons/io";

interface Props {
  selectedImages: File[];
  handleRemoveImage: (index: number) => void;
}

const PostImagePreview = ({ selectedImages, handleRemoveImage }: Props) => {
  const total = selectedImages.length;
  const visibleImages = selectedImages.slice(0, 3);
  const extraCount = total - 3;

  if (total === 0) return null;

  return (
    <div className="mb-3 space-y-2">
      {visibleImages[0] && (
        <div className="relative w-full h-[260px]">
          <img
            src={URL.createObjectURL(visibleImages[0])}
            alt="img"
            className="w-full h-full object-cover rounded-md"
          />
          <div
            className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 cursor-pointer"
            onClick={() => handleRemoveImage(0)}
          >
            <IoIosClose size={20} />
          </div>
        </div>
      )}

      {visibleImages.length > 1 && (
        <div className="grid grid-cols-2 gap-2">
          {visibleImages.slice(1).map((img, i) => {
            const index = i + 1;
            const isLastVisible = index === 2 && extraCount > 0;
            return (
              <div key={index} className="relative h-[150px]">
                <img
                  src={URL.createObjectURL(img)}
                  alt="img"
                  className="w-full h-full object-cover rounded-md"
                />
                <div
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 cursor-pointer z-10"
                  onClick={() => handleRemoveImage(index)}
                >
                  <IoIosClose size={20} />
                </div>
                {isLastVisible && (
                  <div className="absolute inset-0 bg-black opacity-70 flex items-center justify-center rounded-md text-white font-semibold text-4xl">
                    +{extraCount}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PostImagePreview;
