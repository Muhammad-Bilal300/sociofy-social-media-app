import AddPost from "./components/addPost/AddPost";
import Posts from "./components/posts/Posts";
import Stories from "./components/stories/Stories";

const Feed = () => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <AddPost />
      <Stories />
      <Posts />
    </div>
  );
};

export default Feed;
