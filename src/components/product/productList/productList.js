import React, {useState, useEffect, useContext} from 'react';
import useStyles from './style';
import {useParams, Link, useHistory, useLocation} from "react-router-dom";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';

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

import useCancellablePromise from "../../../api/cancelRequest";
import {
    getAllProductRequest,
    getAllFiltersRequest,
    getAllFilterValuesRequest
} from '../../../api/product.api';
import {getValueFromCookie} from "../../../utils/cookies";
import {SearchContext} from '../../../context/searchContext';

const ProductsList = [
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
    // let { categoryName, subCategoryName } = useParams();
    const history = useHistory();
    const lodationData = useLocation();
    const { searchData, locationData } = useContext(SearchContext);

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

    const useQuery = () => {
        const { search } = lodationData;
        return React.useMemo(() => new URLSearchParams(search), [search]);
    };
    let query = useQuery();
    const categoryName = query.get("c");
    const subCategoryName = query.get("sc");
    const searchProductName = query.get("s");

    useEffect(() => {
        if(lodationData){
            const searchName = query.get("s");
            console.log("history.location.search again=====>", searchName);
            getAllProducts(searchName)
        }
    }, [lodationData]);
    const getAllProducts = async(searchName) => {
        setIsLoading(true);
        try {
            const paginationData = Object.assign({}, JSON.parse(JSON.stringify(paginationModel)));
            paginationData.searchData.productName = searchName || "";
            paginationData.searchData.subCategoryName = subCategoryName || "";
            const data = await cancellablePromise(
                getAllProductRequest(paginationData)
            );
            console.log("getAllProducts=====>", data)
            setProducts(data.data);
            setTotalProductCount(data.count);
        } catch (err) {
            // dispatch({
            //     type: toast_actions.ADD_TOAST,
            //     payload: {
            //         id: Math.floor(Math.random() * 100),
            //         type: toast_types.error,
            //         message: err?.message,
            //     },
            // });
        } finally {
            setIsLoading(false);
        }
    };

    const getFilterValues = async(attributeCode) => {
        try {
            const data = await cancellablePromise(
                getAllFilterValuesRequest(attributeCode, subCategoryName)
            );
            console.log("getFilterValues=====>", data);
            let filterValues = data.data;
            filterValues = filterValues.map((value) => {
                const createObj = {
                    id: value,
                    name: value,
                }
                return createObj
            })
            return filterValues
        }  catch (err) {
        } finally {
            setIsLoading(false);
        }
    };

    const getAllFilters = async() => {
        setIsLoading(true);
        try {
            const data = await cancellablePromise(
                getAllFiltersRequest(subCategoryName)
            );
            console.log("getAllFilters=====>", data)
            let filtersData = data.data;

            for (let filter of filtersData) {
                const values = await getFilterValues(filter.code);
                const findIndex = filtersData.findIndex((item) => item.code === filter.code);
                if(findIndex > -1){
                    filtersData[findIndex].options = values;
                    filtersData[findIndex].selectedValues = [];
                }
            }
            let paginationData = Object.assign(JSON.parse(JSON.stringify(paginationModel)));
            paginationData.searchData = filtersData;
            setPaginationModel(paginationData);
        } catch (err) {
            // dispatch({
            //     type: toast_actions.ADD_TOAST,
            //     payload: {
            //         id: Math.floor(Math.random() * 100),
            //         type: toast_types.error,
            //         message: err?.message,
            //     },
            // });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(subCategoryName){
            getAllProducts();
            getAllFilters();
        }
    }, [subCategoryName]);

    const handleChangeFilter = (filterIndex, value) => {
        const data = Object.assign({}, JSON.parse(JSON.stringify(paginationModel)));
        data.searchData[filterIndex].selectedValues = value;
        data.page = 0;
        data.pageSize = 10;
        setPaginationModel(data);
    };

    return (
        <Grid container spacing={3} className={classes.productContainer}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div role="presentation">
                    <Breadcrumbs aria-label="breadcrumb">
                        <MuiLink component={Link} underline="hover" color="inherit" to="/application/products">
                            Home
                        </MuiLink>
                        {
                            categoryName && (
                                <MuiLink
                                    // component={Link}
                                    underline="hover"
                                    color="inherit"
                                    // to={`/category/${categoryName}`}
                                    href={`/application/products?${searchProductName?`s=${searchProductName}&`:""}${categoryName?`c=${categoryName}`:""}`}
                                >
                                    {categoryName}
                                </MuiLink>
                            )
                        }
                        {
                            (subCategoryName || searchProductName) && (
                                <Typography color="text.primary">{subCategoryName || searchProductName}</Typography>
                            )
                        }
                    </Breadcrumbs>
                </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.catNameTypoContainer}>
                <Typography variant="h4" className={classes.catNameTypo} color={"success"}>
                    {subCategoryName}
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
                {
                    paginationModel.searchData && paginationModel.searchData.length > 0 && paginationModel.searchData.map((filter, filterIndex) => {
                        return (
                            <MultiSelctFilter
                                key={`filter-${filter.code}-${filterIndex}`}
                                arrayList={filter?.options || []}
                                filterName={filter.code}
                                title={filter.code}
                                filterOn="id"
                                saveButtonText="Apply"
                                value={filter?.selectedValues || []}
                                onChangeFilter={(value) => handleChangeFilter(filterIndex, value)}
                                clearButtonText="Clear"
                                disabled={false}
                            />
                        )
                    })
                }
                {/*<MultiSelctFilter*/}
                {/*    arrayList={SAREETYPES}*/}
                {/*    filterName="Saree Type"*/}
                {/*    title="Saree Type"*/}
                {/*    filterOn="id"*/}
                {/*    saveButtonText="Apply"*/}
                {/*    value={paginationModel.searchData.sareeType}*/}
                {/*    onChangeFilter={(value) => handleChangeFilter('sareeType', value)}*/}
                {/*    clearButtonText="Clear"*/}
                {/*    disabled={false}*/}
                {/*/>*/}
                {/*<MultiSelctFilter*/}
                {/*    arrayList={SAREETYPES}*/}
                {/*    filterName="Brand"*/}
                {/*    title="Brand"*/}
                {/*    filterOn="id"*/}
                {/*    saveButtonText="Apply"*/}
                {/*    value={paginationModel.searchData.brand}*/}
                {/*    onChangeFilter={(value) => handleChangeFilter('brand', value)}*/}
                {/*    clearButtonText="Clear"*/}
                {/*    disabled={false}*/}
                {/*/>*/}
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container spacing={4}>
                    {
                        products.length > 0
                        ?(
                            <>
                                {
                                    products.map((productItem, ind) => {
                                        if(viewType === 'list'){
                                            return (
                                                <Grid key={`product-item-${ind}`} item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.listViewContainer}>
                                                    <ProductListView
                                                        product={productItem?.item_details}
                                                        productId={productItem.id}
                                                        price={productItem?.item_details?.price}
                                                        bpp_provider_descriptor={
                                                            productItem?.provider_details?.descriptor
                                                        }
                                                        bpp_id={productItem?.bpp_details?.bpp_id}
                                                        location_id={
                                                            productItem?.location_details
                                                                ? productItem.location_details?.id
                                                                : ""
                                                        }
                                                        bpp_provider_id={productItem?.provider_details?.id}
                                                    />
                                                </Grid>
                                            )
                                        }else{
                                            return (
                                                <Grid key={`product-item-${ind}`} item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                    <ProductGridView
                                                        product={productItem?.item_details}
                                                        productId={productItem.id}
                                                        price={productItem?.item_details?.price}
                                                        bpp_provider_descriptor={
                                                            productItem?.provider_details?.descriptor
                                                        }
                                                        bpp_id={productItem?.bpp_details?.bpp_id}
                                                        location_id={
                                                            productItem?.location_details
                                                                ? productItem.location_details?.id
                                                                : ""
                                                        }
                                                        bpp_provider_id={productItem?.provider_details?.id}
                                                    />
                                                </Grid>
                                            )
                                        }

                                    })
                                }
                            </>
                        ):<></>

                    }
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.paginationContainer}>
                <Pagination
                    className={classes.pagination}
                    count={Math.ceil(totalProductCount/paginationModel.pageSize)}
                    shape="rounded"
                    color="primary"
                    page={paginationModel.page}
                    onChange={(evant, page) => {
                        let paginationData = Object.assign({}, paginationModel);
                        paginationData.page = page;
                        setPaginationModel(paginationData);
                    }}
                />
            </Grid>
        </Grid>
    );

};

export default  ProductList;