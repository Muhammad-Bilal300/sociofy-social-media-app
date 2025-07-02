import Header from "./components/header/Header";
import Body from "./components/body/Body";
import Footer from "./components/footer/Footer";

const UserLayout = () => {
  return (
    <div className="h-[100vh]">
      <Header />
      <Body />
      <Footer />
    </div>
  );
};

export default UserLayout;
