import React, {useState, useRef} from 'react';
import useStyles from './style';
import {useParams, Link} from "react-router-dom";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import Button from '@mui/material/Button';


import ProductGridView from "./productGridView";
import ProductListView from "./productListView";
import MultiSelctFilter from "../../common/Filters/MultiSelctFilter";

import product1 from '../../../assets/images/product/product1.png';
import product2 from '../../../assets/images/product/product2.png';
import product3 from '../../../assets/images/product/product3.png';
import product4 from '../../../assets/images/product/product4.png';
import product5 from '../../../assets/images/product/product5.png';
import product6 from '../../../assets/images/product/product6.png';
import product7 from '../../../assets/images/product/product7.png';
import product8 from '../../../assets/images/product/product8.png';

import {ReactComponent as ListViewIcon} from '../../../assets/images/listView.svg';
import {ReactComponent as GridViewIcon} from '../../../assets/images/gridView.svg';

const Products = [
    {id: 1, name: 'Embroidered Handloom Cotton Silk Saree (Black)', price: '2999', provider: 'CHHABRA 555 Sarees', imgUrl: product1},
    {id: 2, name: 'Embroidered Handloom Cotton Silk Saree (Black)', price: '2999', provider: 'CHHABRA 555 Sarees', imgUrl: product2},
    {id: 3, name: 'Embroidered Handloom Cotton Silk Saree (Black)', price: '2999', provider: 'CHHABRA 555 Sarees', imgUrl: product3},
    {id: 4, name: 'Embroidered Handloom Cotton Silk Saree (Black)', price: '2999', provider: 'CHHABRA 555 Sarees', imgUrl: product4},
    {id: 5, name: 'Embroidered Handloom Cotton Silk Saree (Black)', price: '2999', provider: 'CHHABRA 555 Sarees', imgUrl: product5},
    {id: 6, name: 'Embroidered Handloom Cotton Silk Saree (Black)', price: '2999', provider: 'CHHABRA 555 Sarees', imgUrl: product6},
    {id: 7, name: 'Embroidered Handloom Cotton Silk Saree (Black)', price: '2999', provider: 'CHHABRA 555 Sarees', imgUrl: product7},
    {id: 8, name: 'Embroidered Handloom Cotton Silk Saree (Black)', price: '2999', provider: 'CHHABRA 555 Sarees', imgUrl: product8},
];

const SAREETYPES = [
    {id: 1, name: 'Type 1', label: 'Type 1'},
    {id: 2, name: 'Type 2', label: 'Type 2'},
    {id: 3, name: 'Type 3', label: 'Type 3'},
    {id: 4, name: 'Type 4', label: 'Type 4'},
    {id: 5, name: 'Type 5', label: 'Type 5'},
]
const ProductList = () => {
    const classes = useStyles();
    let { categoryName, subCategoryName } = useParams();
    const [viewType, setViewType] = useState("grid");
    const defaultSearchData = useRef({
        sareeType: [],
        brand: []
    });
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
        searchData: Object.assign({}, defaultSearchData.current)
    });

    const handleClick = (event) => {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
    };

    const handleChangeFilter = (elementName, value) => {
        const data = Object.assign({}, JSON.parse(JSON.stringify(paginationModel)));
        if(elementName === "dateRange"){
            data.searchData.fromDate = value?.startDate || "";
            data.searchData.toDate = value?.endDate || "";
        }else{
            data.searchData[elementName] = value;
        }
        data.page = 0;
        data.pageSize = 10;
        setPaginationModel(data);
    };

    return (
        <Grid container spacing={3} className={classes.productContainer}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div role="presentation" onClick={handleClick}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <MuiLink component={Link} underline="hover" color="inherit" to="/">
                            Home
                        </MuiLink>
                        <MuiLink
                            component={Link}
                            underline="hover"
                            color="inherit"
                            to={`/category/${categoryName}`}
                        >
                            {categoryName}
                        </MuiLink>
                        <Typography color="text.primary">{subCategoryName}</Typography>
                    </Breadcrumbs>
                </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.catNameTypoContainer}>
                <Typography variant="h4" className={classes.catNameTypo}>
                    Women’s Sarees
                </Typography>
                <Button
                    className={classes.viewTypeButton}
                    variant={viewType === "grid"?"contained":"outlined"}
                    color={viewType === "grid"?"primary":"inherit"}
                    onClick={() => setViewType("grid")}
                >
                    <GridViewIcon/>
                </Button>
                <Button
                    className={classes.viewTypeButton}
                    variant={viewType === "list"?"contained":"outlined"}
                    color={viewType === "list"?"primary":"inherit"}
                    onClick={() => setViewType("list")}
                >
                    <ListViewIcon/>
                </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <MultiSelctFilter
                    arrayList={SAREETYPES}
                    filterName="Saree Type"
                    title="Saree Type"
                    filterOn="id"
                    saveButtonText="Apply"
                    value={paginationModel.searchData.sareeType}
                    onChangeFilter={(value) => handleChangeFilter('sareeType', value)}
                    clearButtonText="Clear"
                    disabled={false}
                />
                <MultiSelctFilter
                    arrayList={SAREETYPES}
                    filterName="Brand"
                    title="Brand"
                    filterOn="id"
                    saveButtonText="Apply"
                    value={paginationModel.searchData.brand}
                    onChangeFilter={(value) => handleChangeFilter('brand', value)}
                    clearButtonText="Clear"
                    disabled={false}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container spacing={4}>
                    {
                        Products.map((item, ind) => {
                            if(viewType === 'list'){
                                return (
                                    <Grid key={`product-item-${ind}`} item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.listViewContainer}>
                                        <ProductListView
                                            data={item}
                                        />
                                    </Grid>
                                )
                            }else{
                                return (
                                    <Grid key={`product-item-${ind}`} item xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <ProductGridView
                                            data={item}
                                        />
                                    </Grid>
                                )
                            }

                        })
                    }
                </Grid>
            </Grid>
        </Grid>
    );

};

export default  ProductList;