import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import InputField from "../../../components/inputField/InputField";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import TextButton from "../../../components/buttons/textButton/TextButton";
import FilledButton from "../../../components/buttons/filledButton/FilledButton";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { useSignupMutation } from "./hooks/useSignupMutation";
import { SignupFormData } from "./types/SignupTypes";
import appIcon from "../../../assets/appIcon.png";

const Signup = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();

  const signupMutation = useSignupMutation();

  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate(data);
  };

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/login");
  };
  return (
    <div className="min-h-screen w-screen bg-gradient-to-b lg:bg-gradient-to-r from-white via-white to-gradient1 flex flex-col lg:flex-row">
      {/* Left half / Top Half (logo) */}
      <div className="w-full lg:w-1/2 flex justify-center items-center gap-2 py-24 lg:py-0">
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
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 mb-10 lg:mb-0">
        <div className="flex flex-col gap-y-2 bg-white p-4 w-full max-w-[400px] rounded-md shadow-primary shadow-2xl">
          <h3 className={`heading flex justify-center text-primary`}>
            Sign up
          </h3>
          <p className={`text-text-1 flex justify-center text-secondary`}>
            Enter your detials below to register your account
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="pt-3 flex flex-col"
          >
            <InputField
              register={register}
              name="firstName"
              placeholder="First Name"
              type="text"
              errors={errors}
              validationRules={{
                required: "First Name is required",
              }}
              width={`w-[100%]`}
              marginBottom={`mb-4`}
              preIcon={FaUserAlt}
            />
            <InputField
              register={register}
              name="lastName"
              placeholder="Last Name"
              type="text"
              errors={errors}
              validationRules={{
                required: "Last Name is required",
              }}
              width={`w-[100%]`}
              marginBottom={`mb-4`}
              preIcon={FaUserAlt}
            />
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
              width={`w-[100%]`}
              marginBottom={`mb-4`}
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
              width={`w-[100%]`}
              marginBottom={`mb-4`}
              icon={isVisible ? AiFillEye : AiFillEyeInvisible}
              isVisible={isVisible}
              setIsVisible={setIsVisible}
              preIcon={RiLockPasswordFill}
            />

            <div className="mb-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Gender
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="MALE"
                    {...register("gender", { required: "Gender is required" })}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="FEMALE"
                    {...register("gender", { required: "Gender is required" })}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Female</span>
                </label>
              </div>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div className="flex justify-center py-3 text-[14px]">
              <span className="text-gray-500">
                Already have an account?&nbsp;
              </span>
              <TextButton
                onClick={handleLogin}
                buttonText={`Login`}
                fontWeight={`font-semibold`}
                fontSize={`text-md`}
                color={`text-primary`}
              />
            </div>

            <div className="flex flex-col gap-y-3 pb-5">
              <FilledButton
                isIcon={false}
                isIconLeft={true}
                isIconRight={false}
                bgColor={`bg-primary`}
                textColor={`text-white`}
                buttonText={signupMutation.isPending ? "Loading.." : "Sign up"}
                height={`h-[40px]`}
                rounded={`rounded-md`}
                width={`w-full`}
                fontWeight={`font-semibold`}
                fontSize={`text-normal`}
                type={`submit`}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
