import React, { useEffect, useState } from "react";
import useStyles from "./style";

import Typography from "@mui/material/Typography";

import { ReactComponent as PlusIcon } from "../../../../assets/images/plus.svg";
import { ReactComponent as MinusIcon } from "../../../../assets/images/minus.svg";
import { useHistory } from "react-router-dom";

const MenuModal = ({ customMenu }) => {
  const classes = useStyles();
  const history = useHistory();

  const [activeMenu, setActiveMenu] = useState("");

  useEffect(() => {}, [customMenu]);

  return (
    <div className={classes.customMenuModalContainer}>
      {customMenu.map((menu, menuIndex) => {
        const { id, descriptor, items } = menu;
        return (
          <div key={`menu-index-${menuIndex}`}>
            <Typography
              component="div"
              variant="body"
              className={`${classes.dialogMenuName} ${activeMenu === id ? classes.isActiveMenu : ""}`}
              onClick={() => {
                if (activeMenu === id) {
                  setActiveMenu("");
                } else {
                  setActiveMenu(id);
                }
              }}
            >
              {descriptor.name}
              {activeMenu === id ? (
                <MinusIcon className={classes.plusIcon} />
              ) : (
                <PlusIcon className={classes.plusIcon} />
              )}
              <span className={`${classes.itemsCount} ${activeMenu === id ? classes.isActiveMenu : ""}`}>
                {items.length}
              </span>
            </Typography>
            {activeMenu === id && (
              <>
                {items.length > 0 ? (
                  <>
                    {items.map((item, itemInd) => (
                      <Typography
                        key={`menu-item-index-${itemInd}`}
                        variant="body1"
                        className={classes.dialogMenuItemName}
                        onClick={() => {
                          history.push(`/application/products?productId=${item.id}`);
                        }}
                      >
                        {item?.item_details?.descriptor?.name}
                      </Typography>
                    ))}
                  </>
                ) : (
                  <Typography variant="body1">No items available</Typography>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MenuModal;
