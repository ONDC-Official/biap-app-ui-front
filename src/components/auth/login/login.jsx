import React from "react";
import { buttonTypes } from "../../../utils/button";
import Button from "../../shared/button/button";
import AuthActionCard from "../auth-action-card/authActionCard";

export default function Login() {
  return (
    <AuthActionCard>
      <div className="py-2">
        <input type="text" />
      </div>
      <div className="py-2">
        <input type="text" />
      </div>
      <div className="py-2">
        <Button
          button_type={buttonTypes.primary}
          button_hover_type={buttonTypes.primary_hover}
          button_text="Login"
        />
      </div>
    </AuthActionCard>
  );
}
