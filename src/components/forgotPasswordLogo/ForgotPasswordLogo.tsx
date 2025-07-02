import Lottie from "react-lottie";
import animationData from "../../assets/Forgot-Password-logo.json"; // path to your Lottie JSON

const ForgotPasswordLogo = () => {
  const options = {
    loop: true, // animation should loop
    autoplay: true, // autoplay animation
    animationData: animationData, // animation data imported above
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={options} height={100} width={100} />;
};

export default ForgotPasswordLogo;
