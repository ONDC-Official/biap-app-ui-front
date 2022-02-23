export const checkout_steps = {
  SELECT_ADDRESS: "select_address",
  CONFIRM_ORDER: "confirm_order",
  SELECT_PAYMENT_METHOD: "select_payment_method",
};

export function get_current_step(step_id) {
  switch (step_id) {
    case checkout_steps.SELECT_ADDRESS:
      return {
        current_active_step_id: step_id,
        current_active_step_number: 1,
      };

    case checkout_steps.CONFIRM_ORDER:
      return {
        current_active_step_id: step_id,
        current_active_step_number: 2,
      };

    case checkout_steps.SELECT_PAYMENT_METHOD:
      return {
        current_active_step_id: step_id,
        current_active_step_number: 3,
      };

    default:
      return {
        current_active_step_id: step_id,
        current_active_step_number: 1,
      };
  }
}
