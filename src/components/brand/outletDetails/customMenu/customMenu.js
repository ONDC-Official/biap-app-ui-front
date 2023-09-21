import React, { Fragment, useRef, useEffect, useState } from "react";
import useStyles from "./style";
import { useParams, useHistory } from "react-router-dom";

import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";

import ModalComponent from "../../../common/Modal";
import MenuModal from "./menuModal";

import { getBrandCustomMenuRequest, getCustomMenuItemsRequest } from "../../../../api/brand.api";
import useCancellablePromise from "../../../../api/cancelRequest";
import { ReactComponent as MenuIcon } from "../../../../assets/images/menu.svg";

import MenuItems from "./menuItems";
import Loading from "../../../shared/loading/loading";

const CustomMenu = ({ brandDetails, outletDetails }) => {
  const classes = useStyles();
  const { brandId } = useParams();
  const customMenuRef = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [menuModal, setMenuModal] = useState(false);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  const getBrandCustomMenu = async (domain) => {
    setIsLoading(true);
    try {
      const data = await cancellablePromise(getBrandCustomMenuRequest(domain, brandId));
      let resData = Object.assign([], JSON.parse(JSON.stringify(data.data)));
      resData = resData.map((singleCustomMenu) => {
        singleCustomMenu.items = [];
        return singleCustomMenu;
      });
      customMenuRef.current = resData;
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (brandDetails) {
      getBrandCustomMenu(brandDetails.domain);
    }
  }, [brandDetails]);

  const updateItemsOfCustomMenuRef = (customMenuId, items) => {
    let data = Object.assign([], JSON.parse(JSON.stringify(customMenuRef.current)));
    const findIndexFromId = data.findIndex((item) => item.id === customMenuId);
    if (findIndexFromId > -1) {
      data[findIndexFromId].items = items;
    } else {
    }
    customMenuRef.current = data;
  };

  return (
    <div>
      {isLoading ? (
        <div className={classes.progressBarContainer}>
          <Loading />
        </div>
      ) : (
        <>
          {customMenuRef.current.length > 0 ? (
            <>
              <div className={classes.menuButtonContainer}>
                <Fab
                  variant="extended"
                  color="primary"
                  className={classes.menuFloatingButton}
                  onClick={() => setMenuModal(true)}
                >
                  <MenuIcon className={classes.menuIcon} sx={{ mr: 1 }} />
                  Menu
                </Fab>
                <ModalComponent
                  open={menuModal}
                  onClose={() => {
                    setMenuModal(false);
                  }}
                  title="Our Menu"
                >
                  <MenuModal customMenu={customMenuRef.current} />
                </ModalComponent>
              </div>

              {customMenuRef.current.map((menu, ind) => (
                <MenuItems
                  key={`custom-menu-ind-${ind}`}
                  customMenu={menu}
                  updateItemsOfCustomMenuRef={updateItemsOfCustomMenuRef}
                />
              ))}
            </>
          ) : (
            <Typography variant="body1">Menu not available</Typography>
          )}
        </>
      )}
    </div>
  );
};

export default CustomMenu;
