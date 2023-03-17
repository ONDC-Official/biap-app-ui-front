export const CANCELATION_REASONS = [
  {
    key: "001",
    value:
      "Price of one or more items have changed due to which buyer was asked to make additional payment",
    isApplicableForCancellation: true,
  },
  // {
  //   key: "002",
  //   value: "One or more items in the Order not available",
  //   isApplicableForCancellation: true,
  // },
  {
    key: "003",
    value: "Product available at lower than order price",
    isApplicableForCancellation: true,
  },
  {
    key: "004",
    value: "Order in pending shipment / delivery state for too long",
    isApplicableForCancellation: true,
  },
  // {
  //   key: "005",
  //   value: "Merchant rejected the order",
  //   isApplicableForCancellation: true,
  // },
  {
    key: "006",
    value: "Order not shipped as per buyer app SLA",
    isApplicableForCancellation: true,
  },
  {
    key: "009",
    value: "Wrong product delivered",
    isApplicableForCancellation: true,
  },
  {
    key: "010",
    value: "Buyer wants to modify details",
    isApplicableForCancellation: false,
  },
  // {
  //   key: "011",
  //   value: "Buyer not found or cannot be contacted",
  //   isApplicableForCancellation: false,
  // },
  {
    key: "012",
    value: "Buyer does not want product any more",
    isApplicableForCancellation: false,
  },
  // {
  //   key: "013",
  //   value: "Buyer refused to accept delivery",
  //   isApplicableForCancellation: false,
  // },
  // {
  //   key: "014",
  //   value: "Address not found",
  //   isApplicableForCancellation: false,
  // },
  // {
  //   key: "015",
  //   value: "Buyer not available at location",
  //   isApplicableForCancellation: false,
  // },
  // {
  //   key: "016",
  //   value: "Accident / rain / strike / vehicle issues",
  //   isApplicableForCancellation: false,
  // },
  // {
  //   key: "017",
  //   value: "Order delivery delayed or not possible",
  //   isApplicableForCancellation: false,
  // },
  // {
  //   key: "018",
  //   value: "Delivery pin code not serviceable",
  //   isApplicableForCancellation: false,
  // },
];

export const RETURN_REASONS = [
  {
    key: "001",
    value: "Buyer does not want product any more",
    isApplicableForNonReturnable: false,
  },
  {
    key: "002",
    value: "Product available at lower than order price",
    isApplicableForNonReturnable: false,
  },
  {
    key: "003",
    value: "Product damaged or not in usable state",
    isApplicableForNonReturnable: true,
  },
  {
    key: "004",
    value: "Product is of incorrect quantity or size",
    isApplicableForNonReturnable: true,
  },
  {
    key: "005",
    value: "Product delivered is different from what was shown and ordered",
    isApplicableForNonReturnable: true,
  }
]