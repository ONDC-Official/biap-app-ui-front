import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
export function getCall(url) {
  const token = Cookies.get("token");
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(url, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      return resolve(response.data);
    } catch (err) {
      return reject(err);
    }
  });
}

export function postCall(url, params) {
  const token = Cookies.get("token");
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(url, params, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      return resolve(response.data);
    } catch (err) {
      return reject(err);
    }
  });
}
