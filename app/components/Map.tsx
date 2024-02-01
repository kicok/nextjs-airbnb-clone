import L from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// https://leafletjs.com/
// https://react-leaflet.js.org/

// @ts-ignore
delete L.Icon.Default.prototype._getIconRul;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconretinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
});

interface MapProps {
    center?: number[];
}

const Map = ({ center }: MapProps) => {
    return (
        <MapContainer
            center={(center as L.LatLngExpression) || [51, -0.09]}
            zoom={center ? 4 : 2}
            scrollWheelZoom={false}
            className="h-[35vh] rounded-lg"
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* 지도 중앙에 마커 표시 */}
            {center && <Marker position={center as L.LatLngExpression} />}
        </MapContainer>
    );
};

export default Map;
