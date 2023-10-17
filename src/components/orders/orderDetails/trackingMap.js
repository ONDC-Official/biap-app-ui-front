import React from 'react';
import useStyles from "./style";

import ordermap from '../../../assets/images/ordermap.png';
import PlacePickerMap from "../../common/PlacePickerMap/PlacePickerMap";
const TrackingMap = () => {
    const classes = useStyles();
    let locationString = "28.679076630288467,77.06970870494843";
    locationString = locationString.split(',');
    const gps = {
        lat: locationString[0],
        lng: locationString[1]
    }
    return (
        <div className={classes.map}>
            {/*<img className={classes.map} src={ordermap} alt={`ordermap`} />*/}
            <PlacePickerMap
                location={gps}
            />
        </div>
    )

};

export default TrackingMap;