import React, {useState} from 'react';
import useStyles from './style';
import {Link, useLocation, useParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';

import ProductGridView from "../../product/productList/productGridView";
import ProductListView from "../../product/productList/productListView";
import MultiSelctFilter from "../../common/Filters/MultiSelctFilter";
import useCancellablePromise from "../../../api/cancelRequest";

const Products = () => {
    const classes = useStyles();
    const params = useParams();

    const [viewType, setViewType] = useState("grid");
    const [products, setProducts] = useState([]);
    const [totalProductCount, setTotalProductCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        page: 1,
        pageSize: 10,
        searchData: []
    });

    // HOOKS
    const { cancellablePromise } = useCancellablePromise();

    const handleChangeFilter = (filterIndex, value) => {
        const data = Object.assign({}, JSON.parse(JSON.stringify(paginationModel)));
        data.searchData[filterIndex].selectedValues = value;
        data.page = 0;
        data.pageSize = 10;
        setPaginationModel(data);
    };

    return (
        <Grid container spacing={3} className={classes.productContainer}>
            Products
        </Grid>
    )

};

export default Products;