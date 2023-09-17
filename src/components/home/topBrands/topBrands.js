import React, {useContext, useEffect, useState} from 'react';
import useStyles from './style';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

import {useHistory} from "react-router-dom";
import {getAllBrandsRequest} from "../../../api/brand.api";
import useCancellablePromise from "../../../api/cancelRequest";
import no_image_found from "../../../assets/images/no_image_found.png";
import {ToastContext} from "../../../context/toastContext";
import {toast_actions, toast_types} from "../../shared/toast/utils/toast";

import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import IconButton from '@mui/material/IconButton';
import {ReactComponent as PreviousIcon} from '../../../assets/images/previous.svg';
import {ReactComponent as NextIcon} from '../../../assets/images/next.svg';

import Loading from "../../shared/loading/loading";

const BrandCard = ({data, index, onMouseOver}) => {
    const classes = useStyles();
    const history = useHistory();
    const { id, descriptor } = data;
    const { name: brand_name,images } = descriptor;
    return (
        <>
            <Tooltip title={brand_name}>
                <Card className={classes.brandCard} onMouseOver={onMouseOver} onClick={() => (
                    history.push(`/application/brand/${id}`)
                )}>
                    <img className={classes.brandImage} src={images?.length > 0 ? images[0] : no_image_found} alt={`brand-${index}`}/>
                </Card>
            </Tooltip>
        </>
    )
};

const TopBrands = () => {
    const classes = useStyles();
    const [activeBrandIndex, setActiveBrandIndex] = useState(1);
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);

    const dispatch = useContext(ToastContext);

    // HOOKS
    const { cancellablePromise } = useCancellablePromise();

    const getAllBrands = async(searchName) => {
        setIsLoading(true);
        try {
            const data = await cancellablePromise(
                getAllBrandsRequest()
            );
            console.log("getAllBrandsRequest=====>", data)
            setBrands(data.data);
        } catch (err) {
            dispatch({
                type: toast_actions.ADD_TOAST,
                payload: {
                    id: Math.floor(Math.random() * 100),
                    type: toast_types.error,
                    message: err?.response?.data?.error?.message,
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllBrands();
    }, []);
    return (
        <Grid container spacing={3} className={classes.topBrandsContainer}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="h4">
                    All Providers
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.brandsContainer}>
                {
                    isLoading
                    ?<Loading />
                    :(
                        <>
                            <Pagination
                                count={brands.length}
                                page={page}
                                className={classes.categoriesContainer}
                                boundaryCount={4}
                                onChange={(event, page) => {
                                    setPage(page);
                                }}
                                renderItem={(item) => {
                                    if(item.type === "page"){
                                        const brandIndex = item.page - 1;
                                        const brand = brands[brandIndex];
                                        return (
                                            <BrandCard
                                                data={brand}
                                                index={brandIndex}
                                                isActive={brandIndex === activeBrandIndex}
                                                onMouseOver={() => {
                                                    setPage(brandIndex+1);
                                                    setActiveBrandIndex(brandIndex);
                                                }}
                                            />
                                        )
                                    }else if(item.type === "next"){
                                        return (
                                            <IconButton
                                                color="inherit" className={classes.actionButton}
                                                onClick={() => {
                                                    setPage(item.page+1)
                                                    setActiveBrandIndex(activeBrandIndex+1)
                                                }}
                                                disabled={brands.length === item.page}
                                            >
                                                <NextIcon />
                                            </IconButton>
                                        )
                                    }else if(item.type === "previous"){
                                        return (
                                            <div className={classes.previousIconContainer}>
                                                <div style={{margin: 'auto'}}>
                                                    <IconButton
                                                        color="inherit" className={classes.actionButton}
                                                        onClick={() => {
                                                            setPage(item.page-1)
                                                            setActiveBrandIndex(activeBrandIndex-1)
                                                        }}
                                                        disabled={item.page === -1}
                                                    >
                                                        <PreviousIcon />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        )
                                    }else{
                                        return (
                                            <PaginationItem
                                                {...item}
                                            />
                                        )
                                    }
                                }}
                            />
                        </>
                    )
                }
            </Grid>
        </Grid>
    )

};
export default TopBrands;