import React from 'react';
import useStyles from './style';
import {useHistory, useParams} from "react-router-dom";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

const SingleSubCategory = ({data}) => {
    let { categoryName } = useParams();
    const history = useHistory();

    const classes = useStyles();

    console.log("categoryName=====>", `category/${categoryName}/${data.name}`);
    return (
        <div className={classes.subCategoryItemContainer} onClick={() => history.push(`/category/${categoryName}/${data.name}`)}>
            <Card className={classes.subCategoryCard}>
                <img className={classes.subCatImage} src={data.imgUrl} alt={`sub-cat-img-${data.id}`}/>
            </Card>
            <Typography component="div" variant="body" className={classes.subCatNameTypo}>
                {data.name}
            </Typography>
        </div>
    )

};

export default SingleSubCategory;