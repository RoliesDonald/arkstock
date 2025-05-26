import Menu from "@/components/Menu";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] ">
        <Link
          href="/"
          className="flex items-center justify-start gap-2 px-6 py-4"
        >
          <Image
            src="/logo-01.png"
            alt="logo"
            width={32}
            height={32}
            className="md:size-7 lg:size-10 xl:size-10"
          />
          <span className="hidden lg:block text-2xl font-bold text-slate-600">
            Arkstok
          </span>
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] overflow-scroll">
        <NavBar />
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
