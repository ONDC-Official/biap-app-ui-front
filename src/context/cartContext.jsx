import { createContext, useState } from "react";

export const CartContext = createContext({
  cartItems: [],
  setCartItems: () => {},
  onRemoveProduct: () => {},
  onReduceQuantity: () => {},
  onAddQuantity: () => {},
  onAddProduct: () => {},
});

export function CartContextProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  // call api to get the items from the cart

  // use this function to remove the product from cart
  function removeProductFromCart(id) {
    setCartItems(cartItems.filter((item) => item.id !== id));
  }

  // use this function to reduce the quantity of the product;
  function reduceQuantityOfProduct(id) {
    const updatedProducts = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: { count: item.quantity.count - 1 } };
      }
      return { ...item };
    });
    // find the product and check if quantity is now 0
    const product = updatedProducts.find((item) => item.id === id);
    // if the quantity is 0 than we will remove from list
    if (product.quantity.count === 0) {
      const filteredProducts = cartItems.filter((product) => product.id !== id);
      setCartItems(filteredProducts);
      return;
    }
    setCartItems(updatedProducts);
  }

  // use this function to add quantity of product
  function addQuantityOfProduct(id) {
    const updatedProducts = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: { count: item.quantity.count + 1 } };
      }
      return { ...item };
    });
    setCartItems(updatedProducts);
  }

  function onAddProductsToCart(value) {
    setCartItems([...cartItems, value]);
  }
  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        onRemoveProduct: removeProductFromCart,
        onReduceQuantity: reduceQuantityOfProduct,
        onAddQuantity: addQuantityOfProduct,
        onAddProduct: onAddProductsToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
