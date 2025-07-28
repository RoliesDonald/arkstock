import moment from "moment";
import Image from "next/image";
import React from "react";

const formattedDate = moment().format("DD/MM/YY");

const InfoCard = ({ type, amount }: { type: string; amount: string }) => {
  return (
    <div className="flex-1 border shadow w-full rounded-xl px-4 py-2 min-w-[130px] bg-arkBlue-100 ">
      <div className="flex justify-between items-center ">
        <span className="bg-border px-2 py-1 text-xs mb-3 rounded-full text-arkBlue-500 font-semibold">
          {formattedDate}
        </span>
        <Image
          src="/more.png"
          alt=""
          width={15}
          height={15}
          className="rotate-90"
        />
      </div>
      <h1 className="font-bold text-xl text-arkBg-800 my-1">{amount}</h1>
      <h2 className="text-sm text-arkBg-700 font-semibold capitalize">
        {type}
      </h2>
    </div>
  );
};

export default InfoCard;
