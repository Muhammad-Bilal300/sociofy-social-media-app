import User from "../models/user-model";

export const checkUserActivation = async (emailAddress: string): Promise<boolean> => {
  const isActvatedUser = await User.findOne({ emailAddress: emailAddress });
  if (isActvatedUser?.isActivated) {
    return true;
  } else {
    return false;
  }
};
