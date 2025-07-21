import React from "react";
import { PostFile } from "../types/GetPostsTypes";
import { imageBaseUrl } from "../../../../../../../../services/baseUrl";

interface Props {
  files?: PostFile[];
}

const PostImageGallery: React.FC<Props> = ({ files }) => {
  if (!files || files.length === 0) return null;

  const total = files.length;
  const visibleImages = files.slice(0, 3);
  const extraCount = total - 3;

  return (
    <div className="mb-3 space-y-2">
      {visibleImages[0] && (
        <div className="relative w-full h-[230px]">
          <img
            src={`${imageBaseUrl}${visibleImages[0].url}`}
            alt="post"
            className="w-full h-full object-cover rounded-md"
          />
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
                  src={`${imageBaseUrl}${img.url}`}
                  alt={`post-${index}`}
                  className="w-full h-full object-cover rounded-md"
                />
                {isLastVisible && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-md text-white font-semibold text-4xl">
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

export default PostImageGallery;
