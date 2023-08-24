import React, {useEffect, useState} from 'react';
import useStyles from './style';
import {useHistory, useParams} from "react-router-dom";
import {PRODUCT_SUBCATEGORY} from "../../../constants/categories";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import IconButton from '@mui/material/IconButton';
import {ReactComponent as PreviousIcon} from '../../../assets/images/previous.svg';
import {ReactComponent as NextIcon} from '../../../assets/images/next.svg';

const SingleCategory = ({data, index}) => {
    let { categoryName, subCategoryName } = useParams();
    const classes = useStyles();
    const history = useHistory();
    return (
        <div className={classes.categoryItem} onClick={() => history.push(`/category/${categoryName}/${data.value}`)}>
            <div className={`${classes.categoryItemImageContainer} ${subCategoryName === data.value?classes.selectedCategory: ""}`}>
                <img className={classes.categoryImage} src={data.imageUrl} alt={`sub-category-img-${index}`} />
            </div>
            <Typography variant="body1" className={classes.categoryNameTypo}>
                {data.value}
            </Typography>
        </div>
    )
};

const CategoriesComponent = () => {
    const classes = useStyles();
    let { categoryName, subCategoryName } = useParams();
    const history = useHistory();
    const [subCatList, setSubCatList] = useState([]);
    const [page, setPage] = useState(0);
    console.log("useParams()=====>", useParams())
    useEffect(() => {
        if(categoryName){
            const options = PRODUCT_SUBCATEGORY[categoryName];
            console.log("options=====>", options)
            setSubCatList(options || []);
        }
    }, [categoryName]);

    useEffect(() => {
        if(subCategoryName && subCatList.length > 0){
            const findsubCatIndex = subCatList.findIndex((item) => item.value === subCategoryName);
            setPage(findsubCatIndex);
        }
    }, [subCategoryName, subCatList]);
    return (
        <Grid container spacing={3} className={classes.categoriesRootContainer}>
            <Grid item xs={12} sm={12} md={1.5} lg={1.5} xl={1.5}></Grid>
            <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                <Pagination
                    count={subCatList.length}
                    page={page}
                    className={classes.categoriesContainer}
                    onChange={(event, page) => {
                        const subCat = subCatList[page];
                        history.push(`/category/${categoryName}/${subCat.value}`)
                    }}
                    boundaryCount={2}
                    renderItem={(item) => {
                        console.log("item=====>", item)
                        if(item.type === "page"){
                            const subCatIndex = item.page - 1;
                            const subCat = subCatList[subCatIndex];
                            return (
                                <SingleCategory
                                    data={subCat}
                                    index={subCatIndex}
                                />
                            )
                        }else if(item.type === "next"){
                            return (
                                <IconButton
                                    color="inherit" className={classes.actionButton}
                                    onClick={() => {
                                        const subCat = subCatList[item.page];
                                        history.push(`/category/${categoryName}/${subCat.value}`)
                                    }}
                                    disabled={subCatList.length === item.page}
                                >
                                    <NextIcon />
                                </IconButton>
                            )
                        }else if(item.type === "previous"){
                            return (
                                <IconButton
                                    color="inherit" className={classes.actionButton}
                                    onClick={() => {
                                        const subCat = subCatList[item.page];
                                        history.push(`/category/${categoryName}/${subCat.value}`)
                                    }}
                                    disabled={item.page === -1}
                                >
                                    <PreviousIcon />
                                </IconButton>
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
                {/*<div className={classes.categoriesContainer}>*/}
                {/*    {*/}
                {/*        subCatList.map((subCat, index) => (*/}
                {/*            <SingleCategory*/}
                {/*                key={`single-category-${index}`}*/}
                {/*                data={subCat}*/}
                {/*                index={index}*/}
                {/*            />*/}
                {/*        ))*/}
                {/*    }*/}
                {/*</div>*/}
            </Grid>
            <Grid item xs={12} sm={12} md={1.5} lg={1.5} xl={1.5}></Grid>
        </Grid>
    )

};

export default CategoriesComponent;