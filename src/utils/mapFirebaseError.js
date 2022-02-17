const errorCodes = {
  INVALID_EMAIL: "auth/invalid-email",
  WRONG_PASSWORD: "auth/wrong-password",
  USER_NOT_FOUND: "auth/user-not-found",
  WEEK_PASSWORD: "auth/weak-password",
  EMAIL_ALREADY_EXIST: "auth/email-already-in-use",
};

export function getErrorMessage(type) {
  switch (type) {
    case errorCodes.EMAIL_ALREADY_EXIST:
      return "Email already exist! Please login";

    case errorCodes.INVALID_EMAIL:
      return "Email is invalid! Please double check your inputs";

    case errorCodes.USER_NOT_FOUND:
      return "User does not exist! Please sign up";

    case errorCodes.WEEK_PASSWORD:
      return "Password should be atleast 8 character";

    case errorCodes.WRONG_PASSWORD:
      return "Email or password is invalid";

    default:
      return "Something went wrong";
  }
}
