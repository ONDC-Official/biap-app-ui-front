export function getSubTotal(cartItems) {
  let sum = 0;
  cartItems.forEach(({ product, quantity }) => {
    if (quantity.count < 2) {
      sum += Number(product.price.value);
      return;
    } else {
      sum += quantity.count * Number(product.price.value);
    }
  });
  return Number.isInteger(sum) ? sum : sum.toFixed(2);
}
