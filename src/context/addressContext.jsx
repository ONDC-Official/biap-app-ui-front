import { createContext, useState } from "react";

export const AddressContext = createContext({
  deliveryAddress: {},
  setDeliveryAddress: () => {},
  billingAddress: {},
  setBillingAddress: () => {},
});

export function AddressContextProvider({ children }) {
  const [deliveryAddress, setDeliveryAddress] = useState();
  const [billingAddress, setBillingAddress] = useState();
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
