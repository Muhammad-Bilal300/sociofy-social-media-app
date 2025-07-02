const ERROR_MESSAGES = {
  // auth
  UNIQUE_EMAIL: "Email address should be unique",

  USER_NOT_FOUND: "User not found",
  USER_ID_NOT_GIVEN: "User Id is not given",
  USER_NOT_VERIFEID: "You are not verified yet",
  USER_DEACTIVATED: "Your account has been currently deactivated",

  // error methods

  INVALID_JWT: `Invalid token! Please Login Again`,
  EXPIRED_JWT: `Your token has expired! please login again`,
  UNAUTHORIZE: "You are not authorize to perform this action",
  IMAGE_REQUIRED: `Image is required`,
  INVALID_LOGIN_CREDENTIALS: "Email or Password is Incorrect",
  INVALID_EMAIL: `Please Enter Valid Email`,
  NOT_FOUND: "Not Found",
  EMPTY_REQUIRED_FIELDS: "Required fields are empty.",
  INVALID_DATA: "Invalid data received.",

  ALREADY_EXISTS: (type1: String, type2: String) => {
    return `${type1} already exists with this provided ${type2}`;
  },
  INVALID_OTP: "Invalid OTP Received!",
  USER_CREDENTIALS_NOT_FOUND: "User not found with provided credentials",
  USER_NOT_FOUND_WITH_EMAIL: "User not found with provided email address",
  USER_NOT_FOUND_WITH_ID: "User not found with provided identification",
  PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCHED:
    "Password and confirm password has not matched",
  INCORRECT_CURRENT_PASSWORD: "Current password is not correct",
  AUTHENTICATED_USER_NOT_FOUND: "Authenticated User not found",

  ENDPOINT_ACCESS_DENIED: (userType: String) => {
    return `Forbidden! only ${userType}s are allowed.`;
  },
};

export { ERROR_MESSAGES };
