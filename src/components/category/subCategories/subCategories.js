import React, {useEffect, useState} from 'react';
import useStyles from './style';
import {useLocation, useParams} from "react-router-dom";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import SingleSubCategory from "./singleSubCategory";

import subcat0 from '../../../assets/images/subcaregory/subcat0.png';
import subcat1 from '../../../assets/images/subcaregory/subcat1.png';
import subcat2 from '../../../assets/images/subcaregory/subcat2.png';
import subcat3 from '../../../assets/images/subcaregory/subcat3.png';
import subcat4 from '../../../assets/images/subcaregory/subcat4.png';
import subcat5 from '../../../assets/images/subcaregory/subcat5.png';
import subcat6 from '../../../assets/images/subcaregory/subcat6.png';
import subcat7 from '../../../assets/images/subcaregory/subcat7.png';
import subcat8 from '../../../assets/images/subcaregory/subcat8.png';
import subcat9 from '../../../assets/images/subcaregory/subcat9.png';

import {PRODUCT_SUBCATEGORY} from "../../../constants/categories";

const SubCatList = [
    {id: 1, name: "Top Deals", imgUrl: subcat0},
    {id: 2, name: "Winter Wear", imgUrl: subcat1},
    {id: 3, name: "Men's Clothing, Shoes & Accessories", imgUrl: subcat2},
    {id: 4, name: "Women's Clothing, Shoes & Accessories", imgUrl: subcat3},
    {id: 5, name: "Jewellery & Watches", imgUrl: subcat4},
    {id: 6, name: "Kids' Clothing, Shoes & Accessories", imgUrl: subcat5},
    {id: 7, name: "Travel Luggage", imgUrl: subcat6},
    {id: 8, name: "Sports Wear", imgUrl: subcat7},
    {id: 9, name: "Swim & Beach Wear", imgUrl: subcat8},
    {id: 10, name: "Ethnic Wear", imgUrl: subcat9},
];

const SubCategories = () => {
    // let { categoryName } = useParams();
    const classes = useStyles();
    const [subCatList, setSubCatList] = useState([]);
    const locationData = useLocation();
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
    }, [categoryName]);

    return (
        <Grid container spacing={3} className={classes.subCatContainer}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="h4">
                    Shop By Category
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container spacing={4} columns={10}>
                    {
                        subCatList.map((item, ind) => (
                            <Grid key={`sub-cat-item-${ind}`} item xs={12} sm={12} md={2} lg={2} xl={2}>
                                <SingleSubCategory
                                    data={item}
                                />
                            </Grid>
                        ))
                    }
                </Grid>
            </Grid>
        </Grid>
    )

};

export default SubCategories;