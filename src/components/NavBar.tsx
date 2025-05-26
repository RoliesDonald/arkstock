import Image from "next/image";
import React from "react";

const NavBar = () => {
  return (
    <div className="flex items-center sticky top-0 z-50 justify-between p-4 bg-slate-200/60 backdrop-blur-sm shadow-md shadow-slate-400/45 ">
      {/* SEARCH INPUT */}
      <div className="hidden md:flex bg-slate-100 p-2 rounded-full items-center gap-2 border-2 peer-focus:border-red-500 peer-focus:ring-5 border-slate-200 ">
        <Image src="/search.png" width={20} height={20} alt="search" />
        <input
          type="text"
          placeholder="search"
          className="peer w-[100%] bg-transparent focus:ring-0 focus:outline-none focus:border-red-500 text-slate-500"
        />
      </div>
      {/* RIGHT GROUP BAR */}
      <div className="flex gap-6 justify-end items-center w-full">
        <div className="bg-slate-50 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" width={20} height={20} alt="message" />
        </div>
        <div className="bg-slate-50 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image
            src="/announcement.png"
            width={20}
            height={20}
            alt="notification"
          />
          <div className="absolute -top-2 text-xs font-semibold -right-3 w-5 h-5 bg-red-600 text-slate-50 rounded-full flex items-center justify-center">
            88
          </div>
        </div>
        <div className="flex flex-col justify-end gap-1">
          <span className="text-xs text-slate-700 font-semibold leading-3">
            Rolies Donald
          </span>
          <span className="text-xs text-blue-700 font-semibold leading-3 text-right">
            Supervisor
          </span>
        </div>
        <Image
          src="/avatar.png"
          width={30}
          height={30}
          alt="avatar"
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default NavBar;
