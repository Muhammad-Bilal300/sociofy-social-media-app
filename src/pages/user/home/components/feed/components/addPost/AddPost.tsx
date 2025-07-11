import userImage from "../../../../../../../assets/user.png";
import feelingActvityImage from "../../../../../../../assets/feeling-activity.png";
import photoVideoImage from "../../../../../../../assets/photo-video.png";

const AddPost = () => {
  return (
    <div className="px-4 bg-white w-[100%] rounded-lg shadow-md shadow-hover-color">
      <div className="flex gap-3 py-2.5 border-b-2 border-body-background">
        <img src={userImage} alt="userImage" className="h-[40px]" />
        <input
          type="text"
          placeholder="What's on you mind, Muhammad?"
          className="w-full px-3 rounded-full bg-hover-color focus:outline-none"
        />
      </div>
      <div className="flex justify-between py-2">
        <div className="flex gap-3 py-2 px-2 w-[48%] justify-center items-center cursor-pointer hover:bg-hover-color rounded-md">
          <div>
            <img
              src={photoVideoImage}
              alt="photoVideoImage"
              className="h-[26px]"
            />
          </div>
          <div className="font-semibold text-secondary">Photo/Video</div>
        </div>
        <div className="flex gap-3 py-2 px-2 w-[48%] justify-center items-center cursor-pointer hover:bg-hover-color rounded-md">
          <div>
            {" "}
            <img
              src={feelingActvityImage}
              alt="feelingActvityImage"
              className="h-[26px]"
            />
          </div>
          <div className="font-semibold text-secondary">Feeling/Activity</div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
