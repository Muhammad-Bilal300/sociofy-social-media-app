import Feed from "./components/feed/Feed";
import LeftSidebar from "./components/leftSidebar/LeftSidebar";
import RightSidebar from "./components/rightSidebar/RightSidebar";

const Home = () => {
  return (
    <div className="flex justify-between gap-2 px-3.5 py-4">
      {/* Left Sidebar - show on lg and above */}
      <div className="hidden lg:block w-[24%] h-screen sticky top-18 overflow-y-auto">
        <LeftSidebar />
      </div>

      {/* Feed - always visible and centered */}
      <div className="w-full md:w-[58%] lg:w-[40%] flex justify-center">
        <Feed />
      </div>

      {/* Right Sidebar - show on md and above */}
      <div className="hidden md:block w-[24%] h-screen sticky top-16 overflow-y-auto">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
