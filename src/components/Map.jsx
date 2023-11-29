import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useCities } from "../contexts/CitiesContext";
import { useEffect, useState } from "react";
import Button from "./Button";
import { useGeolocation } from "../Hooks/UseGeolocation";
import { useUrlPosition } from "../contexts/UseUrlPosition";
export default function Map() {
  const {
    isLoading: isLoadingPosition,
    position: locationPosition,
    getPosition,
  } = useGeolocation();
  const [lat,lng] = useUrlPosition();

  const { cities } = useCities();
  const [position, setPosition] = useState([40, 0]);

  useEffect(
    function () {
      if (lat && lng) setPosition([lat, lng]);
    },
    [lat, lng]
  );

  useEffect(
    function () {
      if (locationPosition)
        setPosition([locationPosition.lat, locationPosition.lng]);
    },
    [locationPosition]
  );
  return (
    <div className={styles.mapContainer}>
      {!locationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading.." : "Use my location"}
        </Button>
      )}

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
function DetectMap() {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}
