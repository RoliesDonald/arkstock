const Pagination = () => {
  return (
    <div className="flex p-4 text-slate-500 justify-between mt-2">
      <button
        disabled
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      <div className="flex gap-2 items-center text-sm">
        <button className="px-2 font-semibold rounded-md bg-blue-200">1</button>
        <button className="px-2 font-semibold rounded-md border border-slate-100">
          2
        </button>
        <button className="px-2 font-semibold rounded-md">...</button>
        <button className="px-2 font-semibold rounded-md border border-slate-100">
          10
        </button>
      </div>
      <button className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
        Next
      </button>
    </div>
  );
};

export default Pagination;
