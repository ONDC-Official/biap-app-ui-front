import { useEffect, useState } from "react";
import "./TrakingMap.css";

import { mappls, mappls_plugin } from 'mappls-web-maps';

import useCancellablePromise from "../../../api/cancelRequest";
import { getCall } from "../../../api/axios";

export default function TrakingMapComponent(props) {

  const {
    mapCenter,
    geoPositionStart,
    geoPositionEnd,
    currentLocation = null
  } = props;

  const { cancellablePromise } = useCancellablePromise();
  const [apiKey, setApiKey] = useState();
  const [directionPlugin, setDirectionPlugin] = useState();
  const mapProps = {
    center: mapCenter(),
    traffic: false, zoom: 4, geolocation: false, clickableIcons: false
  }
  let mapObject;
  let mapplsClassObject = new mappls();
  let mapplsPluginObject = new mappls_plugin();
  let direction_plugin;

  const onChangeTrack = (directionPluginData, location) => {
    directionPluginData.tracking({
      location: location,
      label: 'current location',
      icon: "https://apis.mapmyindia.com/map_v3/2.png",
      heading: false,
      reRoute: true,
      fitBounds: false,
      animationSpeed: 5,
      delay: 2000
    });
  };

  const onMapLoad = () => {
    var direction_option = {
      map: mapObject,
      divWidth: '0px',
      start: { label: 'start', geoposition: geoPositionStart },
      end: { label: 'end', geoposition: geoPositionEnd },
      steps: false,
      search: true,
      isDraggable: false,
      alternatives: false,
      callback: function (data) { }
    };

    const defaultCenter = mapCenter();
    const defaultCurrentLocation = defaultCenter ? {
      lat: parseFloat(defaultCenter[0]),
      lng: parseFloat(defaultCenter[1]),
    } : null;

    direction_plugin = mapplsPluginObject.direction(direction_option);
    setDirectionPlugin(direction_plugin);
    setTimeout(() => {
      onChangeTrack(direction_plugin, currentLocation ? currentLocation : defaultCurrentLocation)
    }, 2500);
  };

  const onInitializeMap = () => {
    const loadObject = {
      map: true,
      plugins: ["direction"],
    };
    mapplsClassObject.initialize(apiKey, loadObject, () => {
      mapObject = mapplsClassObject.Map({ id: "map", properties: mapProps });

      //load map layers/components after map load, inside this callback (Recommended)
      mapObject.on("load", () => {
        // Activites after mapload
        onMapLoad();
      })
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
    if (currentLocation) {
      onChangeTrack(directionPlugin, currentLocation);
    }
  }, [currentLocation]);

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
