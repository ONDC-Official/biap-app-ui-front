import React from "react";
import styles from "../../../styles/auth/auth.module.scss";
import logo from "../../../assets/images/logo.png";
import authIllustration from "../../../assets/images/login_illustration.png";

export default function AuthActionCard(props) {
  const { action_form, navigation_link } = props;
  return (
    <div className="container-fluid p-2 h-100">
      <div className="row h-100">
        <div className="col-md-4 h-100">
          <div className={styles.auth_card_background}>
            <div
              style={{ height: "20%" }}
              className="d-flex align-items-center justify-content-center"
            >
              <img src={logo} alt="logo" style={{ height: "50px" }} />
            </div>
            <div style={{ height: "70%" }}>{action_form}</div>
            <div
              style={{ height: "10%" }}
              className="d-flex align-items-center justify-content-center"
            >
              {navigation_link}
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="h-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
              <div className="py-2">
                <img
                  src={authIllustration}
                  alt="illustration"
                  style={{ height: "150px" }}
                />
              </div>
              <div className="py-2">
                <p className={styles.illustration_header}>Welcome to ONDC</p>
                <p className={styles.illustration_body}>
                  A global marketplace to discover and buy anything you need
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
