export const order_statuses = {
  ordered: "Ordered",
  shipped: "Shipped",
  delivered: "Delivered",
};
export function getOrderStatus(status) {
  switch (status) {
    case order_statuses.ordered:
      return {
        step_value: 1,
        value: order_statuses.ordered,
      };
    case order_statuses.shipped:
      return {
        step_value: 2,
        value: order_statuses.shipped,
      };
    case order_statuses.delivered:
      return {
        step_value: 3,
        value: order_statuses.delivered,
      };
    default:
      return {
        step_value: 1,
        value: order_statuses.ordered,
      };
  }
}
