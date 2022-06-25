import Cookies from "js-cookie";
import { deleteAllCookies } from "../utils/cookies";

export function isLoggedIn() {
  if (Cookies.get("token")) {
    return true;
  }
  deleteAllCookies();
  return false;
}

export function getUser() {
  if (isLoggedIn()) {
    const user = Cookies.get("user");
    return JSON.parse(user);
  }
  return {};
}
