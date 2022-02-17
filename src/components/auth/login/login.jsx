import React, { useState } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import styles from "../../../styles/auth/auth.module.scss";
import { buttonTypes } from "../../../utils/button";
import Button from "../../shared/button/button";
import AuthActionCard from "../auth-action-card/authActionCard";
import { useHistory } from "react-router-dom";
import Input from "../../shared/input/input";
import ErrorMessage from "../../shared/error-message/errorMessage";
import Toast from "../../shared/toast/toast";
import { toast_types } from "../../../utils/toast";

export default function Login() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const history = useHistory();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    toggle: false,
    type: "",
    message: "",
  });
  const [inlineError, setInlineError] = useState({
    email_error: "",
    password_error: "",
  });
  // use this function to check the email
  function checkEmail() {
    if (!email) {
      setInlineError((inlineError) => ({
        ...inlineError,
        email_error: "email cannot be empty",
      }));
      return false;
    }
    return true;
  }

  function checkPassword() {
    if (!password) {
      setInlineError((inlineError) => ({
        ...inlineError,
        password_error: "password cannot be empty",
      }));
      return false;
    }

    return true;
  }

  function handleLoginWithEmailAndPassword() {
    const allCheckPassed = [checkEmail(), checkPassword()].every(Boolean);
    if (!allCheckPassed) {
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        handleRedirect(result.user);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setToast((toast) => ({
          ...toast,
          toggle: true,
          type: toast_types.error,
          message: errorMessage,
        }));
        setLoading(false);
      });
  }
  function handleLoginWithGoogle() {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        handleRedirect(result.user);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setToast((toast) => ({
          ...toast,
          toggle: true,
          type: toast_types.error,
          message: errorMessage,
        }));
        setLoading(false);
      });
  }
  function handleRedirect(user) {
    const { displayName, email, photoURL, accessToken } = user;
    localStorage.setItem(
      "user",
      JSON.stringify({ name: displayName, email, photoURL })
    );
    localStorage.setItem("token", accessToken);
    setLoading(false);
    history.push("/application");
  }
  return (
    <AuthActionCard>
      {toast.toggle && (
        <Toast
          type={toast.type}
          message={toast.message}
          onRemove={() =>
            setToast((toast) => ({
              ...toast,
              toggle: false,
            }))
          }
        />
      )}
      <div className={styles.auth_form}>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter Email"
          label_name="Email"
          autoComplete="off"
          has_error={inlineError.email_error}
          onChange={(event) => {
            setEmail(event.target.value);
            setInlineError((inlineError) => ({
              ...inlineError,
              email_error: "",
            }));
          }}
        />
        {inlineError.email_error && (
          <ErrorMessage>{inlineError.email_error}</ErrorMessage>
        )}
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter Password"
          label_name="Password"
          autoComplete="off"
          has_error={inlineError.password_error}
          onChange={(event) => {
            setPassword(event.target.value);
            setInlineError((inlineError) => ({
              ...inlineError,
              password_error: "",
            }));
          }}
        />
        {inlineError.password_error && (
          <ErrorMessage>{inlineError.password_error}</ErrorMessage>
        )}
        <div className="py-3 text-center">
          <Button
            button_type={buttonTypes.primary}
            button_hover_type={buttonTypes.primary_hover}
            button_text="Login"
            onClick={handleLoginWithEmailAndPassword}
          />
        </div>
        <hr style={{ margin: "5px 0", border: "1px solid #ddd" }} />
        <div className="py-3 text-center">
          <Button
            button_type={buttonTypes.primary}
            button_hover_type={buttonTypes.primary_hover}
            button_text="Login with google"
            onClick={handleLoginWithGoogle}
          />
        </div>
      </div>
    </AuthActionCard>
  );
}
