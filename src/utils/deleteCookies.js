import Cookies from "js-cookie";

export function deleteAllCookies() {
  const cookies = document.cookie.split(";");
  cookies.map((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    Cookies.remove(name.trim());
    return null;
  });
}
