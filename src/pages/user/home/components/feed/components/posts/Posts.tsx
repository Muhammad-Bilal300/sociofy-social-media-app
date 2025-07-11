import React, { useState } from "react";
import userImage from "../../../../../../../assets/user.png";
import story1 from "../../../../../../../assets/story-1.jpg";
import story2 from "../../../../../../../assets/story-2.jpg";
import story3 from "../../../../../../../assets/story-3.jpg";
import story4 from "../../../../../../../assets/story-4.jpg";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { PiShareFatBold } from "react-icons/pi";

interface Post {
  postedUser: string;
  postedUserImage: string;
  postImage: string | null;
  postDescription: string;
  isSharedPost: boolean;
  sharedPostedUser: SharedPost | null;
  reaction?: string; // <-- add this
}

interface SharedPost {
  postedUser: string;
  postedUserImage: string;
  postImage: string | null;
  postDescription: string;
}

const reactions = [
  { type: "like", emoji: "👍" },
  { type: "love", emoji: "❤️" },
  { type: "care", emoji: "🤗" },
  { type: "wow", emoji: "😮" },
  { type: "sad", emoji: "😢" },
  { type: "angry", emoji: "😠" },
];

const Posts: React.FC = () => {
  const [hoveredPostIndex, setHoveredPostIndex] = useState<number | null>(null);
  const [reactionTimeout, setReactionTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleMouseEnter = (index: number) => {
    if (reactionTimeout) clearTimeout(reactionTimeout);
    setHoveredPostIndex(index);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredPostIndex(null);
    }, 1500); // 3 seconds

    setReactionTimeout(timeout);
  };

  const [postsData, setPostsData] = useState<Post[]>([
    {
      postedUser: "Muhammad Ali",
      postedUserImage: userImage,
      postImage: story1,
      postDescription: "This is Muhammad Ali's post Descriptions",
      isSharedPost: true,
      sharedPostedUser: {
        postedUser: "Muhammad Bilal",
        postedUserImage: userImage,
        postImage: story1,
        postDescription: "This is Muhammad Bilal's post Descriptions",
      },
    },
    {
      postedUser: "Muhammad Talha",
      postedUserImage: userImage,
      postImage: story2,
      postDescription: "This is Muhammad Talha's post Descriptions",
      isSharedPost: false,
      sharedPostedUser: null,
    },
    {
      postedUser: "Muhammad Mustafa",
      postedUserImage: userImage,
      postImage: null,
      postDescription: "This is Muhammad Mustafa's post Descriptions",
      isSharedPost: false,
      sharedPostedUser: null,
    },
    {
      postedUser: "Muhammad Imran",
      postedUserImage: userImage,
      postImage: story3,
      postDescription: "This is Muhammad Imran's post Descriptions",
      isSharedPost: true,
      sharedPostedUser: {
        postedUser: "Muhammad Bilal",
        postedUserImage: userImage,
        postImage: story1,
        postDescription: "This is Muhammad Bilal's post Descriptions",
      },
    },
    {
      postedUser: "Muhammad Imran",
      postedUserImage: userImage,
      postImage: null,
      postDescription: "This is Muhammad Imran's post Descriptions",
      isSharedPost: true,
      sharedPostedUser: {
        postedUser: "Muhammad Bilal",
        postedUserImage: userImage,
        postImage: story1,
        postDescription: "This is Muhammad Bilal's post Descriptions",
      },
    },
    {
      postedUser: "Muhammad Imran",
      postedUserImage: userImage,
      postImage: story4,
      postDescription: "This is Muhammad Imran's post Descriptions",
      isSharedPost: false,
      sharedPostedUser: null,
    },
  ]);

  return (
    <div className="flex flex-col gap-4 w-full overflow-y-auto scrollbar-hide p-0.5">
      {postsData.map((post, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md px-3 pt-3 pb-1.5"
        >
          {/* Main Poster */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={post.postedUserImage}
              alt={post.postedUser}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold">{post.postedUser}</h4>
              <p className="text-xs text-gray-500 mt-[-1px] font-semibold">
                4h .
              </p>
            </div>
          </div>

          {/* Main Description */}
          {!post.isSharedPost && (
            <div>
              <p className="my-2">{post.postDescription}</p>
              {post.postImage && (
                <img
                  src={post.postImage}
                  alt="post"
                  className="w-full max-h-[400px] object-cover rounded-lg"
                />
              )}
            </div>
          )}

          {/* Shared Post */}
          {post.isSharedPost && post.sharedPostedUser && (
            <div className="border-[1px] border-hover-color rounded-lg">
              <div className="flex items-center gap-3 mb-2 px-3 pt-3">
                <img
                  src={post.sharedPostedUser.postedUserImage}
                  alt={post.sharedPostedUser.postedUser}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div>
                  <h4 className="font-semibold">
                    {post.sharedPostedUser.postedUser}
                  </h4>

                  <p className="text-xs text-gray-500 mt-[-1px] font-semibold">
                    4h .
                  </p>
                </div>
              </div>
              <p className="mx-3 mb-2">
                {post.sharedPostedUser.postDescription}
              </p>
              {post.sharedPostedUser.postImage && (
                <img
                  src={post.sharedPostedUser.postImage}
                  alt="shared post"
                  className="w-full max-h-[400px] object-cover rounded-b-lg"
                />
              )}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-between mt-2 border-t-2 border-gray-300 pt-1.5 text-sm text-gray-600">
            <button
              className="font-semibold text-md flex gap-1 items-center cursor-pointer hover:bg-hover-color rounded-md w-[32%] text-center justify-center py-1.5 relative"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <AiOutlineLike className="text-secondary" size={25} /> Like
              {/* Reactions Panel */}
              {hoveredPostIndex === index && (
                <div
                  className="absolute bottom-full left-[90%] transform -translate-x-1/2 mb-2 shadow-secondary flex bg-white  p-1.5 rounded-full shadow-lg z-10 transition-all duration-350"
                  onMouseEnter={() => handleMouseEnter(index)} // keep open if hovering over panel
                  onMouseLeave={handleMouseLeave}
                >
                  {reactions.map((reaction) => (
                    <button
                      key={reaction.type}
                      onClick={() => {
                        const newPosts = [...postsData];
                        newPosts[index].reaction = reaction.type;
                        setPostsData(newPosts);
                        setHoveredPostIndex(null);
                      }}
                      className="text-4xl hover:scale-130 transition-transform duration-150 cursor-pointer"
                    >
                      {reaction.emoji}
                    </button>
                  ))}
                </div>
              )}
            </button>

            <button className="font-semibold text-md flex gap-2 items-center cursor-pointer hover:bg-hover-color rounded-md w-[32%] text-center justify-center py-1.5">
              <FaRegComment className="text-secondary" size={22} /> Comment
            </button>
            <button className="font-semibold text-md flex gap-1.5 items-center cursor-pointer hover:bg-hover-color rounded-md w-[32%] text-center justify-center py-1.5">
              <PiShareFatBold className="text-secondary" size={22} /> Share
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
