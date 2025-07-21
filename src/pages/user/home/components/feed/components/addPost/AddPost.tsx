import { useState } from "react";

import userImage from "../../../../../../../assets/user.png";
import photoVideoImage from "../../../../../../../assets/photo-video.png";
import feelingActvityImage from "../../../../../../../assets/feeling-activity.png";
import AddPostModal from "./components/addPostModal/AddPostModal";

const AddPost: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="px-4 bg-white w-full rounded-lg shadow-md shadow-hover-color">
        <div className="flex gap-3 py-2.5 border-b-2 border-background">
          <img src={userImage} alt="userImage" className="h-[40px]" />
          <input
            type="text"
            placeholder="What's on your mind, Muhammad?"
            onClick={() => setIsModalOpen(true)}
            readOnly
            className="w-full px-3 rounded-full bg-background focus:outline-none cursor-pointer"
          />
        </div>

        <div className="flex justify-between py-2">
          <div
            className="flex gap-3 py-2 px-2 w-[48%] justify-center items-center cursor-pointer hover:bg-background rounded-md"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={photoVideoImage}
              alt="photoVideoImage"
              className="h-[26px]"
            />
            <div className="font-semibold text-secondary">Photo/Video</div>
          </div>
          <div
            className="flex gap-3 py-2 px-2 w-[48%] justify-center items-center cursor-pointer hover:bg-background rounded-md"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={feelingActvityImage}
              alt="feelingActvityImage"
              className="h-[26px]"
            />
            <div className="font-semibold text-secondary">Feeling/Activity</div>
          </div>
        </div>
      </div>

      <AddPostModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default AddPost;
