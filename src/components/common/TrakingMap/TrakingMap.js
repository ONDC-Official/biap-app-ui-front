import { useEffect, useState } from "react";
import "./TrakingMap.css";

import { mappls, mappls_plugin } from 'mappls-web-maps';

import useCancellablePromise from "../../../api/cancelRequest";
import { getCall } from "../../../api/axios";

export default function TrakingMapComponent(props) {

  const {

  } = props;

  const { cancellablePromise } = useCancellablePromise();
  const [apiKey, setApiKey] = useState();
  const mapProps = { center: [28.6330, 77.2194], traffic: false, zoom: 4, geolocation: false, clickableIcons: false }
  let mapObject;
  let mapplsClassObject = new mappls();
  let mapplsPluginObject = new mappls_plugin();
  let add, direction_plugin, c = 0, ll = [
    { lat: 28.63124010064198, lng: 77.46734619140625 },
    { lat: 28.63395214251842, lng: 77.4635696411133 },
    { lat: 28.634253476178397, lng: 77.45704650878908 },
    { lat: 28.634856140902432, lng: 77.44880676269533 },
    { lat: 28.635760131498788, lng: 77.44228363037111 },
    { lat: 28.637266765186347, lng: 77.43679046630861 },
    { lat: 28.637869412604015, lng: 77.43232727050783 },
    { lat: 28.639677334088308, lng: 77.42855072021486 },
    { lat: 28.640279967660007, lng: 77.42305755615236 },
    { lat: 28.640882597770116, lng: 77.41928100585939 },
    { lat: 28.640882597770116, lng: 77.41516113281251 },
    { lat: 28.640581283147768, lng: 77.40932464599611 },
    { lat: 28.63756808932784, lng: 77.40108489990236 },
    { lat: 28.635760131498788, lng: 77.39421844482423 },
    { lat: 28.634253476178397, lng: 77.38735198974611 },
    { lat: 28.631541442089226, lng: 77.37808227539064 },
  ];

  const onMapLoad = () => {
    var direction_option = {
      map: mapObject,
      divWidth: '0px',
      start: { label: 'start', geoposition: "28.63124010064198,77.46734619140625" },
      end: { label: 'end', geoposition: "28.631541442089226,77.37808227539064" },
      steps: false,
      search: true,
      isDraggable: false,
      alternatives: false,
      Resource: 'route_eta',
      annotations: 'nodes',
      callback: function (data) { }
    };
    direction_plugin = mapplsPluginObject.direction(direction_option);
    add = setInterval(() => {
      c++;
      if (ll[c]) {
        direction_plugin.tracking({
          location: ll[c],
          label: 'current location',
          icon: "https://apis.mapmyindia.com/map_v3/2.png",
          heading: false,
          reRoute: true,
          fitBounds: false,
          animationSpeed: 5,
          delay: 2000
        });
        if (ll[c].lat === 28.631541442089226) {
          clearInterval(add);
          setTimeout(() => { alert("reached."); }, 500);
        }
      }
    }, 2500);
  };

  const getToken = async () => {
    const res = await cancellablePromise(getCall(`/clientApis/v2/map/accesstoken`));
    console.log("data: ", res);
    setApiKey(res.access_token);
  };

  // fetch MMI API token
  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (apiKey) {
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
    }
  }, [apiKey]);

  return (
    <div style={{ width: "100%", height: "100%", borderRadius: '50px' }}>
      <div id="map" ></div>
    </div>
  );
}
