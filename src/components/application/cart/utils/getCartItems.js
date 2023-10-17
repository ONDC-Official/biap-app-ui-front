import { getCall } from "../../../../api/axios";
import { getValueFromCookie } from "../../../../utils/cookies";

let user = {};
const userCookie = getValueFromCookie("user");

if (userCookie) {
  try {
    user = JSON.parse(userCookie);
  } catch (error) {
    console.log("Error parsing user cookie:", error);
  }
}

export const getCartItems = async () => {
  const url = `/clientApis/v2/cart/${user.id}`;
  const res = await getCall(url);
  return res;
};
