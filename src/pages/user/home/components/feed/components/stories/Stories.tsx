import userImage from "../../../../../../../assets/user.png";
import story1 from "../../../../../../../assets/story-1.jpg";
import story2 from "../../../../../../../assets/story-2.jpg";
import story3 from "../../../../../../../assets/story-3.jpg";
import story4 from "../../../../../../../assets/story-4.jpg";

const Stories = () => {
  const stories = [
    {
      user: "Muhammad Ali",
      userImage: userImage,
      story: story1,
    },
    {
      user: "Ayesha Khan",
      userImage: userImage,
      story: story2,
    },
    {
      user: "Zain Malik",
      userImage: userImage,
      story: story3,
    },
    {
      user: "Sara Noor",
      userImage: userImage,
      story: story4,
    },
    {
      user: "Ali Raza",
      userImage: userImage,
      story: story1,
    },
    {
      user: "Zain Malik",
      userImage: userImage,
      story: story3,
    },
    {
      user: "Sara Noor",
      userImage: userImage,
      story: story4,
    },
    {
      user: "Muhammad Ali",
      userImage: userImage,
      story: story1,
    },
  ];

  return (
    <div className="flex gap-x-2.5 w-full overflow-x-auto scrollbar-hide py-2">
      {/* Add Story Card */}
      <div className="relative h-[200px] w-[115px] flex-shrink-0 rounded-lg shadow-md overflow-hidden group cursor-pointer bg-white">
        {/* Overlay */}
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.3)]" />

        {/* Plus Button */}
        <div className="absolute top-15 left-2 right-2 flex justify-center flex-col items-center">
          <div className="h-11 w-11 bg-blue-600 text-white text-3xl font-bold rounded-full pb-1 text-center flex items-center justify-center border-4 border-white">
            +
          </div>
          <div className="text-center text-white text-sm font-medium drop-shadow">
            Add Story
          </div>
        </div>

        {/* Label */}
      </div>

      {/* Actual Stories */}
      {stories.map((story, index) => (
        <div
          key={index}
          className="relative h-[200px] w-[115px] flex-shrink-0 rounded-lg shadow-md overflow-hidden group cursor-pointer"
        >
          <img
            src={story.story}
            alt="story"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)] opacity-50 group-hover:opacity-100 transition-opacity duration-200"></div>
          <div className="absolute top-2 left-3">
            <img
              src={story.userImage}
              alt="user"
              className="h-11 w-11 rounded-full border-4 border-blue-500"
            />
          </div>
          <div className="absolute bottom-2 left-3 right-2 text-white text-sm font-medium drop-shadow">
            {story.user}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stories;
