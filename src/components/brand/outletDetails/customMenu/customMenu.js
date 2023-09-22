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
  const [firstMenuItemId, setFirstMenuItemId] = useState("");
  const [firstMenuItemDetails, setFirstMenuItemDetails] = useState(null);
  const [blockingCallLoading, setBlockingCallLoading] = useState(false);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  const getBrandCustomMenu = async (domain) => {
    setBlockingCallLoading(true);
    try {
      const data = await cancellablePromise(getBrandCustomMenuRequest(domain, brandId));
      let resData = Object.assign([], JSON.parse(JSON.stringify(data.data)));
      setFirstMenuItemId(resData[0].id);
      resData = resData.map((singleCustomMenu) => {
        singleCustomMenu.items = [];
        return singleCustomMenu;
      });
      customMenuRef.current = resData;
      const firstMenuData = await getCustomMenuItems(resData[0].id);
    } catch (err) {
      setBlockingCallLoading(false);
    }
  };

  const getCustomMenuItems = async (menuId) => {
    try {
      const data = await cancellablePromise(getCustomMenuItemsRequest(menuId));
      let resData = Object.assign([], JSON.parse(JSON.stringify(data.data)));

      resData = resData.map((item) => {
        const findVegNonVegTag = item.item_details.tags.find((tag) => tag.code === "veg_nonveg");
        if (findVegNonVegTag) {
          item.item_details.isVeg =
            findVegNonVegTag.list[0].value === "yes" || findVegNonVegTag.list[0].value === "Yes";
        } else {
        }
        return item;
      });
      updateItemsOfCustomMenuRef(menuId, resData);
      setFirstMenuItemDetails(resData);
      setBlockingCallLoading(false);
      console.log(menuId, resData);
    } catch (err) {
      return err;
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
      {blockingCallLoading ? (
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

              <MenuItems
                firstMenuItemId={firstMenuItemId}
                key={`custom-menu-ind`}
                customMenu={customMenuRef.current[0]}
                updateItemsOfCustomMenuRef={updateItemsOfCustomMenuRef}
                setBlockingCallLoading={setBlockingCallLoading}
                firstMenuItemDetails={firstMenuItemDetails}
              />

              {customMenuRef.current.slice(1, customMenuRef.current.length).map((menu, ind) => (
                <MenuItems
                  firstMenuItemId={firstMenuItemId}
                  key={`custom-menu-ind-${ind}`}
                  customMenu={menu}
                  updateItemsOfCustomMenuRef={updateItemsOfCustomMenuRef}
                  setBlockingCallLoading={setBlockingCallLoading}
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
