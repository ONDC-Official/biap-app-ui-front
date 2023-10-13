import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { AddressContextProvider } from "../../context/addressContext";
import { CartContextProvider } from "../../context/cartContext";
import { SearchContextProvider } from "../../context/searchContext";
import PrivateRoute from "../../privateRoutes";
import Cart from "./cart/cart";
// import Checkout from "./checkout/checkout";
// import Orders from "./orders/orders";
// import ProductList from "./product-list/productList";
// import Home from "../home/home";
// import Profile from "./profile/profile";
// import Support from "./support/support";
import ProductDetails from "./product-list/product-details/productDetails";
import Brand from "../brand/brand";
import OutletDetails from "../brand/outletDetails/outletDetails";
import Checkout from "../checkout/checkout";
import Orders from "../orders/orders";
import OrderDetails from "../orders/orderDetails/orderDetails";
// import InitializeOrder from "./initialize-order/initializeOrder";
// import MyTickets from "./my-tickets/myTickets";

import AppLayout from "../appLayout";
import Products from "../products/products";
import BrandRoutes from "../brand/BrandRoutes";

export default function Application() {
  return (
    <CartContextProvider>
      <Switch>
        <AddressContextProvider>
          <SearchContextProvider>
            <Route path={"/application"} exact component={() => <Redirect to={"/application/products"} />} />
            <PrivateRoute exact path={"/application/products"}>
              <AppLayout>
                <Products />
              </AppLayout>
            </PrivateRoute>

            <PrivateRoute path={"/application/products/:id"}>
              <AppLayout>
                <ProductDetails />
              </AppLayout>
            </PrivateRoute>
            <PrivateRoute path={"/application/cart"}>
              <AppLayout>
                <Cart />
              </AppLayout>
            </PrivateRoute>
            {/* <PrivateRoute exact path={"/application/brand/:brandId"}>
              <AppLayout>
                <Brand />
              </AppLayout>
            </PrivateRoute>
            <PrivateRoute exact path={"/application/brand/:brandId/:outletId"}>
              <AppLayout>
                <OutletDetails />
              </AppLayout>
            </PrivateRoute>
             */}
            <PrivateRoute path={"/application/brand"}>
              <AppLayout>
                <BrandRoutes />
              </AppLayout>
            </PrivateRoute>
            <PrivateRoute exact path={"/application/checkout"}>
              <AppLayout isCheckout={true}>
                <Checkout />
              </AppLayout>
            </PrivateRoute>
            <PrivateRoute path={"/application/orders"}>
              <AppLayout>
                <Orders />
              </AppLayout>
            </PrivateRoute>
            <PrivateRoute path={"/application/order/:orderId"}>
              <AppLayout>
                <OrderDetails />
              </AppLayout>
            </PrivateRoute>

            {/*<PrivateRoute path={"/application/orders"}>*/}
            {/*  <Orders />*/}
            {/*</PrivateRoute>*/}
            {/*<PrivateRoute path={"/application/tickets"}>*/}
            {/*  <MyTickets />*/}
            {/*</PrivateRoute>*/}
            {/*<PrivateRoute path={"/application/profile"}>*/}
            {/*  <Profile />*/}
            {/*</PrivateRoute>*/}
            {/*<PrivateRoute path={"/application/support"}>*/}
            {/*  <Support />*/}
            {/*</PrivateRoute>*/}
            {/*<PrivateRoute path={"/application/initialize"}>*/}
            {/*  <InitializeOrder />*/}
            {/*</PrivateRoute>*/}
            {/*<PrivateRoute path={"/application/checkout"}>*/}
            {/*  <Checkout />*/}
            {/*</PrivateRoute>*/}
          </SearchContextProvider>
        </AddressContextProvider>
      </Switch>
    </CartContextProvider>
  );
}
