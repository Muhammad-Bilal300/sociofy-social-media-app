import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { IoIosClose } from "react-icons/io";

interface GoogleMapLocationProps {
  selectedLocationCoords: any;
  selectedImages: any;
  selectedLocation: any;
  setSelectedLocation: (location: string | null) => void;
  setSelectedLocationCoords: (coords: [number, number] | null) => void;
}

const GoogleMapLocation: React.FC<GoogleMapLocationProps> = ({
  selectedLocationCoords,
  selectedImages,
  selectedLocation,
  setSelectedLocation,
  setSelectedLocationCoords,
}) => {
  return (
    <div>
      {selectedLocationCoords && (
        <div
          className="mb-4 cursor-pointer relative"
          style={{ height: selectedImages.length > 0 ? "100px" : "170px" }}
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
          <div
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 cursor-pointer"
            style={{ zIndex: 9999 }}
            onClick={() => {
              setSelectedLocation(null);
              setSelectedLocationCoords(null);
            }}
          >
            <IoIosClose size={20} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapLocation;
