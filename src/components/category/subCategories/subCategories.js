import React, {useContext, useEffect, useState} from 'react';
import useStyles from './style';
import {useHistory, useLocation, useParams} from "react-router-dom";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import {PRODUCT_SUBCATEGORY} from "../../../constants/categories";
import Tooltip from "@mui/material/Tooltip";
import Card from "@mui/material/Card";
import no_image_found from "../../../assets/images/no_image_found.png";

import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import IconButton from '@mui/material/IconButton';
import {ReactComponent as PreviousIcon} from '../../../assets/images/previous.svg';
import {ReactComponent as NextIcon} from '../../../assets/images/next.svg';
import {SearchContext} from "../../../context/searchContext";

const SubCaregoryCard = ({data, onMouseOver, isActive = false}) => {
    const classes = useStyles();
    const history = useHistory();
    const locationData = useLocation();
    const useQuery = () => {
        const { search } = locationData;
        return React.useMemo(() => new URLSearchParams(search), [search]);
    };
    let query = useQuery();
    const categoryName = query.get("c");
    const updateQueryParams = () => {
        const params = new URLSearchParams({});
        if(locationData.search === "" && query.get("c") === null){
            params.set("sc", data.value);
            history.push({ pathname: `/application/products`, search: params.toString() })
        }else{
            params.set("c", categoryName);
            params.set("sc", data.value);
            history.push({ pathname: `/application/products`, search: params.toString() })
        }
    };
    return (
        <>
            <Tooltip title={data.value}>
                <Card className={`${classes.subCatCard} ${isActive?classes.isActive:""}`} onMouseOver={onMouseOver} onClick={() => updateQueryParams()}>
                    <img className={classes.subCatImage} src={data.imageUrl ? data.imageUrl : no_image_found} alt={`sub-cat-img-${data.value}`}/>
                </Card>
                <Typography component="div" variant="subtitle1" className={classes.subCatNameTypo}>
                    {data?.value || ""}
                </Typography>
            </Tooltip>
        </>
    )
};

const SubCategories = () => {
    // let { categoryName } = useParams();
    const classes = useStyles();
    const [activeSubCatIndex, setActiveSubCatIndex] = useState(0);
    const [subCatList, setSubCatList] = useState([]);
    const locationData = useLocation();
    const [page, setPage] = useState(0);
    const { locationData: deliveryAddressLocation } = useContext(SearchContext);

    const useQuery = () => {
        const { search } = locationData;
        return React.useMemo(() => new URLSearchParams(search), [search]);
    };
    let query = useQuery();
    const categoryName = query.get("c");

    useEffect(() => {
        if(categoryName){
            const options = PRODUCT_SUBCATEGORY[categoryName];
            setSubCatList(options || []);
        }
    }, [categoryName, deliveryAddressLocation]);

    return (
        <Grid container spacing={3} className={classes.subCatContainerMain}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="h4">
                    Shop By Category
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.subCatContainer}>
                <Pagination
                    count={subCatList.length}
                    page={page}
                    className={classes.categoriesContainer}
                    boundaryCount={4}
                    onChange={(event, page) => {
                        setPage(page);
                    }}
                    renderItem={(item) => {
                        console.log("item.type=====>", item.type)
                        if(item.type === "page"){
                            const subCatIndex = item.page - 1;
                            const subCat = subCatList[subCatIndex];
                            return (
                                <SubCaregoryCard
                                    data={subCat}
                                    isActive={subCatIndex === activeSubCatIndex}
                                    onMouseOver={() => {
                                        setPage(subCatIndex+1);
                                        setActiveSubCatIndex(subCatIndex);
                                    }}
                                />
                            )
                        }else if(item.type === "next"){
                            return (
                                <IconButton
                                    color="inherit" className={classes.actionButton}
                                    onClick={() => {
                                        setPage(item.page+1)
                                        setActiveSubCatIndex(activeSubCatIndex+1)
                                    }}
                                    disabled={subCatList.length === item.page}
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
                                                setActiveSubCatIndex(activeSubCatIndex-1)
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
            </Grid>
        </Grid>
    )

};

export default SubCategories;