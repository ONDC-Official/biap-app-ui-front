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
import default_user_avatar from "../../../assets/images/user.svg";
import supportSvg from "../../../assets/images/help.svg";

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
        src={user?.photoURL ?? default_user_avatar}
        alt="user_avatar"
        className={styles.avatar_image}
        onError={(event) => {
          event.target.onerror = null;
          event.target.src = default_user_avatar;
        }}
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
          <div className="ms-auto px-3">
            <div
              className={styles.avatar_back}
              onClick={() => history.push("/application/support")}
            >
              <img
                src={supportSvg}
                alt="support"
                className={styles.avatar_image}
              />
            </div>
          </div>
          <div className="px-2">
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
