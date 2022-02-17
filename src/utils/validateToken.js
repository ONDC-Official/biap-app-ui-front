import Cookies from "js-cookie";

export function isLoggedIn() {
  if (Cookies.get("token")) {
    return true;
  }
  return false;
}

export function getUser() {
  if (isLoggedIn()) {
    const user = Cookies.get("user");
    return JSON.parse(user);
  }
  return {};
}
