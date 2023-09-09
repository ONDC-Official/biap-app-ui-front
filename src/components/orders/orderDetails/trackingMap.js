import React from 'react';
import useStyles from "./style";

import ordermap from '../../../assets/images/ordermap.png';
const TrackingMap = () => {
    const classes = useStyles();

    return (
        <div>
            <img className={classes.map} src={ordermap} alt={`ordermap`} />
        </div>
    )

};

export default TrackingMap;