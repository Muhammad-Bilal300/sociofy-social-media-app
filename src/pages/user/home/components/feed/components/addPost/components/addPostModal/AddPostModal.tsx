// Refactored AddPostModal.tsx using separate FeelingPanel and LocationPanel components with swipeable panel state

import { Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import { FaUserAlt, FaGlobeAsia } from "react-icons/fa";
import { getUserName } from "../../../../../../../../../utilities/Globals";
import FilledButton from "../../../../../../../../../components/buttons/filledButton/FilledButton";
import PostImagePreview from "./components/PostImagePreview";
import PostActionBar from "./components/PostActionBar";
import PostTextAreaWithEmoji from "./components/PostTextAreaWithEmoji";
import FeelingPanel from "./components/FeelingPanel";
import LocationPanel from "./components/LocationPanel";
import { useAddPostMutation } from "./hooks/useAddPostMutation";
import AlertDialog from "../../../../../../../../../utilities/Alert";
import GoogleMapLocation from "./components/GoogleMapLocation";

interface AddPostModalProps {
  open: boolean;
  onClose: () => void;
}

const AddPostModal: React.FC<AddPostModalProps> = ({ open, onClose }) => {
  const [postText, setPostText] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedLocationCoords, setSelectedLocationCoords] = useState<
    [number, number] | null
  >(null);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [panel, setPanel] = useState<"default" | "feeling" | "location">(
    "default"
  );

  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const addPostMutation = useAddPostMutation();

  const handlePost = () => {
    const payload = {
      description: postText.trim(),
      postStatus: "PUBLIC",
      feeling: selectedFeeling,
      location: selectedLocation,
      locationCoords: selectedLocationCoords,
      files: selectedImages,
    };

    addPostMutation.mutate(payload, {
      onSuccess: () => {
        // AlertDialog({
        //   title: "",
        //   text: data.message,
        //   icon: "success",
        //   timer: 1500,
        // });

        // Clear form on success
        setPostText("");
        setSelectedImages([]);
        setShowEmojiPicker(false);
        setSelectedFeeling(null);
        setSelectedLocation(null);
        setSelectedLocationCoords(null);
        setPanel("default");
        // refetch();
        onClose();
      },
      onError: (error: Error) => {
        AlertDialog({
          title: "Error",
          text: error.message || "Failed to create post",
          icon: "error",
          timer: 2000,
        });
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const openGoogleMap = () => {
    if (selectedLocationCoords) {
      const [lat, lon] = selectedLocationCoords;
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`,
        "_blank"
      );
    }
  };

  return (
    <Modal open={open} centered onCancel={onClose} footer={null}>
      {panel === "default" && (
        <div>
          <div className="text-center font-bold text-lg border-b pb-2">
            Create Post
          </div>
          <div className="flex items-center gap-2 mt-2 mb-2 cursor-pointer">
            <div className="rounded-full p-2 bg-[#d6d6d8]">
              <FaUserAlt size={24} className="text-secondary" />
            </div>
            <div>
              <div className="font-semibold text-[16px]">
                {selectedFeeling || selectedLocation ? (
                  <div>
                    {getUserName()}
                    {selectedFeeling && ` is feeling`}
                    <span className="text-primary font-bold">
                      {selectedFeeling && `${selectedFeeling}`}
                    </span>

                    {selectedLocation && ` at `}

                    <span
                      onClick={openGoogleMap}
                      className="text-secondary hover:text-primary cursor-pointer"
                    >
                      {selectedLocation && `${selectedLocation}`}.
                    </span>
                  </div>
                ) : (
                  getUserName()
                )}
              </div>
              <div className="inline-flex items-center gap-1 text-sm font-semibold bg-background text-black px-2 py-0.5 rounded-sm mt-1">
                <FaGlobeAsia size={10} /> Public
              </div>
            </div>
          </div>
          <PostTextAreaWithEmoji
            postText={postText}
            setPostText={setPostText}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            emojiPickerRef={emojiPickerRef}
            hasImages={selectedImages.length > 0}
          />

          <GoogleMapLocation
            selectedLocationCoords={selectedLocationCoords}
            selectedImages={selectedImages}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            setSelectedLocationCoords={setSelectedLocationCoords}
          />

          <PostImagePreview
            selectedImages={selectedImages}
            handleRemoveImage={handleRemoveImage}
          />
          <PostActionBar
            onImageSelect={handleImageChange}
            onFeelingClick={() => setPanel("feeling")}
            onLocationClick={() => setPanel("location")}
          />
          <FilledButton
            buttonText={addPostMutation.isPending ? "Posting..." : "Post"}
            onClick={handlePost}
            disabled={
              (!postText.trim() && selectedImages.length === 0) ||
              addPostMutation.isPending
            }
            bgColor={
              !postText.trim() && selectedImages.length === 0
                ? "bg-gray-300"
                : "bg-primary"
            }
            textColor={
              !postText.trim() && selectedImages.length === 0
                ? "text-gray-500"
                : "text-white"
            }
            fontWeight="font-semibold"
            width="w-full"
            height="h-[40px]"
            rounded="rounded-md"
            fontSize="text-lg"
          />
        </div>
      )}

      {panel === "feeling" && (
        <FeelingPanel
          setSelectedFeeling={(f) => setSelectedFeeling(f)}
          onBack={() => setPanel("default")}
        />
      )}

      {panel === "location" && (
        <LocationPanel
          setSelectedLocation={setSelectedLocation}
          setSelectedLocationCoords={setSelectedLocationCoords}
          onBack={() => setPanel("default")}
        />
      )}
    </Modal>
  );
};

export default AddPostModal;
