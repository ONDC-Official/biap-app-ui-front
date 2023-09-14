import React, {useEffect, useState} from 'react';
import useStyles from './style';
import {useHistory, useLocation, useParams} from "react-router-dom";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import {PRODUCT_SUBCATEGORY} from "../../../constants/categories";
import Tooltip from "@mui/material/Tooltip";
import Card from "@mui/material/Card";
import no_image_found from "../../../assets/images/no_image_found.png";

const SubCaregoryCard = ({data, onMouseOver}) => {
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
                <Card className={classes.subCatCard} onMouseOver={onMouseOver} onClick={() => updateQueryParams()}>
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
    const [activeSubCatIndex, setActiveSubCatIndex] = useState(1);
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
        <Grid container spacing={3} className={classes.subCatContainerMain}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="h4">
                    Shop By Category
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.subCatContainer}>
                {
                    subCatList.map((item, ind) => (
                        <SubCaregoryCard
                            key={ind}
                            data={item}
                            onMouseOver={() => setActiveSubCatIndex(ind)}
                        />
                    ))
                }
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.dotsContainer}>
                {
                    subCatList.map((item, index) => (
                        <span key={`dot-${index}`} className={activeSubCatIndex === index?classes.selectedDot:classes.dot} />
                    ))
                }
            </Grid>
        </Grid>
    )

};

export default SubCategories;