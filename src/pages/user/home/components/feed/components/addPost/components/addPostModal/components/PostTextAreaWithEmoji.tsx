// components/PostTextAreaWithEmoji.tsx
import { useEffect } from "react";
import { FaRegSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

interface Props {
  postText: string;
  setPostText: (text: string) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (val: any) => void;
  emojiPickerRef: React.RefObject<HTMLDivElement | null>; // 👈 updated here
  hasImages: boolean;
}

const PostTextAreaWithEmoji = ({
  postText,
  setPostText,
  showEmojiPicker,
  setShowEmojiPicker,
  emojiPickerRef,
  hasImages,
}: Props) => {
  const handleEmojiClick = (emojiData: any) => {
    setPostText(postText + emojiData.emoji);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  useEffect(() => {
    if (!hasImages) {
      const textarea = document.getElementById(
        "post-textarea"
      ) as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }
  }, [postText]);

  return (
    <div className="flex items-end justify-between mb-6 relative">
      <textarea
        id="post-textarea"
        placeholder="What's on your mind?"
        value={postText}
        onChange={handleInput}
        className={`w-[95%] text-black ${
          hasImages ? "text-[17px]" : "text-[20px]"
        } placeholder:text-secondary bg-transparent focus:outline-none resize-none overflow-hidden`}
        style={{ minHeight: hasImages ? 30 : 150 }}
      />
      <div className="relative group">
        <FaRegSmile
          size={24}
          className="text-secondary cursor-pointer"
          onClick={() => setShowEmojiPicker((prev: any) => !prev)}
        />
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-[120%] right-5 z-50 shadow-xl bg-white rounded-md"
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} height={350} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostTextAreaWithEmoji;
