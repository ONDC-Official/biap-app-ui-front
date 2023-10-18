import { useCallback, useEffect, useRef, useMemo, useState } from "react";
import axios from "axios";
import ScriptTag from "react-script-tag";
import "./PlacePickerMap.css";

export default function MapPointer(props) {
  const {
    center = [28.62, 77.09],
    zoom = 15,
    zoomControl = true,
    search = true,
    hybrid = false,
    location,
    setLocation = null,
  } = props;
  const [apiKey, setApiKey] = useState();
  const [map, setMap] = useState();
  const [mapInitialised, setMapInitialised] = useState(false);
  const [script1Loaded, setScript1Loaded] = useState(false);
  const [script2Loaded, setScript2Loaded] = useState(false);

  // fetch MMI API token
  useEffect(() => {
    axios.post("https://ref-seller-app-preprod.ondc.org/api/v1/auth/mmi/token").then((res) => {
      setApiKey(res.data.access_token);
    });
  }, []);

  const ref = useCallback((node) => {
    if (!mapInitialised && node != null) {
      // eslint-disable-next-line
      const map = new MapmyIndia.Map(node, {
        center,
        zoom,
        zoomControl,
        search,
      });
      setMap(map);
      setMapInitialised(true);
    }
  }, []);

  const onChange = (data) => {
    const { lat, lng } = data;
    if (lat && lng) {
      setLocation(data);
      console.log("onChange", data);
    } else console.log("Location not found. Please try moving map.");
  };

  useEffect(() => {
    if (!mapInitialised) return;
    let options = {};
    if (!setLocation) {
      options = {
        map,
        // callback: () => {},
        search: false,
        closeBtn: false,
        topText: " ",
        geolocation: false,
      };
    } else {
      options = {
        map,
        callback: onChange,
        search: true,
        closeBtn: false,
        topText: " ",
        geolocation: true,
      };
    }

    console.log(options);
    options.location = location?.lat && location?.lng ? location : { lat: 28.679079, lng: 77.06971 };
    // eslint-disable-next-line
    new MapmyIndia.placePicker(options);
  }, [mapInitialised, props]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ScriptTag
        isHydrating={true}
        type="text/javascript"
        src={`https://apis.mapmyindia.com/advancedmaps/v1/${apiKey}/map_load?v=1.3`}
        onLoad={() => setScript1Loaded(true)}
      />
      <ScriptTag
        isHydrating={true}
        type="text/javascript"
        src={`https://apis.mapmyindia.com/advancedmaps/api/${apiKey}/map_sdk_plugins`}
        onLoad={() => setScript2Loaded(true)}
      />
      {script1Loaded && script2Loaded && <div id="map" ref={ref} />}
    </div>
  );
}
