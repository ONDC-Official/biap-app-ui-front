import Cookies from "js-cookie";

export function AddCookie(key, value) {
  const cookie_expiry_time = new Date();
  cookie_expiry_time.setTime(cookie_expiry_time.getTime() + 3600 * 1000); // expires in 1 hour
  Cookies.set(key, value, {
    expires: cookie_expiry_time,
  });
}

export function getValueFromCookie(key) {
  return Cookies.get(key);
}

export function removeCookie(key) {
  Cookies.remove(key);
}
