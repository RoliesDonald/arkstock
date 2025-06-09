import Image from "next/image";

const TableSearch = () => {
  return (
    <div className="flex w-full md:auto bg-arkBg-100 p-2 rounded-full items-center gap-2 border-2 peer-focus:border-red-500 peer-focus:ring-5 border-arkBg-200 ">
      <Image src="/search.png" width={20} height={20} alt="search" />
      <input
        type="text"
        placeholder="search"
        className="peer w-[100%] bg-transparent focus:ring-0 focus:outline-none focus:border-red-500 text-slate-500"
      />
    </div>
  );
};

export default TableSearch;
