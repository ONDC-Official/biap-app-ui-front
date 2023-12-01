import React, { useEffect, useState } from 'react';
import useStyles from "./style";

import TrakingMap from "../../common/TrakingMap/TrakingMap";

const TrackingMapComponant = ({ orderDetails, trakingDetails }) => {
    const classes = useStyles();
    let locationString = "28.679076630288467,77.06970870494843";
    locationString = locationString.split(',');
    const gps = {
        lat: locationString[0],
        lng: locationString[1]
    }

    const [deliveryDetails, setDeliveryDetails] = useState(null);
    const [trakData, setTrakData] = useState(null);

    // fulfillments
    useEffect(() => {
        if (orderDetails && orderDetails.fulfillments && orderDetails.fulfillments.length > 0) {
            const findDeliveryFullfillment = orderDetails.fulfillments.find((item) => item.type === "Delivery");
            if (findDeliveryFullfillment) {
                setDeliveryDetails(findDeliveryFullfillment);
            } else {
                setDeliveryDetails(null);
            }
        }
    }, [orderDetails]);

    useEffect(() => {
        if (trakingDetails) {
            let data = Object.assign({}, JSON.parse(JSON.stringify(trakingDetails)));
            let locationString = data.location.gps;
            locationString = locationString.split(',');
            data.location.latlng = {
                lat: locationString[0],
                lng: locationString[1]
            };
            setTrakData(data);
        }
    }, [trakingDetails]);

    return (
        <div className={classes.map}>
            {
                orderDetails && deliveryDetails && (
                    <TrakingMap
                        mapCenter={() => {
                            let locationString = deliveryDetails.start.location.gps;
                            locationString = locationString.split(',');
                            return [locationString[0], locationString[1]]
                        }}
                        geoPositionStart={deliveryDetails.start.location.gps.replaceAll(' ', '')}
                        geoPositionEnd={deliveryDetails.end.location.gps.replaceAll(' ', '')}
                        currentLocation={trakData ? trakData.location.latlng : null}
                    />
                )
            }
        </div>
    )

};

export default TrackingMapComponant;