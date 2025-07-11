import Feed from "./components/feed/Feed";
import LeftSidebar from "./components/leftSidebar/LeftSidebar";
import RightSidebar from "./components/rightSidebar/RightSidebar";

const Home = () => {
  return (
    <div className="flex justify-between gap-3 px-3.5 py-4">
      {/* Left Sidebar */}
      <div className="w-[22%] h-screen sticky top-18 overflow-y-auto">
        <LeftSidebar />
      </div>

      {/* Feed */}
      <div className="w-[42%] flex justify-center">
        <Feed />
      </div>

      {/* Right Sidebar */}
      <div className="w-[22%] h-screen sticky top-16 overflow-y-auto">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
