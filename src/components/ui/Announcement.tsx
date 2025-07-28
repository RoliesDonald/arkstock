"use client";
import React from "react";

interface AnnouncementItem {
  title: string;
  date: string;
  description: string;
}

const data: AnnouncementItem[] = [
  {
    title: "Lorem Ipsum",
    date: "2023-10-01",
    description:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit.lorem ipsum dolor sit amet, consectetur adipiscing elit",
  },
  {
    title: "Dolor Sit Amet",
    date: "2023-10-02",
    description:
      "consectetur adipiscing elit, sed do eiusmod tempor incididunt.lorem ipsum dolor sit amet, consectetur adipiscing elit",
  },
  {
    title: "Consectetur Adipiscing Elit",
    date: "2023-10-03",
    description:
      "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.lorem ipsum dolor sit amet, consectetur adipiscing elit",
  },
];

const Announcement = () => {
  return (
    <div className="bg-arkBg-50 boder-2 rounded-xl w-full h-fit p-4 shadow-lg border-t-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-arkBlue-700">Announcement</h1>
        <span className="text-arkBg-400 font-medium text-sm">view all</span>
      </div>
      <div className="flex flex-col items-center gap-4">
        {data.map((announcement: AnnouncementItem, index: number) => (
          <div key={index} className="bg-arkBlue-50 rounded-md p-4 w-full">
            <div className="flex items-center justify-between gap-5">
              <h2 className="font-medium text-arkBlue-800 text-lg">
                {announcement.title}
              </h2>
              <span className="text-arkBlue-800 text-sm font-semibold bg-arkBlue-50 px-1 py-1 rounded-md">
                {announcement.date}
              </span>
            </div>
            <p className="text-xs text-arkBg-800 mt-3">
              {announcement.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcement;
