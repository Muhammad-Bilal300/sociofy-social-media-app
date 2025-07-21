// PostShimmer.tsx
import React from "react";

const PostShimmer: React.FC<{ isShared?: boolean }> = ({
  isShared = false,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md px-3 pt-3 pb-1.5 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <div className="flex flex-col gap-2 w-full">
          <div className="w-1/3 h-4 bg-gray-300 rounded-md" />
          <div className="w-1/4 h-3 bg-gray-200 rounded-md" />
        </div>
      </div>

      {/* Content */}
      {!isShared ? (
        <>
          <div className="h-4 bg-gray-300 rounded-md w-3/4 mb-2" />
          <div className="h-64 bg-gray-200 rounded-lg w-full" />
        </>
      ) : (
        <div className="border-[1px] border-hover-color rounded-lg p-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            <div className="flex flex-col gap-2 w-full">
              <div className="w-1/3 h-4 bg-gray-300 rounded-md" />
              <div className="w-1/4 h-3 bg-gray-200 rounded-md" />
            </div>
          </div>
          <div className="h-4 bg-gray-300 rounded-md w-3/4 mb-2" />
          <div className="h-64 bg-gray-200 rounded-lg w-full" />
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between mt-4 border-t-2 border-gray-300 pt-2">
        <div className="h-5 w-1/4 bg-gray-200 rounded-md" />
        <div className="h-5 w-1/4 bg-gray-200 rounded-md" />
        <div className="h-5 w-1/4 bg-gray-200 rounded-md" />
      </div>
    </div>
  );
};

export default PostShimmer;
