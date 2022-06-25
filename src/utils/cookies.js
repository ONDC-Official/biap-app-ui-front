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

export function deleteAllCookies() {
  const cookies = document.cookie.split(";");
  cookies.map((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    Cookies.remove(name.trim());
    return null;
  });
}
