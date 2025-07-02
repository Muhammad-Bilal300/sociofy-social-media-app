import AdminLayout from "./admin/AdminLayout";
import UserLayout from "./user/UserLayout";

const Layout = () => {
  var role = "User";
  return (
    <div className="h-[100vh]">
      {role == "User" ? <UserLayout /> : <AdminLayout />}
    </div>
  );
};

export default Layout;
