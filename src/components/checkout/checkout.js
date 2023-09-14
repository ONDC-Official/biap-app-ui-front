import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import useStyles from "./style";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";

import StepOneLabel from "./stepOne/stepOneLabel";
import StepOneContent from "./stepOne/stepOneContent";
import StepTwoLabel from "./stepTwo/stepTwoLabel";
import StepTwoContent from "./stepTwo/stepTwoContent";
import StepThreeLabel from "./stepThree/stepThreeLabel";
import StepThreeContent from "./stepThree/stepThreeContent";

import { Link, Redirect, useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import { constructQouteObject } from "../../api/utils/constructRequestObject";
import styles from "../../styles/cart/cartView.module.scss";
import { payment_methods } from "../../constants/payment-methods";
import { getValueFromCookie, removeCookie } from "../../utils/cookies";
import { getCall, postCall } from "../../api/axios";
import useCancellablePromise from "../../api/cancelRequest";
import { SSE_TIMEOUT } from "../../constants/sse-waiting-time";
import { ToastContext } from "../../context/toastContext";
import { toast_actions, toast_types } from "../shared/toast/utils/toast";
import Loading from "../shared/loading/loading";

const m = {
  quote: {
    provider: {
      id: "P1",
      locations: [
        {
          id: "L1",
        },
      ],
    },
    items: [
      {
        fulfillment_id: "F1",
        id: "I1",
      },
    ],
    fulfillments: [
      {
        id: "F1",
        type: "Delivery",
        "@ondc/org/provider_name": "LSP or Provider Name",
        tracking: false,
        "@ondc/org/category": "Immediate Delivery",
        "@ondc/org/TAT": "PT60M",
        state: {
          descriptor: {
            code: "Serviceable",
          },
        },
      },
    ],
    quote: {
      price: {
        currency: "INR",
        value: "245",
      },
      breakup: [
        {
          "@ondc/org/item_id": "I1",
          "@ondc/org/item_quantity": {
            count: 1,
          },
          title: "Atta",
          "@ondc/org/title_type": "item",
          price: {
            currency: "INR",
            value: "170.00",
          },
          item: {
            quantity: {
              available: {
                count: "99",
              },
              maximum: {
                count: "99",
              },
            },
            price: {
              currency: "INR",
              value: "170.00",
            },
          },
        },
        {
          "@ondc/org/item_id": "F1",
          title: "Delivery charges",
          "@ondc/org/title_type": "delivery",
          price: {
            currency: "INR",
            value: "50.00",
          },
        },
        {
          "@ondc/org/item_id": "F1",
          title: "Discount",
          "@ondc/org/title_type": "discount_f",
          price: {
            currency: "INR",
            value: "-50.00",
          },
        },
        {
          "@ondc/org/item_id": "F1",
          title: "Tax",
          "@ondc/org/title_type": "tax_f",
          price: {
            currency: "INR",
            value: "9.00",
          },
        },
        {
          "@ondc/org/item_id": "F1",
          title: "Packing charges",
          "@ondc/org/title_type": "packing",
          price: {
            currency: "INR",
            value: "25.00",
          },
        },
        {
          "@ondc/org/item_id": "I1",
          title: "Tax",
          "@ondc/org/title_type": "tax",
          price: {
            currency: "INR",
            value: "0.00",
          },
        },
        {
          "@ondc/org/item_id": "I1",
          title: "Discount",
          "@ondc/org/title_type": "discount",
          price: {
            currency: "INR",
            value: "-10.00",
          },
        },
        {
          "@ondc/org/item_id": "F1",
          title: "Convenience Fee",
          "@ondc/org/title_type": "misc",
          price: {
            currency: "INR",
            value: "10.00",
          },
        },
      ],
      ttl: "P1D",
    },
  },
};

const m2 = {
  quote: {
    provider: {
      id: "P1",
      locations: [
        {
          id: "L1",
        },
      ],
    },
    items: [
      {
        id: "I1",
        fulfillment_id: "F1",
        parent_item_id: "DI1",
        tags: [
          {
            code: "type",
            list: [
              {
                code: "type",
                value: "item",
              },
            ],
          },
        ],
      },
      {
        id: "C1",
        fulfillment_id: "F1",
        parent_item_id: "DI1",
        tags: [
          {
            code: "type",
            list: [
              {
                code: "type",
                value: "customization",
              },
            ],
          },
          {
            code: "parent",
            list: [
              {
                code: "id",
                value: "CG1",
              },
            ],
          },
        ],
      },
      {
        id: "C7",
        fulfillment_id: "F1",
        parent_item_id: "DI1",
        tags: [
          {
            code: "type",
            list: [
              {
                code: "type",
                value: "customization",
              },
            ],
          },
          {
            code: "parent",
            list: [
              {
                code: "id",
                value: "CG2",
              },
            ],
          },
        ],
      },
      {
        id: "C14",
        fulfillment_id: "F1",
        parent_item_id: "DI1",
        tags: [
          {
            code: "type",
            list: [
              {
                code: "type",
                value: "customization",
              },
            ],
          },
          {
            code: "parent",
            list: [
              {
                code: "id",
                value: "CG3",
              },
            ],
          },
        ],
      },
      {
        id: "C16",
        fulfillment_id: "F1",
        parent_item_id: "DI1",
        tags: [
          {
            code: "type",
            list: [
              {
                code: "type",
                value: "customization",
              },
            ],
          },
          {
            code: "parent",
            list: [
              {
                code: "id",
                value: "CG3",
              },
            ],
          },
        ],
      },
      {
        id: "I1",
        fulfillment_id: "F1",
        parent_item_id: "DI2",
        tags: [
          {
            code: "type",
            list: [
              {
                code: "type",
                value: "item",
              },
            ],
          },
        ],
      },
      {
        id: "C2",
        fulfillment_id: "F1",
        parent_item_id: "DI2",
        tags: [
          {
            code: "type",
            list: [
              {
                code: "type",
                value: "customization",
              },
            ],
          },
          {
            code: "parent",
            list: [
              {
                code: "id",
                value: "CG1",
              },
            ],
          },
        ],
      },
      {
        id: "C7",
        fulfillment_id: "F1",
        parent_item_id: "DI2",
        tags: [
          {
            code: "type",
            list: [
              {
                code: "type",
                value: "customization",
              },
            ],
          },
          {
            code: "parent",
            list: [
              {
                code: "id",
                value: "CG2",
              },
            ],
          },
        ],
      },
      {
        id: "C14",
        fulfillment_id: "F1",
        parent_item_id: "DI2",
        tags: [
          {
            code: "type",
            list: [
              {
                code: "type",
                value: "customization",
              },
            ],
          },
          {
            code: "parent",
            list: [
              {
                code: "id",
                value: "CG3",
              },
            ],
          },
        ],
      },
      {
        id: "C15",
        fulfillment_id: "F1",
        parent_item_id: "DI2",
        tags: [
          {
            code: "type",
            list: [
              {
                code: "type",
                value: "customization",
              },
            ],
          },
          {
            code: "parent",
            list: [
              {
                code: "id",
                value: "CG3",
              },
            ],
          },
        ],
      },
    ],
    fulfillments: [
      {
        id: "F1",
        "@ondc/org/provider_name": "LSP or Provider Name",
        tracking: false,
        "@ondc/org/category": "Immediate Delivery",
        "@ondc/org/TAT": "PT60M",
        state: {
          descriptor: {
            code: "Serviceable",
          },
        },
      },
    ],
    quote: {
      price: {
        currency: "INR",
        value: "1946.65",
      },
      breakup: [
        {
          "@ondc/org/item_id": "I1",
          "@ondc/org/item_quantity": {
            count: 1,
          },
          title: "Farm House Pizza",
          "@ondc/org/title_type": "item",
          price: {
            currency: "INR",
            value: "269.00",
          },
          item: {
            parent_item_id: "DI1",
            quantity: {
              available: {
                count: "99",
              },
              maximum: {
                count: "99",
              },
            },
            price: {
              currency: "INR",
              value: "269.00",
            },
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "item",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "C1",
          "@ondc/org/item_quantity": {
            count: 1,
          },
          title: "New Hand Tossed",
          "@ondc/org/title_type": "item",
          price: {
            currency: "INR",
            value: "0.00",
          },
          item: {
            parent_item_id: "DI1",
            quantity: {
              available: {
                count: "99",
              },
              maximum: {
                count: "99",
              },
            },
            price: {
              currency: "INR",
              value: "0.00",
            },
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "customization",
                  },
                ],
              },
              {
                code: "parent",
                list: [
                  {
                    code: "id",
                    value: "CG1",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "C7",
          "@ondc/org/item_quantity": {
            count: 1,
          },
          title: "Large",
          "@ondc/org/title_type": "item",
          price: {
            currency: "INR",
            value: "450.00",
          },
          item: {
            parent_item_id: "DI1",
            quantity: {
              available: {
                count: "99",
              },
              maximum: {
                count: "99",
              },
            },
            price: {
              currency: "INR",
              value: "450.00",
            },
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "customization",
                  },
                ],
              },
              {
                code: "parent",
                list: [
                  {
                    code: "id",
                    value: "CG2",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "C14",
          "@ondc/org/item_quantity": {
            count: 1,
          },
          title: "Grilled Mushrooms",
          "@ondc/org/title_type": "item",
          price: {
            currency: "INR",
            value: "80.00",
          },
          item: {
            parent_item_id: "DI1",
            quantity: {
              available: {
                count: "99",
              },
              maximum: {
                count: "99",
              },
            },
            price: {
              currency: "INR",
              value: "80.00",
            },
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "customization",
                  },
                ],
              },
              {
                code: "parent",
                list: [
                  {
                    code: "id",
                    value: "CG3",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "C16",
          "@ondc/org/item_quantity": {
            count: 1,
          },
          title: "Pepper Barbeque Chicken",
          "@ondc/org/title_type": "item",
          price: {
            currency: "INR",
            value: "95.00",
          },
          item: {
            parent_item_id: "DI1",
            quantity: {
              available: {
                count: "99",
              },
              maximum: {
                count: "99",
              },
            },
            price: {
              currency: "INR",
              value: "95.00",
            },
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "customization",
                  },
                ],
              },
              {
                code: "parent",
                list: [
                  {
                    code: "id",
                    value: "CG3",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "I1",
          "@ondc/org/item_quantity": {
            count: 1,
          },
          title: "Farm House Pizza",
          "@ondc/org/title_type": "item",
          price: {
            currency: "INR",
            value: "269.00",
          },
          item: {
            parent_item_id: "DI2",
            quantity: {
              available: {
                count: "99",
              },
              maximum: {
                count: "99",
              },
            },
            price: {
              currency: "INR",
              value: "269.00",
            },
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "item",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "C2",
          "@ondc/org/item_quantity": {
            count: 1,
          },
          title: "100% Wheat Thin Crust",
          "@ondc/org/title_type": "item",
          price: {
            currency: "INR",
            value: "0.00",
          },
          item: {
            parent_item_id: "DI2",
            quantity: {
              available: {
                count: "99",
              },
              maximum: {
                count: "99",
              },
            },
            price: {
              currency: "INR",
              value: "0.00",
            },
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "customization",
                  },
                ],
              },
              {
                code: "parent",
                list: [
                  {
                    code: "id",
                    value: "CG1",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "C7",
          "@ondc/org/item_quantity": {
            count: 1,
          },
          title: "Large",
          "@ondc/org/title_type": "item",
          price: {
            currency: "INR",
            value: "450.00",
          },
          item: {
            parent_item_id: "DI2",
            quantity: {
              available: {
                count: "99",
              },
              maximum: {
                count: "99",
              },
            },
            price: {
              currency: "INR",
              value: "450.00",
            },
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "customization",
                  },
                ],
              },
              {
                code: "parent",
                list: [
                  {
                    code: "id",
                    value: "CG2",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "C14",
          "@ondc/org/item_quantity": {
            count: 1,
          },
          title: "Grilled Mushrooms",
          "@ondc/org/title_type": "item",
          price: {
            currency: "INR",
            value: "80.00",
          },
          item: {
            parent_item_id: "DI2",
            quantity: {
              available: {
                count: "99",
              },
              maximum: {
                count: "99",
              },
            },
            price: {
              currency: "INR",
              value: "80.00",
            },
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "customization",
                  },
                ],
              },
              {
                code: "parent",
                list: [
                  {
                    code: "id",
                    value: "CG3",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "C15",
          "@ondc/org/item_quantity": {
            count: 1,
          },
          title: "Fresh Tomato",
          "@ondc/org/title_type": "item",
          price: {
            currency: "INR",
            value: "80.00",
          },
          item: {
            parent_item_id: "DI2",
            quantity: {
              available: {
                count: "99",
              },
              maximum: {
                count: "99",
              },
            },
            price: {
              currency: "INR",
              value: "80.00",
            },
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "customization",
                  },
                ],
              },
              {
                code: "parent",
                list: [
                  {
                    code: "id",
                    value: "CG3",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "I1",
          title: "Tax",
          "@ondc/org/title_type": "tax",
          price: {
            currency: "INR",
            value: "13.45",
          },
          item: {
            parent_item_id: "DI1",
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "item",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "C1",
          title: "Tax",
          "@ondc/org/title_type": "tax",
          price: {
            currency: "INR",
            value: "0.00",
          },
          item: {
            parent_item_id: "DI1",
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "customization",
                  },
                ],
              },
              {
                code: "parent",
                list: [
                  {
                    code: "id",
                    value: "CG1",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "C7",
          title: "Tax",
          "@ondc/org/title_type": "tax",
          price: {
            currency: "INR",
            value: "22.50",
          },
          item: {
            parent_item_id: "DI1",
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "customization",
                  },
                ],
              },
              {
                code: "parent",
                list: [
                  {
                    code: "id",
                    value: "CG2",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "C14",
          title: "Tax",
          "@ondc/org/title_type": "tax",
          price: {
            currency: "INR",
            value: "4.00",
          },
          item: {
            parent_item_id: "DI1",
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "customization",
                  },
                ],
              },
              {
                code: "parent",
                list: [
                  {
                    code: "id",
                    value: "CG3",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "C16",
          title: "Tax",
          "@ondc/org/title_type": "tax",
          price: {
            currency: "INR",
            value: "4.75",
          },
          item: {
            parent_item_id: "DI1",
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "customization",
                  },
                ],
              },
              {
                code: "parent",
                list: [
                  {
                    code: "id",
                    value: "CG1",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "I1",
          title: "Tax",
          "@ondc/org/title_type": "tax",
          price: {
            currency: "INR",
            value: "13.45",
          },
          item: {
            parent_item_id: "DI2",
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "item",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "C2",
          title: "Tax",
          "@ondc/org/title_type": "tax",
          price: {
            currency: "INR",
            value: "22.50",
          },
          item: {
            parent_item_id: "DI2",
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "customization",
                  },
                ],
              },
              {
                code: "parent",
                list: [
                  {
                    code: "id",
                    value: "CG1",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "C7",
          title: "Tax",
          "@ondc/org/title_type": "tax",
          price: {
            currency: "INR",
            value: "22.50",
          },
          item: {
            parent_item_id: "DI2",
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "customization",
                  },
                ],
              },
              {
                code: "parent",
                list: [
                  {
                    code: "id",
                    value: "CG2",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "C14",
          title: "Tax",
          "@ondc/org/title_type": "tax",
          price: {
            currency: "INR",
            value: "4.00",
          },
          item: {
            parent_item_id: "DI2",
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "customization",
                  },
                ],
              },
              {
                code: "parent",
                list: [
                  {
                    code: "id",
                    value: "CG3",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "C15",
          title: "Tax",
          "@ondc/org/title_type": "tax",
          price: {
            currency: "INR",
            value: "4.00",
          },
          item: {
            parent_item_id: "DI2",
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "customization",
                  },
                ],
              },
              {
                code: "parent",
                list: [
                  {
                    code: "id",
                    value: "CG3",
                  },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": "F1",
          title: "Delivery charges",
          "@ondc/org/title_type": "delivery",
          price: {
            currency: "INR",
            value: "50.00",
          },
        },
        {
          "@ondc/org/item_id": "F1",
          title: "Packing charges",
          "@ondc/org/title_type": "packing",
          price: {
            currency: "INR",
            value: "25.00",
          },
        },
        {
          "@ondc/org/item_id": "F1",
          title: "Convenience Fee",
          "@ondc/org/title_type": "misc",
          price: {
            currency: "INR",
            value: "10.00",
          },
        },
      ],
      ttl: "PT1H",
    },
  },
};

const Checkout = () => {
  const classes = useStyles();
  const history = useHistory();

  const steps = ["Customer", "Add Address", "Payment"];
  const [activeStep, setActiveStep] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [updatedCartItems, setUpdatedCartItems] = useState([]);
  const [productsQuote, setProductsQuote] = useState({
    providers: [],
    total_payable: 0,
  });
  const [initLoading, setInitLoading] = useState(false);

  const [activePaymentMethod, setActivePaymentMethod] = useState(
    payment_methods.COD
  );
  const [confirmOrderLoading, setConfirmOrderLoading] = useState(false);
  const responseRef = useRef([]);
  const eventTimeOutRef = useRef([]);
  const [eventData, setEventData] = useState([]);
  const dispatch = useContext(ToastContext);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  useEffect(() => {
    const cartItemsData = JSON.parse(localStorage.getItem("cartItems"));
    const updatedCartItemsData = JSON.parse(
      localStorage.getItem("updatedCartItems")
    );
    setCartItems(cartItemsData);
    setUpdatedCartItems(updatedCartItemsData);
  }, []);

  useEffect(() => {
    if (updatedCartItems.length > 0) {
      // fetch request object length and compare it with the response length
      let c = cartItems.map((item) => {
        return item.item;
      });
      const requestObject = constructQouteObject(c);
      if (requestObject.length === updatedCartItems.length) {
        // setToggleInit(true);
      }

      const cartList = JSON.parse(JSON.stringify(updatedCartItems));
      // check if any one order contains error
      let total_payable = 0;
      const quotes = updatedCartItems?.map((item, index) => {
        let { message, error } = item;
        let provider_payable = 0;
        const provider = {
          products: [],
          total_payable: 0,
          name: "",
          error: null,
        };
        // else generate quote of it
        if (message) {
          //message = m2;

          if (message?.quote?.quote?.price?.value) {
            provider_payable += Number(message?.quote?.quote?.price?.value);
          }
          const breakup = message?.quote?.quote?.breakup;
          const provided_by = message?.quote?.provider?.descriptor?.name;
          provider.name = provided_by;
          let uuid = 0;
          const all_items = breakup?.map((break_up_item) => {
            const cartIndex = cartList.findIndex(
              (one) => one.id === break_up_item["@ondc/org/item_id"]
            );
            const cartItem = cartIndex > -1 ? cartList[cartIndex] : null;
            let cartQuantity = cartItem ? cartItem?.quantity?.count : 0;
            let quantity = break_up_item["@ondc/org/item_quantity"]
              ? break_up_item["@ondc/org/item_quantity"]["count"]
              : 0;
            let textClass = "";
            let quantityMessage = "";
            if (quantity === 0) {
              if (break_up_item["@ondc/org/title_type"] === "item") {
                textClass = "text-error";
                quantityMessage = "Out of stock";

                if (cartIndex > -1) {
                  cartList.splice(cartIndex, 1);
                }
              }
            } else if (quantity !== cartQuantity) {
              textClass =
                break_up_item["@ondc/org/title_type"] === "item"
                  ? "text-amber"
                  : "";
              quantityMessage = `Quantity: ${quantity}/${cartQuantity}`;
              if (cartItem) {
                cartItem.quantity.count = quantity;
              }
            } else {
              quantityMessage = `Quantity: ${quantity}`;
            }

            if (error && error.code === "30009") {
              cartList.splice(cartIndex, 1);
            }
            uuid = uuid + 1;
            return {
              id: break_up_item["@ondc/org/item_id"],
              title: break_up_item?.title,
              title_type: break_up_item["@ondc/org/title_type"],
              isCustomization: isItemCustomization(break_up_item?.item?.tags),
              isDelivery: break_up_item["@ondc/org/title_type"] === "delivery",
              parent_item_id: break_up_item?.item?.parent_item_id,
              price: Number(break_up_item.price?.value)?.toFixed(2),
              cartQuantity,
              quantity,
              provided_by,
              textClass,
              quantityMessage,
              uuid: uuid,
            };
          });

          let items = {};
          let delivery = {};
          all_items.forEach((item) => {
            // for type item
            if (item.title_type === "item" && !item.isCustomization) {
              let key = item.parent_item_id || item.id;
              let price = {
                title: item.quantity + " * Base Price",
                value: item.price,
              };
              items[key] = { title: item.title, price: price };
            }
            if (item.title_type === "tax" && !item.isCustomization) {
              let key = item.parent_item_id || item.id;
              items[key] = items[key] || {};
              items[key]["tax"] = {
                title: item.title,
                value: item.price,
              };
            }
            if (item.title_type === "discount" && !item.isCustomization) {
              let key = item.parent_item_id || item.id;
              items[key] = items[key] || {};
              items[key]["discount"] = {
                title: item.title,
                value: item.price,
              };
            }

            //for customizations
            if (item.title_type === "item" && item.isCustomization) {
              let key = item.parent_item_id;
              items[key]["customizations"] = items[key]["customizations"] || {};
              items[key]["customizations"][item.id] = {
                title: item.title,
                price: {
                  title: item.quantity + " * Base Price",
                  value: item.price,
                },
              };
            }
            if (item.title_type === "tax" && item.isCustomization) {
              let key = item.parent_item_id;
              items[key]["customizations"][item.id] =
                items[key]["customizations"][item.id] || {};
              items[key]["customizations"][item.id]["tax"] = {
                title: item.title,
                value: item.price,
              };
            }
            if (item.title_type === "discount" && item.isCustomization) {
              let key = item.parent_item_id;
              items[key]["customizations"][item.id] =
                items[key]["customizations"][item.id] || {};
              items[key]["customizations"][item.id]["discount"] = {
                title: item.title,
                value: item.price,
              };
            }
            //for delivery
            if (item.title_type === "delivery") {
              delivery["delivery"] = {
                title: item.title,
                value: item.price,
              };
            }
            if (item.title_type === "discount_f") {
              delivery["discount"] = {
                title: item.title,
                value: item.price,
              };
            }
            if (item.title_type === "tax_f") {
              delivery["tax"] = {
                title: item.title,
                value: item.price,
              };
            }
            if (item.title_type === "packing") {
              delivery["packing"] = {
                title: item.title,
                value: item.price,
              };
            }
            if (item.title_type === "discount") {
              if (item.isCustomization) {
                let id = item.parent_item_id;
              } else {
                let id = item.id;
                items[id]["discount"] = {
                  title: item.title,
                  value: item.price,
                };
              }
            }
            if (item.title_type === "misc") {
              delivery["misc"] = {
                title: item.title,
                value: item.price,
              };
            }
          });
          provider.items = items;
          provider.delivery = delivery;
        }

        if (error) {
          provider.error = error.message;
        }

        total_payable += provider_payable;
        provider.total_payable = provider_payable;
        return provider;
      });
      // setGetQuoteLoading(false);
      // setUpdateCartLoading(false);
      setProductsQuote({
        providers: quotes,
        total_payable: total_payable.toFixed(2),
      });
    }
  }, [updatedCartItems]);

  const isItemCustomization = (tags) => {
    let isCustomization = false;
    tags?.forEach((tag) => {
      if (tag.code === "type") {
        tag.list.forEach((listOption) => {
          if (
            listOption.code === "type" &&
            listOption.value == "customization"
          ) {
            isCustomization = true;
            return true;
          }
        });
      }
    });
    return isCustomization;
  };

  const renderStepLabel = (stepLabel, stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <StepOneLabel activeStep={activeStep} />;
      case 1:
        return (
          <StepTwoLabel
            activeStep={activeStep}
            onUpdateActiveStep={() => {
              setActiveStep(1);
            }}
          />
        );
      case 2:
        return <StepThreeLabel />;
      default:
        return <>stepLabel</>;
    }
  };
  const renderStepContent = (stepLabel, stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <StepOneContent
            handleNext={() => {
              setActiveStep(1);
            }}
          />
        );
      case 1:
        return (
          <StepTwoContent
            cartItemsData={cartItems}
            updatedCartItemsData={updatedCartItems}
            setUpdateCartItemsData={(data) => {
              setUpdatedCartItems(data);
            }}
            setUpdateCartItemsDataOnInitialize={(data) => {
              setUpdatedCartItems(data);
            }}
            handleNext={() => {
              setActiveStep(2);
            }}
            updateInitLoading={(value) => setInitLoading(value)}
            responseReceivedIds={updatedCartItems.map((item) => {
              const { message } = item;
              return message?.quote?.provider?.id.toString();
            })}
          />
        );
      case 2:
        return (
          <StepThreeContent
            responseReceivedIds={updatedCartItems.map((item) => {
              const { message } = item;
              return message?.quote?.provider?.id.toString();
            })}
            activePaymentMethod={activePaymentMethod}
            setActivePaymentMethod={(value) => {
              setActivePaymentMethod(value);
            }}
            cartItemsData={cartItems}
            updatedCartItemsData={updatedCartItems}
            updateInitLoading={(value) => setInitLoading(value)}
            setUpdateCartItemsDataOnInitialize={(data) => {
              setUpdatedCartItems(data);
            }}
          />
        );
      default:
        return <>stepLabel</>;
    }
  };

  useEffect(() => {
    if (responseRef.current.length > 0) {
      setConfirmOrderLoading(false);
      // fetch request object length and compare it with the response length
      const { productQuotes, successOrderIds } = JSON.parse(
        // getValueFromCookie("checkout_details") || "{}"
        localStorage.getItem("checkout_details") || "{}"
      );
      let c = cartItems.map((item) => {
        return item.item;
      });
      const requestObject = constructQouteObject(
        c.filter(({ provider }) =>
          successOrderIds.includes(provider.local_id.toString())
        )
      );
      if (responseRef.current.length === requestObject.length) {
        // redirect to order listing page.
        // remove parent_order_id, search_context from cookies
        removeCookie("transaction_id");
        removeCookie("parent_order_id");
        removeCookie("search_context");
        removeCookie("delivery_address");
        removeCookie("billing_address");
        // removeCookie("checkout_details");
        localStorage.removeItem("checkout_details");
        removeCookie("parent_and_transaction_id_map");
        removeCookie("LatLongInfo");
        setCartItems([]);
        history.replace("/application/orders");
      }
    }
    // eslint-disable-next-line
  }, [eventData]);

  // function to dispatch error
  function dispatchError(message) {
    dispatch({
      type: toast_actions.ADD_TOAST,
      payload: {
        id: Math.floor(Math.random() * 100),
        type: toast_types.error,
        message,
      },
    });
  }

  // on confirm order Api
  const onConfirmOrder = async (message_id) => {
    try {
      const data = await cancellablePromise(
        getCall(`clientApis/v2/on_confirm_order?messageIds=${message_id}`)
      );
      responseRef.current = [...responseRef.current, data[0]];
      setEventData((eventData) => [...eventData, data[0]]);
    } catch (err) {
      dispatchError(err?.response?.data?.error?.message);
      setConfirmOrderLoading(false);
    }
    // eslint-disable-next-line
  };

  // use this function to confirm the order
  function onConfirm(message_id) {
    eventTimeOutRef.current = [];
    const token = getValueFromCookie("token");
    let header = {
      headers: {
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
    };
    message_id.forEach((id) => {
      let es = new window.EventSourcePolyfill(
        `${process.env.REACT_APP_BASE_URL}clientApis/events/v2?messageId=${id}`,
        header
      );
      es.addEventListener("on_confirm", (e) => {
        const { messageId } = JSON.parse(e.data);
        onConfirmOrder(messageId);
      });
      const timer = setTimeout(() => {
        eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
          eventSource.close();
          clearTimeout(timer);
        });
        // check if all the orders got cancled
        if (responseRef.current.length <= 0) {
          setConfirmOrderLoading(false);
          dispatchError(
            "Cannot fetch details for this product Please try again!"
          );
          return;
        }
      }, SSE_TIMEOUT);

      eventTimeOutRef.current = [
        ...eventTimeOutRef.current,
        {
          eventSource: es,
          timer,
        },
      ];
    });
  }
  const getItemProviderId = (item) => {
    const providers = getValueFromCookie("providerIds").split(",");
    let provider = {};
    if (providers.includes(item.provider.local_id)) {
      provider = {
        id: item.provider.local_id,
        locations: item.provider.locations.map((location) => location.local_id),
      };
    } else {
    }

    return provider;
  };
  const confirmOrder = async (items, method) => {
    responseRef.current = [];
    const parentOrderIDMap = new Map(
      JSON.parse(getValueFromCookie("parent_and_transaction_id_map"))
    );
    const { productQuotes: productQuotesForCheckout } = JSON.parse(
      // getValueFromCookie("checkout_details") || "{}"
      localStorage.getItem("checkout_details") || "{}"
    );
    try {
      const search_context = JSON.parse(getValueFromCookie("search_context"));
      const queryParams = items.map((item, index) => {
        return {
          // pass the map of parent order id and transaction id
          context: {
            domain: item.domain,
            city: search_context.location.name,
            state: search_context.location.state,
            parent_order_id: parentOrderIDMap.get(item?.provider?.id)
              .parent_order_id,
            transaction_id: parentOrderIDMap.get(item?.provider?.id)
              .transaction_id,
          },
          message: {
            payment: {
              paid_amount: Number(productQuotesForCheckout[0]?.price?.value),
              type:
                method === payment_methods.COD ? "ON-FULFILLMENT" : "ON-ORDER",
              transaction_id: parentOrderIDMap.get(item?.provider?.id)
                .transaction_id,
              paymentGatewayEnabled: false, //TODO: we send false for, if we enabled jusPay the we will handle.
            },
            quote: {
              ...productQuotesForCheckout[0],
              price: {
                currency: productQuotesForCheckout[0].price.currency,
                value: String(productQuotesForCheckout[0].price.value),
              },
            },
            providers: getItemProviderId(item),
          },
        };
      });

      const data = await cancellablePromise(
        postCall("clientApis/v2/confirm_order", queryParams)
      );
      //Error handling workflow eg, NACK
      const isNACK = data.find(
        (item) => item.error && item.message.ack.status === "NACK"
      );
      if (isNACK) {
        dispatchError(isNACK.error.message);
        setConfirmOrderLoading(false);
      } else {
        onConfirm(
          data?.map((txn) => {
            const { context } = txn;
            return context?.message_id;
          })
        );
      }
    } catch (err) {
      dispatchError(err?.response?.data?.error?.message);
      setConfirmOrderLoading(false);
    }
    // eslint-disable-next-line
  };

  const renderDeliveryLine = (quote, key) => {
    return (
      <div
        className={classes.summaryItemContainer}
        key={`d-quote-${key}-price`}
      >
        <Typography variant="body1" className={classes.summaryDeliveryLabel}>
          {quote?.title}
        </Typography>
        <Typography variant="body1" className={classes.summaryItemPriceValue}>
          {`₹${quote?.value}`}
        </Typography>
      </div>
    );
  };

  const renderDeliveryCharges = (data) => {
    return (
      <div>
        {data.delivery && renderDeliveryLine(data.delivery, "delivery")}
        {data.discount && renderDeliveryLine(data.discount, "discount")}
        {data.tax && renderDeliveryLine(data.tax, "tax")}
        {data.packing && renderDeliveryLine(data.packing, "packing")}
        {data.misc && renderDeliveryLine(data.misc, "misc")}
      </div>
    );
  };

  const renderItemDetails = (quote, qIndex, isCustomization) => {
    return (
      <div>
        <div
          className={classes.summaryItemContainer}
          key={`quote-${qIndex}-price`}
        >
          <Typography
            variant="body1"
            className={
              isCustomization
                ? classes.summaryCustomizationPriceLabel
                : classes.summaryItemPriceLabel
            }
          >
            {quote?.price?.title}
          </Typography>
          <Typography
            variant="body1"
            className={
              isCustomization
                ? classes.summaryCustomizationPriceValue
                : classes.summaryItemPriceValue
            }
          >
            {`₹${quote?.price?.value}`}
          </Typography>
        </div>
        {quote?.tax && (
          <div
            className={classes.summaryItemContainer}
            key={`quote-${qIndex}-tax`}
          >
            <Typography
              variant="body1"
              className={
                isCustomization
                  ? classes.summaryCustomizationTaxLabel
                  : classes.summaryItemTaxLabel
              }
            >
              {quote?.tax.title}
            </Typography>
            <Typography
              variant="body1"
              className={
                isCustomization
                  ? classes.summaryCustomizationPriceValue
                  : classes.summaryItemPriceValue
              }
            >
              {`₹${quote?.tax.value}`}
            </Typography>
          </div>
        )}
        {quote?.discount && (
          <div
            className={classes.summaryItemContainer}
            key={`quote-${qIndex}-discount`}
          >
            <Typography
              variant="body1"
              className={
                isCustomization
                  ? classes.summaryCustomizationDiscountLabel
                  : classes.summaryItemDiscountLabel
              }
            >
              {quote?.discount.title}
            </Typography>
            <Typography
              variant="body1"
              className={classes.summaryItemPriceValue}
            >
              {`₹${quote?.discount.value}`}
            </Typography>
          </div>
        )}
      </div>
    );
  };

  const renderItems = (provider, pindex) => {
    return (
      <div key={`pindex-${pindex}`}>
        {Object.values(provider.items)
          .filter((quote) => quote?.title !== "")
          .map((quote, qIndex) => (
            <div key={`quote-${qIndex}`}>
              <div
                className={classes.summaryItemContainer}
                key={`quote-${qIndex}-title`}
              >
                <Typography
                  variant="body1"
                  className={classes.summaryItemLabel}
                >
                  {quote?.title}
                </Typography>
              </div>
              {renderItemDetails(quote)}
              {quote?.customizations && (
                <div key={`quote-${qIndex}-customizations`}>
                  <div
                    className={classes.summaryItemContainer}
                    key={`quote-${qIndex}-customizations`}
                  >
                    <Typography
                      variant="body1"
                      className={classes.summaryItemPriceLabel}
                    >
                      Customizations
                    </Typography>
                  </div>
                  {Object.values(quote?.customizations).map(
                    (customization, cIndex) => (
                      <div>
                        <div
                          className={classes.summaryItemContainer}
                          key={`quote-${qIndex}-customizations-${cIndex}`}
                        >
                          <Typography
                            variant="body1"
                            className={classes.summaryCustomizationLabel}
                          >
                            {customization.title}
                          </Typography>
                        </div>
                        {renderItemDetails(customization, cIndex, true)}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        {provider.error && (
          <Typography
            variant="body1"
            color="error"
            className={classes.summaryItemLabel}
          >
            {provider.error}
          </Typography>
        )}
      </div>
    );
  };

  if (cartItems === null || updatedCartItems === null) {
    return <Redirect to={"/application/cart"} />;
  }
  return (
    <>
      <div className={classes.header}>
        <Typography
          component={Link}
          underline="hover"
          color="primary.main"
          variant="body1"
          className={classes.headerTypo}
          to={`/application`}
        >
          BACK TO SHOP
        </Typography>
      </div>
      <div className={classes.bodyContainer}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
            <Stepper
              activeStep={activeStep}
              orientation="vertical"
              connector={false}
            >
              {steps.map((step, index) => (
                <Step key={step.label} className={classes.stepRoot}>
                  <StepLabel className={classes.stepLabel}>
                    {renderStepLabel(step, index)}
                  </StepLabel>
                  <StepContent
                    className={
                      activeStep === index
                        ? classes.stepContent
                        : classes.stepContentHidden
                    }
                  >
                    {renderStepContent(step, index)}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <Card className={classes.summaryCard}>
              <Typography variant="h4">Summary</Typography>
              <Box component={"div"} className={classes.divider} />
              {productsQuote?.providers.map((provider, pindex) =>
                renderItems(provider, pindex)
              )}
              <Box component={"div"} className={classes.divider} />
              {productsQuote?.providers.map((provider, pindex) => (
                <div key={`d-pindex-${pindex}`}>
                  {renderDeliveryCharges(provider.delivery)}
                </div>
              ))}
              <Box component={"div"} className={classes.orderTotalDivider} />
              <div className={classes.summaryItemContainer}>
                <Typography variant="body" className={classes.totalLabel}>
                  Order Total
                </Typography>
                <Typography variant="body" className={classes.totalValue}>
                  {`₹${productsQuote?.total_payable}`}
                </Typography>
              </div>
              <Button
                className={classes.proceedToBuy}
                fullWidth
                variant="contained"
                disabled={
                  confirmOrderLoading || initLoading || activeStep !== 2
                }
                onClick={() => {
                  const { productQuotes, successOrderIds } = JSON.parse(
                    // getValueFromCookie("checkout_details") || "{}"
                    localStorage.getItem("checkout_details") || "{}"
                  );
                  setConfirmOrderLoading(true);
                  let c = cartItems.map((item) => {
                    return item.item;
                  });
                  if (activePaymentMethod === payment_methods.JUSPAY) {
                    // setTogglePaymentGateway(true);
                    // setLoadingSdkForPayment(true);
                    // initiateSDK();
                    const request_object = constructQouteObject(
                      c.filter(({ provider }) =>
                        successOrderIds.includes(provider.local_id.toString())
                      )
                    );
                    confirmOrder(request_object[0], payment_methods.JUSPAY);
                  } else {
                    const request_object = constructQouteObject(
                      c.filter(({ provider }) =>
                        successOrderIds.includes(provider.local_id.toString())
                      )
                    );
                    confirmOrder(request_object[0], payment_methods.COD);
                  }
                }}
              >
                {confirmOrderLoading ? <Loading /> : "Proceed to Buy"}
              </Button>
            </Card>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Checkout;
