import { FiSearch } from "react-icons/fi";
import { PiMonitorPlayBold } from "react-icons/pi";
import { FaHouse } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";
import Logo from "../../../../components/logo/Logo";
import { useEffect, useRef, useState } from "react";
import { RiMessengerFill } from "react-icons/ri";
import { IoMdNotifications } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { removeAuthToken } from "../../../../utilities/Globals";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("home");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const centerIcons = [
    { id: "home", icon: <FaHouse size={24} /> },
    { id: "videos", icon: <PiMonitorPlayBold size={24} /> },
    { id: "groups", icon: <HiMiniUserGroup size={24} /> },
  ];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white px-5 flex justify-between items-center gap-x-2 shadow-md py-2">
      {/* Left */}
      <div className="flex items-center gap-3 w-1/3">
        <Logo />

        {/* Desktop Search */}
        <div className="relative hidden sm:block w-[50%]">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search Sociofy"
            className="w-full pl-10 pr-3 py-2 rounded-md bg-background focus:outline-none"
          />
        </div>

        {/* Mobile Search Icon */}
        <div className="sm:hidden bg-background p-2 rounded-full">
          <FiSearch size={22} className="text-secondary" />
        </div>
      </div>

      {/* Center - Hide on small screens */}
      <div className="hidden md:flex justify-between items-center gap-6 w-1/4">
        {centerIcons.map(({ id, icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`cursor-pointer py-2.5 w-[90px] flex justify-center text-center transition-all duration-200
              ${
                active === id
                  ? "text-white bg-primary rounded-md"
                  : "text-secondary"
              }
              hover:${
                active === id
                  ? "bg-primary hover:text-white"
                  : "bg-[#d7d4f5] hover:text-primary"
              } hover:rounded-md`}
          >
            {icon}
          </button>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center justify-end gap-2 w-1/3">
        {/* Mobile Menu Icon */}
        <div className="sm:hidden rounded-full p-2 bg-background">
          <HiMenu size={22} className="text-secondary cursor-pointer" />
        </div>
        <div className="rounded-full p-2 bg-[#e2e0f7]">
          <RiMessengerFill size={22} className="text-primary cursor-pointer" />
        </div>
        <div className="rounded-full p-2 bg-[#e2e0f7]">
          <IoMdNotifications
            size={22}
            className="text-primary cursor-pointer"
          />
        </div>
        {/* User Icon with Popup */}
        <div className="relative">
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="rounded-full p-2 bg-[#d6d6d8] cursor-pointer"
          >
            <FaUserAlt size={22} className="text-secondary" />
          </div>

          {showUserMenu && (
            <div className="absolute right-0 mt-4 w-40 bg-white rounded-md shadow-lg shadow-gray-400 z-50">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 font-semibold rounded-md cursor-pointer">
                Profile
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 font-semibold rounded-md cursor-pointer"
                onClick={() => {
                  removeAuthToken();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
