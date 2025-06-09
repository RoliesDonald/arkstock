import Pagination from "@/components/ui/Pagination";

const PicListPage = () => {
  return (
    <div className=" p-4 flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Schedule</h1>
      </div>
      {/* LIST */}
      Table Area
      {/* PAGINATION */}
      <div>
        <Pagination />
      </div>
    </div>
  );
};

export default PicListPage;
