import { createContext, useState, useEffect } from "react";
import { getCall } from "../api/axios";
import { getValueFromCookie } from "../utils/cookies";

export const CartContext = createContext({
  cartItems: [],
  setCartItems: () => {},
  getCartItems: () => {},
});

export function CartContextProvider({ children }) {
  let user = {};
  const userCookie = getValueFromCookie("user");

  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch (error) {
      console.log("Error parsing user cookie:", error);
    }
  }

  const [cartItems, setCartItems] = useState([]);

  const getCartItems = async () => {
    try {
      const url = `/clientApis/v2/cart/${user.id}`;
      const res = await getCall(url);
      setCartItems(res);
    } catch (error) {
      console.log("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    if (!!Object.keys(user).length) getCartItems();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        fetchCartItems: getCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
