import { putCall } from "../../../../api/axios";
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

export const updateCartItem = async (cartItems, increment, uniqueId) => {
  console.log(cartItems, increment, uniqueId);
  const url = `/clientApis/v2/cart/${user.id}/${uniqueId}`;
  const items = cartItems.concat([]);
  const itemIndex = items.findIndex((item) => item._id === uniqueId);
  if (itemIndex !== -1) {
    let updatedCartItem = items[itemIndex];
    updatedCartItem.id = updatedCartItem.item.id;

    if (increment !== null) {
      if (increment) {
        const productMaxQuantity = updatedCartItem?.item?.product?.quantity?.maximum;
        if (productMaxQuantity) {
          if (updatedCartItem.item.quantity.count < productMaxQuantity.count) {
            updatedCartItem.item.quantity.count += 1;

            let customisations = updatedCartItem.item.customisations;

            if (customisations) {
              customisations = customisations.map((c) => {
                return { ...c, quantity: { ...c.quantity, count: c.quantity.count + 1 } };
              });
              updatedCartItem.item.customisations = customisations;
            } else {
              updatedCartItem.item.customisations = null;
            }

            updatedCartItem = updatedCartItem.item;
            const res = await putCall(url, updatedCartItem);
          }
        } else {
          updatedCartItem.item.quantity.count += 1;
          updatedCartItem = updatedCartItem.item;
          const res = await putCall(url, updatedCartItem);
        }
      } else {
        if (updatedCartItem.item.quantity.count > 1) {
          updatedCartItem.item.quantity.count -= 1;

          let customisations = updatedCartItem.item.customisations;
          customisations = customisations.map((c) => {
            return { ...c, quantity: { ...c.quantity, count: c.quantity.count - 1 } };
          });
          updatedCartItem.item.customisations = customisations;
          updatedCartItem = updatedCartItem.item;
          const res = await putCall(url, updatedCartItem);
        }
      }
    }
  }
};
