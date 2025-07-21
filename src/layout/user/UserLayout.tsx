import Header from "./components/header/Header";
import Body from "./components/body/Body";

const UserLayout = () => {
  return (
    <div>
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <Body />
    </div>
  );
};

export default UserLayout;
