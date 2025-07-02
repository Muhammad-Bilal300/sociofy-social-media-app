import { useForm } from "react-hook-form";
import InputField from "../../../components/inputField/InputField";
import FilledButton from "../../../components/buttons/filledButton/FilledButton";
import { MdEmail } from "react-icons/md";
import { useCheckUserEmailMutation } from "./hooks/useForgotPasswordHooks";
import { ForgotPasswordCheckEmailFormData } from "./types/ForgotPasswordTypes";
import appIcon from "../../../assets/appIcon.png";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordCheckEmailFormData>();

  const forgotPasswordMutation = useCheckUserEmailMutation();

  const onSubmit = (data: ForgotPasswordCheckEmailFormData) => {
    forgotPasswordMutation.mutate(data);
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
          <h3 className={`heading flex justify-center text-primary`}>
            Forgot Password
          </h3>
          <p className={`text-text-1 flex justify-center text-secondary`}>
            Enter your email below to send OTP
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="pt-4 flex flex-col"
          >
            <InputField
              register={register}
              name="emailAddress"
              placeholder="Email"
              type="text"
              errors={errors}
              validationRules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              }}
              width={`w-[100%]`}
              marginBottom={`mb-4`}
              preIcon={MdEmail}
            />

            <div className="flex flex-col gap-y-3 pb-5">
              <FilledButton
                isIcon={false}
                isIconLeft={true}
                isIconRight={false}
                bgColor={`bg-primary`}
                textColor={`text-white`}
                buttonText={
                  forgotPasswordMutation.isPending ? "Loading.." : "Send OTP"
                }
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

export default ForgotPassword;
