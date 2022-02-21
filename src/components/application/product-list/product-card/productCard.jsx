import React from "react";

export default function ProductCard(props) {
  const { product, bpp_id, location_id, bpp_provider_id } = props;
  const { id, descriptor, price } = product;
  return (
    <div>
      <p>{id}</p>
      <p>{descriptor.name}</p>
      <p>{Math.round(price.value)}</p>
    </div>
  );
}
