import { useEffect, useState } from "react";
import "./ViewOnlyMap.css";

import { mappls } from 'mappls-web-maps';

import useCancellablePromise from "../../../api/cancelRequest";
import { getCall } from "../../../api/axios";

export default function ViewOnlyMapComponent(props) {

  const {
    location
  } = props;

  const { cancellablePromise } = useCancellablePromise();
  const [apiKey, setApiKey] = useState();
  let mapObject, Marker1;
  let mapplsClassObject = new mappls();

  const onInitializeMap = () => {
    const loadObject = {
      map: true,
    };
    const defaultLocation = location || [28.62, 77.09];
    const mapProps = {
      center: defaultLocation,
      traffic: false, zoom: 4, geolocation: false, clickableIcons: false,
      fitbounds: true,
      minZoom: 15,
      maxZoom: 15,
      zoomControl: false,
      scrollZoom: false,
      scaleControl: false,
      rotateControl: false,
      rotateControlOptions: false,
      scrollWheel: false,
      draggable: false,
      fullscreenControl: false,
      clickableIcons: false,
      disableDoubleClickZoom: false,
    }
    mapplsClassObject.initialize(apiKey, loadObject, () => {
      mapObject = mapplsClassObject.Map({ id: "map", properties: mapProps });
      Marker1 = mapplsClassObject.Marker({
        map: mapObject,
        position: {
          "lat": defaultLocation[0],
          "lng": defaultLocation[1]
        },
        fitbounds: true,
        html: '<div><img class="bouncing bounce" src="https://apis.mapmyindia.com/map_v3/1.png"></div>'
      });
    });
  };

  const getToken = async () => {
    const res = await cancellablePromise(getCall(`/clientApis/v2/map/accesstoken`));
    setApiKey(res.access_token);
  };

  // fetch MMI API token
  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (apiKey) {
      onInitializeMap();
    }
  }, [apiKey]);

  return (
    <div style={{ width: "100%", height: "100%", borderRadius: '50px' }}>
      <div id="map" ></div>
    </div>
  );
}
