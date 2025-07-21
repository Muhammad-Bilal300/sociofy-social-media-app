import React, { useState } from "react";
import { FiArrowLeft, FiSearch } from "react-icons/fi";

interface FeelingPanelProps {
  setSelectedFeeling: (feeling: string) => void;
  onBack: () => void;
}

const FEELINGS = [
  { label: "happy", emoji: "😊" },
  { label: "blessed", emoji: "🙏" },
  { label: "sad", emoji: "😢" },
  { label: "loved", emoji: "❤️" },
  { label: "excited", emoji: "🤩" },
  { label: "thankful", emoji: "🙌" },
  { label: "crazy", emoji: "🤪" },
  { label: "grateful", emoji: "😇" },
];

const FeelingPanel: React.FC<FeelingPanelProps> = ({
  setSelectedFeeling,
  onBack,
}) => {
  const [searchFeeling, setSearchFeeling] = useState<string>("");
  const filteredFeelings = FEELINGS.filter(({ label }) =>
    label.toLowerCase().includes(searchFeeling.toLowerCase())
  );

  return (
    <div>
      <div className="">
        <button
          className="p-1.5 bg-hover-color rounded-md cursor-pointer"
          onClick={onBack}
        >
          <FiArrowLeft size={22} />
        </button>
        <h2 className="text-lg font-bold py-3">How are you feeling?</h2>
      </div>
      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
        <input
          type="text"
          placeholder="Search .."
          value={searchFeeling}
          onChange={(e) => setSearchFeeling(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-md bg-background focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-1">
        {filteredFeelings.map(({ label, emoji }) => (
          <button
            key={label}
            className="px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setSelectedFeeling(`${emoji} ${label}`);
              onBack();
            }}
          >
            <span className="text-lg">{emoji}</span>{" "}
            <span className="text-[16px]">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeelingPanel;
