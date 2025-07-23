import React, { useEffect, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaCheckCircle, FaRegComment, FaUserAlt } from "react-icons/fa";
import { PiShareFatBold } from "react-icons/pi";
import PostShimmer from "./components/PostShimmer";
import { imageBaseUrl } from "../../../../../../../services/baseUrl";
import { Post } from "./types/GetPostsTypes";
import PostImageGallery from "./components/PostImageGallery";
import GoogleMapLocation from "./components/GoogleMapLocation";
import { connectSocket } from "../../../../../../../socket/socket";
import { useGetAllPostsQuery } from "./hooks/useGetPostsMutation";

import { toast } from "react-toastify"; // assuming you use react-toastify
import "react-toastify/dist/ReactToastify.css";
import { getTimeAgo, getUserId } from "../../../../../../../utilities/Globals";

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
    }, 1000); // 3 seconds

    setReactionTimeout(timeout);
  };

  const openGoogleMap = (locationCoords: any) => {
    if (locationCoords) {
      const [lat, lon] = locationCoords;
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`,
        "_blank"
      );
    }
  };

  const { data, isLoading, refetch } = useGetAllPostsQuery();

  useEffect(() => {
    const userId = getUserId();

    if (userId) {
      const socket = connectSocket(userId);
      // Prevent adding multiple listeners
      socket.off("post-created"); // remove previous listener if exists

      socket.on("post-created", () => {
        toast(
          <div className="flex items-center gap-2 text-white font-bold">
            <FaCheckCircle className="text-green-600" />
            Your post has been published.
          </div>,
          {
            position: "top-right",
            autoClose: 2000,
            pauseOnHover: true,
            style: {
              background: "#4B5563", // Tailwind gray-700
              color: "#fff",
              fontWeight: "bold",
            },
            icon: false, // we already have our icon
          }
        );
        refetch();
      });
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full overflow-y-auto scrollbar-hide p-0.5">
      {isLoading ? (
        <>
          <PostShimmer isShared={false} />
          <PostShimmer isShared={true} />
          <PostShimmer isShared={false} />
        </>
      ) : data?.data?.length === 0 ? (
        <div className="bg-white w-full flex justify-center items-center p-10 rounded-xl shadow-md text-gray-600 text-lg font-semibold">
          No Posts yet
        </div>
      ) : (
        data?.data?.map((post: Post, index: number) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md px-3 pt-3 pb-1.5"
          >
            {/* Main Poster */}
            <div className="flex items-center gap-3 mb-4">
              {post.user?.profilePicture !== "" ? (
                <img
                  src={`${imageBaseUrl}${post.user?.profilePicture}`}
                  alt={post.user?.firstName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="rounded-full p-2 bg-[#d6d6d8] cursor-pointer">
                  <FaUserAlt size={22} className="text-secondary" />
                </div>
              )}
              <div>
                <h4 className="font-semibold">
                  {post.feeling || post.location ? (
                    <div>
                      {post.user?.firstName} {post.user?.lastName}
                      {post.feeling && ` is feeling`}
                      <span className="text-primary font-bold">
                        {post.feeling && `${post.feeling}`}
                      </span>
                      {post.location && ` at `}
                      <span
                        onClick={() => openGoogleMap(post.locationCoords)}
                        className="text-secondary hover:text-primary cursor-pointer"
                      >
                        {post.location && `${post.location}`}.
                      </span>
                    </div>
                  ) : (
                    `${post.user?.firstName} ${post.user?.lastName}`
                  )}
                </h4>
                <p className="text-xs text-gray-500 mt-[-1px] font-semibold">
                  {getTimeAgo(post.updatedAt || "")}.
                </p>
              </div>
            </div>

            {/* Shared Post is null null */}
            {post.sharedBy && post.sharedPost ? (
              <div className="border-[1px] border-hover-color rounded-lg">
                <div className="flex items-center gap-3 mb-2 px-3 pt-3">
                  {post.sharedBy?.profilePicture !== "" ? (
                    <img
                      src={`${imageBaseUrl}${post.sharedBy?.profilePicture}`}
                      alt={post.sharedBy?.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="rounded-full p-2 bg-[#d6d6d8] cursor-pointer">
                      <FaUserAlt size={22} className="text-secondary" />
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold">
                      {post.sharedPost.feeling || post.sharedPost.location ? (
                        <div>
                          {post.sharedBy?.firstName} {post.sharedBy?.lastName}
                          {post.sharedPost.feeling && ` is feeling`}
                          <span className="text-primary font-bold">
                            {post.sharedPost.feeling &&
                              `${post.sharedPost.feeling}`}
                          </span>
                          {post.sharedPost.location && ` at `}
                          <span
                            onClick={() =>
                              openGoogleMap(post?.sharedPost?.locationCoords)
                            }
                            className="text-secondary hover:text-primary cursor-pointer"
                          >
                            {post.sharedPost.location &&
                              `${post.sharedPost.location}`}
                            .
                          </span>
                        </div>
                      ) : (
                        `${post.sharedBy?.firstName} ${post.sharedBy?.lastName}`
                      )}
                    </h4>

                    <p className="text-xs text-gray-500 mt-[-1px] font-semibold">
                      {getTimeAgo(post.sharedPost?.updatedAt || "")}.
                    </p>
                  </div>
                </div>

                <p
                  className="mx-3 mb-2 whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: (post.sharedPost?.description || "").replace(
                      /\r\n|\n|\r/g,
                      "<br />"
                    ),
                  }}
                />

                <GoogleMapLocation
                  selectedLocationCoords={post.sharedPost?.locationCoords}
                  selectedImages={post.sharedPost?.files}
                  selectedLocation={post.sharedPost?.location}
                />
                <PostImageGallery files={post.sharedPost.files} />
              </div>
            ) : (
              <div>
                <p
                  className="my-2 whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: (post?.description || "").replace(
                      /\r\n|\n|\r/g,
                      "<br />"
                    ),
                  }}
                />
                <GoogleMapLocation
                  selectedLocationCoords={post?.locationCoords}
                  selectedImages={post?.files}
                  selectedLocation={post?.location}
                />
                <PostImageGallery files={post.files} />
              </div>
            )}

            {/* Footer Buttons */}
            <div
              className="flex justify-between mt-2 border-t-2 border-gray-300 pt-1.5 text-sm text-gray-600 z-50"
              style={{ zIndex: 9999 }}
            >
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
        ))
      )}
    </div>
  );
};

export default Posts;
