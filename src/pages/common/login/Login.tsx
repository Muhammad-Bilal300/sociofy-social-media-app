import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import InputField from "../../../components/inputField/InputField";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import TextButton from "../../../components/buttons/textButton/TextButton";
import FilledButton from "../../../components/buttons/filledButton/FilledButton";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { LoginFormData } from "./types/LoginTypes";
import { useLoginMutation } from "./hooks/useLoginMutation";
import appIcon from "../../../assets/appIcon.png";

const Login = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const loginMutation = useLoginMutation();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleForgotPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/forgot-password");
  };

  const handleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/sign-up");
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b lg:bg-gradient-to-r from-white via-white to-gradient1 flex flex-col lg:flex-row">
      {/* Left half / Top Half (logo) */}
      <div className="w-full lg:w-1/2 flex justify-center items-center gap-2 py-32 lg:py-0">
        <img
          src={appIcon}
          alt="App-Icon"
          className="h-[60px] w-[60px] lg:h-[90px] lg:w-[90px]"
        />
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
          Sociofy
        </h1>
      </div>

      {/* Empty Right half / Bottom Half */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4">
        <div className="flex flex-col gap-y-2 bg-white p-4 w-full max-w-[400px] rounded-md shadow-primary shadow-2xl">
          <h3 className="heading flex justify-center text-primary">Login</h3>
          <p className="text-text-1 flex justify-center text-secondary">
            Enter your email below to login your account
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="pt-2 flex flex-col"
          >
            <InputField
              register={register}
              name="emailAddress"
              placeholder="Email Address"
              type="text"
              errors={errors}
              validationRules={{
                required: "Email Address is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              }}
              width="w-full"
              marginBottom="mb-4"
              preIcon={MdEmail}
            />

            <InputField
              register={register}
              name="password"
              placeholder="Password"
              type={isVisible ? "text" : "password"}
              errors={errors}
              validationRules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              width="w-full"
              marginBottom="mb-1"
              icon={isVisible ? AiFillEye : AiFillEyeInvisible}
              isVisible={isVisible}
              setIsVisible={setIsVisible}
              preIcon={RiLockPasswordFill}
            />

            <div className="flex justify-end text-blue-600 text-[12px] font-semibold">
              <TextButton
                onClick={handleForgotPassword}
                buttonText="Forgot Password ?"
                fontWeight="font-semibold"
                fontSize="text-sm"
                color="text-primary"
              />
            </div>

            <div className="flex justify-center py-5 text-[14px]">
              <span className="text-gray-500">
                Don't have an account?&nbsp;
              </span>
              <TextButton
                onClick={handleSignUp}
                buttonText="Sign up"
                fontWeight="font-semibold"
                fontSize="text-md"
                color="text-primary"
              />
            </div>

            <div className="flex flex-col gap-y-3 pb-5">
              <FilledButton
                isIcon={false}
                isIconLeft={true}
                isIconRight={false}
                bgColor="bg-primary"
                textColor="text-white"
                buttonText={loginMutation.isPending ? "Loading.." : "Login"}
                height="h-[40px]"
                rounded="rounded-md"
                width="w-full"
                fontWeight="font-semibold"
                fontSize="text-normal"
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
