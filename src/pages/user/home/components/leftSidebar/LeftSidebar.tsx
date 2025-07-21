import { useState } from "react";
import userImage from "../../../../../assets/user.png";
import feedImage from "../../../../../assets/feed.png";
import groupsImage from "../../../../../assets/groups.png";
import videoImage from "../../../../../assets/viedos.png";
import reelsImage from "../../../../../assets/reels.png";
import aiImage from "../../../../../assets/ai.png";
import friendsImage from "../../../../../assets/friends.png";
import savedImage from "../../../../../assets/bookmarks.png";
import messengerImage from "../../../../../assets/messenger.png";
import pagesImage from "../../../../../assets/pages.png";
import { getUserName } from "../../../../../utilities/Globals";

const LeftSidebar = () => {
  const [selectedItem, setSelectedItem]: string | any = useState("Feed"); // Default selected
  const userName = getUserName();

  const sidebarmenus = [
    {
      icon: <img src={userImage} alt="userImage" className="h-[32px]" />,
      content: userName,
    },
    {
      icon: <img src={feedImage} alt="feedImage" className="h-[32px]" />,
      content: "Feed",
    },
    {
      icon: <img src={groupsImage} alt="groupsImage" className="h-[32px]" />,
      content: "Groups",
    },
    {
      icon: <img src={videoImage} alt="videoImage" className="h-[32px]" />,
      content: "Video",
    },
    {
      icon: <img src={reelsImage} alt="reelsImage" className="h-[32px]" />,
      content: "Reels",
    },
    {
      icon: <img src={aiImage} alt="aiImage" className="h-[32px]" />,
      content: "Sociofy AI",
    },
    {
      icon: <img src={friendsImage} alt="friendsImage" className="h-[32px]" />,
      content: "Friends",
    },
    {
      icon: <img src={savedImage} alt="savedImage" className="h-[32px]" />,
      content: "Saved",
    },
    {
      icon: (
        <img src={messengerImage} alt="messengerImage" className="h-[32px]" />
      ),
      content: "Messenger",
    },
    {
      icon: <img src={pagesImage} alt="pagesImage" className="h-[32px]" />,
      content: "Pages",
    },
  ];

  return (
    <div className="flex flex-col gap-0.5 px-2">
      {sidebarmenus.map((menu, index) => {
        const isSelected = selectedItem === menu.content;

        return (
          <div
            key={index}
            onClick={() => setSelectedItem(menu.content)}
            className={`flex gap-3 py-2.5 px-2 items-center cursor-pointer rounded-md ${
              isSelected ? "bg-hover-color" : "hover:bg-hover-color"
            }`}
          >
            <div>{menu.icon}</div>
            <div className="font-semibold">{menu.content}</div>
          </div>
        );
      })}
    </div>
  );
};

export default LeftSidebar;
