import React, { useRef, useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./Map.css";

export default function Map({ coordinate }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { lat, long } = coordinate;
  const zoom = 14;

  maptilersdk.config.apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    if (map.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [long, lat],
      zoom: zoom,
    });

    new maptilersdk.Marker({ color: "#2563EB" }) // Blue accent
      .setLngLat([long, lat])
      .addTo(map.current);
  }, [long, lat, zoom]);

  return (
    <div className="map-wrapper">
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
