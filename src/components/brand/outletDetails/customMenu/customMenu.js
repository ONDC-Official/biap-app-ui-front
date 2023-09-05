import React, {Fragment, useEffect, useState} from 'react';
import useStyles from './style';
import {useParams} from "react-router-dom";

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import {ReactComponent as ExpandMoreIcon} from '../../../../assets/images/chevron-down.svg';
import MenuItem from './menuItem';
import ModalComponent from "../../../common/Modal";
import MenuModal from './menuModal';

import {getBrandCustomMenuRequest, getCustomMenuItemsRequest} from "../../../../api/brand.api";
import useCancellablePromise from "../../../../api/cancelRequest";
import {ReactComponent as MenuIcon} from '../../../../assets/images/menu.svg';

const customMenuList = [
    {id: '1', name: 'Kings Burgers', items: [
        {id: '1', name: 'Crispy Veg Burger+Fries(M)', price: 499, description: 'Save Rs. 261 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: true},
        {id: '2', name: 'Crispy Veg Burger+Fries(M)', price: 599, description: 'Save Rs. 321 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: true},
        {id: '3', name: 'Crispy Veg Burger+Fries(M)', price: 249, description: 'Save Rs. 61 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: true},
        {id: '4', name: 'Crispy Veg Burger+Fries(M)', price: 349, description: 'Save Rs. 169 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: false},
        {id: '5', name: 'Crispy Veg Burger+Fries(M)', price: 799, description: 'Save Rs. 311 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: true},
    ]},
    {id: '2', name: 'Burger Doubles', items: [
        {id: '11', name: 'Crispy Veg Burger+Fries(M)', price: 899, description: 'Save Rs. 201 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: true},
        {id: '12', name: 'Crispy Veg Burger+Fries(M)', price: 999, description: 'Save Rs. 101 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: true},
    ]},
    {id: '3', name: 'New BK DUOS', items: [
        {id: '21', name: 'Crispy Veg Burger+Fries(M)', price: 110, description: 'Save Rs. 32 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: true},
        {id: '22', name: 'Crispy Veg Burger+Fries(M)', price: 222, description: 'Save Rs. 64 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: true},
        {id: '23', name: 'Crispy Veg Burger+Fries(M)', price: 420, description: 'Save Rs. 111 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: false},
    ]},
]
const CustomMenu = ({brandDetails, outletDetails}) => {
    const classes = useStyles();
    const {brandId, outletId} = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [customMenu, setCustomMenu] = useState(false);
    const [menuModal, setMenuModal] = useState(false);

    // HOOKS
    const { cancellablePromise } = useCancellablePromise();

    const getCustomMenuItems = async(menuName) => {
        setIsLoading(true);
        try {
            const data = await cancellablePromise(
                getCustomMenuItemsRequest(menuName)
            );
            // setCustomMenu(data.data);
            let resData = Object.assign([], JSON.parse(JSON.stringify(data.data)));
            resData = resData.map((item) => {
                const findVegNonvegTag = item.item_details.tags.find((tag) => tag.code === "veg_nonveg");
                if(findVegNonvegTag){
                    item.item_details.isVeg = findVegNonvegTag.list[0].value === "yes"?true:false;
                }else{}
                return item;
            })
            return resData
        } catch (err) {
            return err;
        } finally {
            setIsLoading(false);
        }
    };

    const getBrandCustomMenu = async(domain) => {
        setIsLoading(true);
        try {
            const data = await cancellablePromise(
                getBrandCustomMenuRequest(domain, brandId)
            );
            let resData = Object.assign([], JSON.parse(JSON.stringify(data.data)));
            resData = await Promise.all(resData.map(async (singleCustomMenu) => {
                singleCustomMenu.items = await getCustomMenuItems(singleCustomMenu.id);
                return singleCustomMenu;
            }));
            setCustomMenu(resData);
        } catch (err) {
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(brandDetails){
            getBrandCustomMenu(brandDetails.domain);
        }
    }, [brandDetails]);

    return (
        <div>
            {
                isLoading
                ?(
                    <div className={classes.progressBarContainer}>
                        <CircularProgress />
                    </div>
                ):(
                    <>
                        {
                            customMenu.length > 0
                                ? (
                                    <>
                                        {
                                            customMenu.map((menu, ind) => (
                                                <Accordion
                                                    key={`custom-menu-ind-${ind}`}
                                                    // square={true}
                                                    defaultExpanded={true}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon className={classes.expandIcon}/>}
                                                        aria-controls="panel1a-content"
                                                        id="panel1a-header"
                                                    >
                                                        <Typography variant="h5">{`${menu?.descriptor?.name} (${menu?.items?.length || 0})`}</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        {
                                                            menu.items.length > 0
                                                                ? (
                                                                    <Grid
                                                                        container spacing={3}
                                                                    >
                                                                        {
                                                                            menu.items.map((item, itemInd) => (
                                                                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={`menu-item-ind-${itemInd}`}>
                                                                                    <MenuItem
                                                                                        product={item?.item_details}
                                                                                        productId={item.id}
                                                                                        price={item?.item_details?.price}
                                                                                        bpp_provider_descriptor={
                                                                                            item?.provider_details?.descriptor
                                                                                        }
                                                                                        bpp_id={item?.bpp_details?.bpp_id}
                                                                                        location_id={
                                                                                            item?.location_details
                                                                                                ? item.location_details?.id
                                                                                                : ""
                                                                                        }
                                                                                        bpp_provider_id={item?.provider_details?.id}
                                                                                    />
                                                                                </Grid>
                                                                            ))
                                                                        }
                                                                    </Grid>
                                                                ) : (
                                                                    <Typography variant="body1">
                                                                        There is not items available in this menu
                                                                    </Typography>
                                                                )
                                                        }
                                                    </AccordionDetails>
                                                </Accordion>
                                            ))
                                        }
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
                                                <MenuModal
                                                    customMenu={customMenu}
                                                />
                                            </ModalComponent>
                                        </div>
                                    </>
                                ) : (
                                    <Typography variant="body1">
                                        Menu not available
                                    </Typography>
                                )
                        }
                    </>
                )
            }
        </div>
    );

};

export default CustomMenu;