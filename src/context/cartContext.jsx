import { createContext, useState, useEffect } from "react";
import { getCall } from "../api/axios";
import { getValueFromCookie } from "../utils/cookies";

export const CartContext = createContext({
  cartItems: [],
  setCartItems: () => {},
  getCartItems: () => {},
});

export function CartContextProvider({ children }) {
  let user = JSON.parse(getValueFromCookie("user"));
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
    getCartItems();
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
