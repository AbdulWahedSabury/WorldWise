import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent } from "react-leaflet";
import { useCities } from "../contexts/CitiesContext";
import { useEffect, useState } from "react";
export default function Map() {

  const [searchParams, setSearchParams] = useSearchParams();
  const latMap = searchParams.get("lat");
  const lngMap = searchParams.get("lng");

  const { cities } = useCities();
  const [position, setPosition] = useState([40, 0]);

  useEffect(
    function () {
      if (latMap && lngMap) setPosition([latMap, lngMap]);
    },
    [latMap, lngMap]
  );

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat ?? 40, city.position.lng ?? 0]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={position} />
        <DetectMap />
      </MapContainer>
    </div>
  );
}
function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}
function DetectMap(){
  const navigate = useNavigate();
  
  useMapEvent({
    click : (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  })
}
