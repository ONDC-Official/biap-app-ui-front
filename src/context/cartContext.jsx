import { createContext, useState, useEffect } from "react";

export const CartContext = createContext({
  cartItems: [],
  setCartItems: () => { },
  onRemoveProduct: () => { },
  onReduceQuantity: () => { },
  onAddQuantity: () => { },
  onAddProduct: () => { },
  onUpdateProduct: () => { }
});

export function CartContextProvider({ children }) {
  const parsedCartItems = JSON.parse(localStorage.getItem("cartItems") || "{}");
  const [cartItems, setCartItems] = useState(
    parsedCartItems.length > 0 ? parsedCartItems : []
  );

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

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

  function onUpdateProductToCart(items, fulfillments) {
    const updatedProducts = cartItems.map((item) => {
      if (item.id === items[0].id) {
        item.fulfillment_id = items[0].fulfillment_id;
        item.fulfillments = fulfillments;
        return item;;
      }
      return { ...item };
    });
    setCartItems(updatedProducts);
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
        onUpdateProduct: onUpdateProductToCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
