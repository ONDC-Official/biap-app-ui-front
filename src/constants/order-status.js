import { ONDC_COLORS } from "../components/shared/colors";

export const order_statuses = {
  ordered: "Ordered",
  shipped: "Shipped",
  delivered: "Delivered",
  canceled: "CANCELLED",
  pending_confirmation: "PENDING-CONFIRMATION",
  Pending: "Pending",
  Active: "Active",
  Processing: "Processing",
};
export function getOrderStatus(status) {
  switch (status) {
    case order_statuses.ordered:
      return {
        status: "Ordered",
        color: "28, 117, 188",
        border: ONDC_COLORS.ACCENTCOLOR,
      };
    case order_statuses.shipped:
      return {
        status: "Shipped",
        color: "28, 117, 188",
        border: ONDC_COLORS.ACCENTCOLOR,
      };
    case order_statuses.Processing:
      return {
        status: "Processing",
        color: "28, 117, 188",
        border: ONDC_COLORS.ACCENTCOLOR,
      };
    case order_statuses.Active:
      return {
        status: "Active",
        color: "46, 176, 134",
        border: ONDC_COLORS.SUCCESS,
      };
    case order_statuses.delivered:
      return {
        status: "Delivered",
        color: "46, 176, 134",
        border: ONDC_COLORS.SUCCESS,
      };
    case order_statuses.canceled:
      return {
        status: "Cancled",
        color: "255, 89, 89",
        border: ONDC_COLORS.ERROR,
      };
    case order_statuses.pending_confirmation:
      return {
        status: "Pending",
        color: "249, 193, 50",
        border: ONDC_COLORS.WARNING,
      };
    case order_statuses.Pending:
      return {
        status: "Pending",
        color: "249, 193, 50",
        border: ONDC_COLORS.WARNING,
      };
    default:
      return {
        status: "Ordered",
        color: "28, 117, 188",
        border: ONDC_COLORS.ACCENTCOLOR,
      };
  }
}
