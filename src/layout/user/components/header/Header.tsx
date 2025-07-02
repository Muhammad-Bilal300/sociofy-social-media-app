import { FiSearch } from "react-icons/fi";
import { PiMonitorPlayBold } from "react-icons/pi";
import { FaHouse } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";
import Logo from "../../../../components/logo/Logo";
import { useState } from "react";
import { RiMessengerFill } from "react-icons/ri";
import { IoMdNotifications } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";

const Header = () => {
  const [active, setActive] = useState("home");

  const centerIcons = [
    { id: "home", icon: <FaHouse size={24} /> },
    { id: "videos", icon: <PiMonitorPlayBold size={24} /> },
    { id: "groups", icon: <HiMiniUserGroup size={24} /> },
  ];

  return (
    <div className="bg-white px-5 flex justify-between gap-x-2 shadow-secondary shadow-md py-2">
      {/* Left */}
      <div className="flex items-center gap-4 w-1/3">
        <Logo />
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search Sociofy"
            className="w-full pl-10 pr-3 py-2 rounded-md bg-gray-100 focus:outline-none"
          />
        </div>
      </div>

      {/* Center */}
      <div className="flex justify-between items-center gap-6 w-1/4">
        {centerIcons.map(({ id, icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`cursor-pointer py-2.5 w-[120px] flex justify-center text-center transition-all duration-200
        ${active === id ? "text-white bg-primary rounded-md" : "text-secondary"}
        hover:${
          active == id
            ? "bg-primary hover:text-white"
            : "bg-[#d7d4f5] hover:text-primary"
        } hover:rounded-md `}
          >
            {icon}
          </button>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center justify-end gap-6 w-1/3">
        <div className="rounded-full p-2 bg-[#e2e0f7]">
          <RiMessengerFill size={22} className="text-primary  cursor-pointer" />
        </div>
        <div className="rounded-full p-2 bg-[#e2e0f7]">
          <IoMdNotifications
            size={22}
            className="text-primary  cursor-pointer"
          />
        </div>
        <div className="rounded-full p-2 bg-[#d6d6d8]">
          <FaUserAlt size={22} className="text-secondary  cursor-pointer" />
        </div>

        {/* <img
          src="https://via.placeholder.com/32"
          alt="User"
          className="w-8 h-8 rounded-full cursor-pointer"
        /> */}
      </div>
    </div>
  );
};

export default Header;
