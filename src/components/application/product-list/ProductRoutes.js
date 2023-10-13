import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Products from "../../products/products";
import ProductDetails from "./product-details/productDetails";

const ProductRoutes = () => {
  const locationData = useLocation();
  const useQuery = () => {
    const { search } = locationData;
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };
  let query = useQuery();

  const [productId, setProductId] = useState("");

  useEffect(() => {
    if (locationData) {
      const productId = query.get("productId");
      setProductId(productId);
    }
  }, [locationData]);

  if (productId) {
    return <ProductDetails productId={productId} />;
  } else {
    return <Products />;
  }

  return <div>BrandRoutes</div>;
};

export default ProductRoutes;
