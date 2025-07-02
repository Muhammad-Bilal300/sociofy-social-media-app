import { useEffect } from "react";
import Routers from "./routers/Routers";
import { getUserRole } from "./utilities/Globals";
import { useNavigate } from "react-router-dom";
import { ROLES } from "./constants/basic";

const App = () => {
  const navigate = useNavigate();
  // const [isShowed, setIsShowed] = useState(false);
  useEffect(() => {
    const role = getUserRole();
    if (role == ROLES.USER) {
      navigate("/");
      // setIsShowed(true);
    } else if (role == ROLES.ADMIN) {
      navigate("/admin");
      // setIsShowed(true);
    } else {
      navigate("/login");
      // setIsShowed(true);
    }
  }, []);
  return (
    <div>
      <Routers />
    </div>
  );
};

export default App;
