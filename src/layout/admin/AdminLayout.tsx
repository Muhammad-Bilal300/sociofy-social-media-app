import Sidebar from "./components/sidebar/Sidebar";
import Body from "./components/body/Body";

const AdminLayout = () => {
  return (
    <div className="h-[100vh] flex">
      <Sidebar />
      <Body />
    </div>
  );
};

export default AdminLayout;
