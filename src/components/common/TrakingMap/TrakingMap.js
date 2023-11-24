import { useCallback, useEffect, useRef, useMemo, useState } from "react";
import axios from "axios";
import ScriptTag from "react-script-tag";
import "./TrakingMap.css";

import { mappls, mappls_plugin } from 'mappls-web-maps';

export default function TrakingMapComponent(props) {

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
  const mapProps = { center: [28.6330, 77.2194], traffic: false, zoom: 4, geolocation: false, clickableIcons: false }
  let mapObject;
  let mapplsClassObject = new mappls();
  let mapplsPluginObject = new mappls_plugin();
  let map, add, direction_plugin, c = 0, ll = [
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

  console.log("mapplsClassObject=====>", mapplsClassObject);

  const onMapLoad = () => {
    console.log("1111111111111111111111111111", mapplsClassObject);
    var direction_option = {
      map: mapObject,
      divWidth: '0px',
      start: { label: 'start', geoposition: "28.63124010064198,77.46734619140625" },
      end: { label: 'end', geoposition: "28.631541442089226,77.37808227539064" },
      steps: false,
      search: true,
      isDraggable: false,
      alternatives: false,
      callback: function (data) { console.log("direction_option callback ======>", data); }
    };
    console.log("2222222222222=====>", mapplsPluginObject);
    direction_plugin = mapplsPluginObject.direction(direction_option);
    console.log("direction_plugin=====>", direction_plugin);
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

  // fetch MMI API token
  useEffect(() => {
    axios.post("https://ref-seller-app-preprod.ondc.org/api/v1/auth/mmi/token").then((res) => {
      console.log("res.data=====>", res.data);
      setApiKey(res.data.access_token);
    });
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

  // const ref = useCallback((node) => {
  //   if (!mapInitialised && node != null) {
  //     // eslint-disable-next-line
  //     // const map = new MapmyIndia.Map(node, {
  //     //   center,
  //     //   zoom,
  //     //   zoomControl,
  //     //   search,
  //     // });
  //     // setMap(map);
  //     // setMapInitialised(true);
  //     // console.log("mappls=====>", new mappls);
  //     // const map = new mappls.Map('map', {
  //     //   center: [28.09, 78.3],
  //     //   zoom: 5
  //     // });
  //     // setMap(map);
  //     // setMapInitialised(true);
  //   }
  // }, []);

  // const onChange = (data) => {
  //   const { lat, lng } = data;
  //   if (lat && lng) {
  //     setLocation(data);
  //   } else console.log("Location not found. Please try moving map.");
  // };

  // useEffect(() => {
  //   if (!mapInitialised) return;
  //   let options = {};
  //   if (!setLocation) {
  //     options = {
  //       map,
  //       // callback: () => {},
  //       search: false,
  //       closeBtn: false,
  //       topText: " ",
  //       geolocation: false,
  //     };
  //   } else {
  //     options = {
  //       map,
  //       callback: onChange,
  //       search: true,
  //       closeBtn: false,
  //       topText: " ",
  //       geolocation: true,
  //     };
  //   }

  //   options.location = location?.lat && location?.lng ? location : { lat: 28.679079, lng: 77.06971 };
  //   // eslint-disable-next-line
  //   new MapmyIndia.placePicker(options);
  // }, [mapInitialised, props]);



  // const initMap1 = () => {
  //   map = new mappls.Map('map', {
  //     center: [28.09, 78.3],
  //     zoom: 5
  //   });
  //   map.addListener('load', function () {
  //     /*direction plugin initialization*/
  //     var direction_option = {
  //       map: map,
  //       divWidth: '350px',
  //       start: { label: 'start', geoposition: "28.63124010064198,77.46734619140625" },
  //       end: { label: 'end', geoposition: "28.631541442089226,77.37808227539064" },
  //       steps: false,
  //       search: true,
  //       isDraggable: false,
  //       alternatives: false,
  //       callback: function (data) { }
  //     }
  //     direction_plugin = mappls.direction(direction_option);
  //     add = setInterval(() => {
  //       c++;
  //       if (ll[c]) {
  //         direction_plugin.tracking({
  //           location: ll[c],
  //           label: 'current location',
  //           icon: "../img/mkr_start.png",
  //           heading: false,
  //           reRoute: true,
  //           fitBounds: false,
  //           animationSpeed: 5,
  //           delay: 2000
  //         });
  //         if (ll[c].lat === 28.631541442089226) {
  //           clearInterval(add);
  //           setTimeout(() => { alert("reached."); }, 500);
  //         }
  //       }
  //     }, 2000);
  //   });
  // }

  return (
    <div style={{ width: "100%", height: "100%", borderRadius: '50px' }}>
      {/* <ScriptTag
        isHydrating={true}
        // type="text/javascript"
        src={`https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk?layer=vector&v=3.0&callback=initMap1`}
        onLoad={(e) => setScript1Loaded(true)}
      />
      <ScriptTag
        isHydrating={true}
        // type="text/javascript"
        src={`https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk_plugins?v=3.0&libraries=direction`}
        onLoad={() => setScript2Loaded(true)}
      />
      {script1Loaded && script2Loaded && <div id="map" ref={ref} />} */}
      <div id="map" ></div>
    </div>
  );
}
