import React from 'react';
import useStyles from './style';
import {useHistory, useLocation, useParams} from "react-router-dom";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

const SingleSubCategory = ({data}) => {
    // let { categoryName } = useParams();
    const history = useHistory();
    const classes = useStyles();
    const lodationData = useLocation();
    const useQuery = () => {
        const { search } = lodationData;
        return React.useMemo(() => new URLSearchParams(search), [search]);
    };
    let query = useQuery();
    const categoryName = query.get("c");
    const updateQueryParams = () => {
        if(lodationData.search === "" && query.get("c") === null){
            history.push(`/application/products?sc=${data.value}`)
        }else{
            history.push(`/application/products?c=${categoryName}&sc=${data.value}`)
        }
    };

    return (
        <div className={classes.subCategoryItemContainer} onClick={() => updateQueryParams()}>
            <Card className={classes.subCategoryCard}>
                <img className={classes.subCatImage} src={data.imageUrl} alt={`sub-cat-img-${data.value}`}/>
            </Card>
            <Typography component="div" variant="body" className={classes.subCatNameTypo}>
                {data.value}
            </Typography>
        </div>
    )

};

export default SingleSubCategory;