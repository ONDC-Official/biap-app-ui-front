import React, { Component } from "react";
import Button from "../button/button";
import { buttonTypes } from "../button/utils";
import styles from "./errorBoundary.module.scss";
import errorBoundary from "../../../assets/images/errorBoundary.svg";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          className={`d-flex justify-content-center align-items-center ${styles.background}`}
        >
          <div style={{ width: "400px" }} className="text-center">
            <div className="py-4">
              <img
                src={errorBoundary}
                alt="something_went_wrong"
                style={{ height: "170px" }}
              />
            </div>
            <h4 className="py-2">Something went wrong</h4>
            <p className="py-2">
              The page you are looking for might have been removed, renamed or
              temporarily unavailable.
            </p>
            <div className="py-2">
              <Button
                button_type={buttonTypes.primary}
                button_hover_type={buttonTypes.primary_hover}
                button_text="Go To Home"
                onClick={() => (window.location.pathname = "/application")}
              />
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
