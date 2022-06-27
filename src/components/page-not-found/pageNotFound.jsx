import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Button from "../shared/button/button";
import { buttonTypes } from "../shared/button/utils";
import NotFoundIllustration from "../../assets/images/404NotFound.svg";

export default function PageNotFound() {
  const history = useHistory();
  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <div style={{ width: "400px" }} className="text-center">
        <div className="py-4">
          <img
            src={NotFoundIllustration}
            alt="404_not_found"
            style={{ height: "170px" }}
          />
        </div>
        <h4 className="py-2">404 Not Found</h4>
        <p className="py-2">
          The page you are looking for does not exist! <br /> Return to home
          page
        </p>
        <div className="py-2">
          <Button
            button_type={buttonTypes.primary}
            button_hover_type={buttonTypes.primary_hover}
            button_text="Go To Home"
            onClick={() => history.replace("/application")}
          />
        </div>
      </div>
    </div>
  );
}
