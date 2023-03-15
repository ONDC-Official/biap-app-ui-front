import { createContext, useState, useEffect } from "react";

export const AddressContext = createContext({
  deliveryAddress: {},
  setDeliveryAddress: () => { },
  billingAddress: {},
  setBillingAddress: () => { },
});

export function AddressContextProvider({ children }) {
  const [deliveryAddress, setDeliveryAddress] = useState();
  const [billingAddress, setBillingAddress] = useState();
  useEffect(() => {
    if (deliveryAddress) {
      setBillingAddress();
    }
  }, [deliveryAddress]);
  return (
    <AddressContext.Provider
      value={{
        deliveryAddress,
        setDeliveryAddress,
        billingAddress,
        setBillingAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}
