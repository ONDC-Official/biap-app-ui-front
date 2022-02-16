import React from "react";
import styles from "../../../styles/auth/auth.module.scss";

export default function AuthActionCard(props) {
  return (
    <div className="container-fluid p-2 h-100">
      <div className="row h-100">
        <div className="col-md-4 h-100">
          <div className={styles.auth_card_background}>{props.children}</div>
        </div>
        <div className="col-md-8"></div>
      </div>
    </div>
  );
}
