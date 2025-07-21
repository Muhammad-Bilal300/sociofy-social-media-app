import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface GoogleMapLocationProps {
  selectedLocationCoords: any;
  selectedImages: any;
  selectedLocation: any;
}

const GoogleMapLocation: React.FC<GoogleMapLocationProps> = ({
  selectedLocationCoords,
  selectedImages,
  selectedLocation,
}) => {
  return (
    <div>
      {selectedLocationCoords && (
        <div
          className="mb-4 cursor-pointer relative z-5"
          style={{ height: selectedImages.length > 0 ? "80px" : "170px" }}
        >
          <MapContainer
            center={selectedLocationCoords}
            zoom={13}
            style={{ width: "100%", height: "100%" }}
            className="rounded-md overflow-hidden"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker
              position={selectedLocationCoords}
              icon={
                new L.Icon({
                  iconUrl:
                    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })
              }
            >
              <Popup>{selectedLocation}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default GoogleMapLocation;
