import Image from "next/image";
import React from "react";

const InfoCard = ({ type, amount }: { type: string; amount: string }) => {
  return (
    <div className="flex-1 odd:bg-arkSky even:bg-arkYellow w-full rounded-xl px-4 py-2 min-w-[130px] ">
      <div className="flex justify-between items-center ">
        <span className="bg-slate-50 px-2 py-1 text-xs mb-3 rounded-full text-blue-500 font-medium">
          tanggal
        </span>
        <Image
          src="/more.png"
          alt=""
          width={20}
          height={20}
          className="rotate-90"
        />
      </div>
      <h1 className="font-bold text-xl text-slate-500 my-1">{amount}</h1>
      <h2 className="text-sm text-slate-400 font-semibold capitalize">
        {type}
      </h2>
    </div>
  );
};

export default InfoCard;
