import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { get } from "../../../../../../../../../../services/apiService";
import { SEARCH_LOCATION } from "../../../../../../../../../../services/apiRoutes";
import { getUserToken } from "../../../../../../../../../../utilities/Globals";

interface LocationPanelProps {
  setSelectedLocation: (location: string) => void;
  setSelectedLocationCoords: (coords: [number, number]) => void;
  onBack: () => void;
}

const LocationPanel: React.FC<LocationPanelProps> = ({
  setSelectedLocation,
  setSelectedLocationCoords,
  onBack,
}) => {
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<any>(null);

  useEffect(() => {
    if (!searchLocation.trim()) {
      setSuggestions([]);
      return;
    }

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(async () => {
      setLoading(true);
      const res = await get(
        `${SEARCH_LOCATION}?q=${encodeURIComponent(searchLocation)}`,
        getUserToken()
      );
      setSuggestions(res?.data || []);
      setLoading(false);
    }, 500);

    setDebounceTimeout(timeout);
  }, [searchLocation]);

  const handleSelectLocation = (place: any) => {
    setSelectedLocation(place.display_name);
    setSelectedLocationCoords([parseFloat(place.lat), parseFloat(place.lon)]);
    onBack();
  };

  return (
    <div className="min-h-[400px]">
      <div>
        <button
          className="p-1.5 bg-hover-color rounded-md cursor-pointer"
          onClick={onBack}
        >
          <FiArrowLeft size={22} />
        </button>
        <h2 className="text-lg font-bold py-3">Search For Location?</h2>
      </div>

      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
        <input
          type="text"
          placeholder="Where are you?"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-md bg-background focus:outline-none"
        />
      </div>

      <div className="max-h-60 overflow-y-auto">
        {loading ? (
          <div className="space-y-3">
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-200 h-10 rounded-md"
                ></div>
              ))}
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((place, idx) => (
            <div
              key={idx}
              className="cursor-pointer hover:bg-gray-100 rounded-md p-2 flex gap-2"
              onClick={() => handleSelectLocation(place)}
            >
              <div className="rounded-full flex items-center justify-center bg-hover-color min-w-[45px] min-h-[45px] max-w-[45px] max-h-[45px]">
                <FaMapMarkerAlt size={20} color="gray" />
              </div>

              <div>
                <div className="font-bold">{place.name}</div>
                <div className="text-secondary font-semibold text-xs">
                  {place.display_name}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="font-bold">No Locations Found</div>
        )}
      </div>
    </div>
  );
};

export default LocationPanel;
