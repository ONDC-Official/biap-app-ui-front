import React from "react";
import styles from "./navbar.module.scss";
import logo from "../../../assets/images/logo.png";
import Dropdown from "../dropdown/dropdown";
import Logout from "../svg/logout";
import Orders from "../svg/orders";
import User from "../svg/user";
import Cart from "../svg/cart";
import { useHistory } from "react-router-dom";
import ProductList from "../svg/productList";
import { deleteAllCookies } from "../../../utils/deleteCookies";
import { getValueFromCookie } from "../../../utils/cookies";

export default function Navbar() {
  const user = JSON.parse(getValueFromCookie("user"));
  const history = useHistory();
  const dropdown_links = {
    PRODUCTS: "Products",
    CART: "Cart",
    ORDERS: "Orders",
    PROFILE: "Profile",
    LOGOUT: "Logout",
  };
  const more_options_dropdown_options = [
    {
      img: <ProductList />,
      value: dropdown_links.PRODUCTS,
    },
    {
      img: <Cart />,
      value: dropdown_links.CART,
    },
    {
      img: <Orders width="17" />,
      value: dropdown_links.ORDERS,
    },
    {
      img: <User width="15" />,
      value: dropdown_links.PROFILE,
    },
    {
      img: <Logout width="15" />,
      value: dropdown_links.LOGOUT,
    },
  ];

  async function handleLogout() {
    deleteAllCookies();
    history.replace("/");
  }

  const avatar = (
    <div className={styles.avatar_back}>
      <img
        src={user?.photoURL}
        alt="user_avatar"
        className={styles.avatar_image}
      />
    </div>
  );

  return (
    <div className={`${styles.navbar_back}`}>
      <div className="container h-100">
        <div className="d-flex align-items-center h-100">
          <img
            src={logo}
            alt="logo"
            style={{ height: "40px", cursor: "pointer" }}
            onClick={() => history.push("/application")}
          />
          <div className="ms-auto">
            <Dropdown
              header={avatar}
              body_classes="dropdown-menu-right"
              click={(value) => {
                if (value === dropdown_links.PRODUCTS) {
                  return history.push("/application/");
                }
                if (value === dropdown_links.CART) {
                  return history.push("/application/cart");
                }
                if (value === dropdown_links.ORDERS) {
                  return history.push("/application/orders");
                }
                if (value === dropdown_links.PROFILE) {
                  return history.push("/application/profile");
                }
                if (value === dropdown_links.LOGOUT) {
                  return handleLogout();
                }
              }}
              options={more_options_dropdown_options}
              show_icons={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
