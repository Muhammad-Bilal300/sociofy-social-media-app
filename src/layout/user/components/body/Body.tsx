import { Outlet } from "react-router-dom";

const Body = () => {
  return (
    <div className="bg-background">
      <Outlet />
    </div>
  );
};

export default Body;
