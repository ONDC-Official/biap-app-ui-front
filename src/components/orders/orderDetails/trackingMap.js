import React from 'react';
import useStyles from "./style";

import ordermap from '../../../assets/images/ordermap.png';
import PlacePickerMap from "../../common/PlacePickerMap/PlacePickerMap";
import TrakingMap from "../../common/TrakingMap/TrakingMap";

const TrackingMapComponant = () => {
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
            {/* <PlacePickerMap
                location={gps}
            /> */}
            <TrakingMap />
        </div>
    )

};

export default TrackingMapComponant;