import React from "react";
import Styles from "./dropdown.module.scss";

function Dropdown({
  id,
  header,
  body,
  body_classes,
  options,
  click,
  show_icons = false,
  style = {},
}) {
  return (
    <div className="dropdown">
      <div
        id={id}
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {header}
      </div>
      <div
        className={`dropdown-menu ${body_classes}`}
        style={{
          borderRadius: "8px",
          padding: "15px 0",
          border: 0,
          zIndex: 1,
          margin: "10px 0",
          boxShadow: "0 3px 10px 0 rgba(47, 47, 47, 0.2)",
          ...style,
        }}
        aria-labelledby={id}
      >
        {body}
        {options.map((option) => {
          return (
            <div
              key={option.value}
              className={`${Styles.dropdown_link_wrapper}`}
              onClick={() => {
                click(option.value);
              }}
            >
              {show_icons && (
                <div
                  className={`${Styles.img_wrapper} d-flex align-items-center justify-content-center`}
                >
                  {
                    <option.img.type
                      {...option.img.props}
                      classes={Styles.svgClass}
                    />
                  }
                </div>
              )}
              <div>
                <p className={`mb-0 ${Styles.dropdown_link}`}>{option.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dropdown;
