import { FaMapMarkerAlt, FaRegSmile } from "react-icons/fa";
import { MdPhotoLibrary } from "react-icons/md";

interface Props {
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationClick: () => void;
  onFeelingClick: () => void;
}

const PostActionBar = ({
  onImageSelect,
  onLocationClick,
  onFeelingClick,
}: Props) => {
  return (
    <div className="flex items-center justify-between mt-3 mb-4 p-3 border-secondary border-1 rounded-md">
      <p className="text-lg font-semibold">Add to your Post</p>
      <div className="flex gap-4">
        <div className="relative group">
          <label>
            <MdPhotoLibrary
              size={26}
              color="green"
              className="cursor-pointer"
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onImageSelect}
              className="hidden"
            />
          </label>
          <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
            Photo/Image
          </span>
        </div>
        <div className="relative group" onClick={onLocationClick}>
          <FaMapMarkerAlt size={24} color="red" className="cursor-pointer" />
          <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
            Location
          </span>
        </div>

        <div className="relative group" onClick={onFeelingClick}>
          <FaRegSmile size={24} color="orange" className="cursor-pointer" />
          <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
            Feelings
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostActionBar;
