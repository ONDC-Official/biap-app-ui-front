import React, { useEffect, useState } from 'react';
import useStyles from "./style";

import TrakingMap from "../../common/TrakingMap/TrakingMap";

const TrackingMapComponant = ({ orderDetails, trakingDetails }) => {
    const classes = useStyles();

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
            // let locationString = "30.749469, 76.642282".replaceAll(' ', '');//data.location.gps.replaceAll(' ', '');
            let locationString = data.location.gps.replaceAll(' ', '');
            locationString = locationString.split(',');
            data.location.latlng = {
                lat: parseFloat(locationString[0]),
                lng: parseFloat(locationString[1])
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
                            return [parseFloat(locationString[0]), parseFloat(locationString[1])]
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