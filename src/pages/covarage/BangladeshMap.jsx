import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import coverageData from "../../assets/json/warehouses.json";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const BangladeshMap = ({ searchText }) => {
  const mapRef = useRef();

  const center = [23.685, 90.3563];

  const filteredData = coverageData.filter(
    (p) =>
      p.district.toLowerCase().includes(searchText.toLowerCase()) ||
      p.city.toLowerCase().includes(searchText.toLowerCase()),
  );

  useEffect(() => {
    if (filteredData.length === 1 && mapRef.current) {
      const map = mapRef.current;
      map.setView([filteredData[0].latitude, filteredData[0].longitude], 10);
    }
  }, [searchText]);

  return (
    <div className="rounded-xl overflow-hidden border bg-white shadow-sm">
      <MapContainer
        center={center}
        zoom={7}
        scrollWheelZoom={false}
        style={{ height: 420, width: "100%" }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredData.map((p) => (
          <Marker
            key={`${p.district}-${p.latitude}`}
            position={[p.latitude, p.longitude]}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1} sticky>
              <div>
                <div className="font-bold">{p.district}</div>
                <div className="text-xs">{p.city}</div>
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BangladeshMap;
