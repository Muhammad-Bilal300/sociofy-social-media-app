import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Routers from "./routers/Routers";
import { getUserRole, getUserToken } from "./utilities/Globals";
import { ROLES } from "./constants/basic";

const App = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getUserToken();
    const role = getUserRole();

    if (token && role === ROLES.USER) {
      navigate("/");
    } else if (token && role === ROLES.ADMIN) {
      navigate("/admin/dashboard");
    } else {
      navigate("/login");
    }

    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );

  return <Routers />;
};

export default App;
