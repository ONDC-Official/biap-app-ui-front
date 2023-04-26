import { ONDC_COLORS } from "../components/shared/colors";

export const order_statuses = {
  created: "Created",
  shipped: "Shipped",
  accepted: "Accepted",
  inprogress: "In-progress",
  completed: "Completed",
  delivered: "Delivered",
  cancelled: "Cancelled",
  updated: "Updated",
  returned: "Returned",
  replaced: "Replaced",
  Active: "Active",
  open: "Open",
  closed: "Close"
};

export function getOrderStatus(status) {
  switch (status) {
    case order_statuses.created:
      return {
        status: "Created",
        color: "28, 117, 188",
        border: ONDC_COLORS.ACCENTCOLOR,
      };
    case order_statuses.accepted:
      return {
        status: "Accepted",
        color: "249, 193, 50",
        border: ONDC_COLORS.WARNING,
      };
    case order_statuses.inprogress:
      return {
        status: "In-progress",
        color: "46, 176, 134",
        border: ONDC_COLORS.SUCCESS,
      };
      case order_statuses.open:
        return {
          status: "Open",
          color: "46, 176, 134",
          border: ONDC_COLORS.SUCCESS,
        };
        case order_statuses.closed:
          return {
            status: "Close",
            color: "46, 176, 134",
            border: ONDC_COLORS.SUCCESS,
          };
    case order_statuses.completed:
      return {
        status: "Completed",
        color: "46, 176, 134",
        border: ONDC_COLORS.SUCCESS,
      };
    case order_statuses.cancelled:
      return {
        status: "Cancelled",
        color: "255, 89, 89",
        border: ONDC_COLORS.ERROR,
      };
    case order_statuses.returned:
      return {
        status: "Returned",
        color: "255, 89, 89",
        border: ONDC_COLORS.ERROR,
      };
    case order_statuses.replaced:
      return {
        status: "Replaced",
        color: "255, 89, 89",
        border: ONDC_COLORS.ERROR,
      };
    case order_statuses.updated:
      return {
        status: "Updated",
        color: "249, 193, 50",
        border: ONDC_COLORS.WARNING,
      };
    default:
      return null;
  }
}
