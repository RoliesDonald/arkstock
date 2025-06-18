import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const LoginPage = () => {
  return (
    <section className="w-full h-screen flex items-center justify-center p-5 bg-arkBlue-100">
      {/* sisi kiri */}
      <div className="flex w-[60%] h-full relative overflow-hidden rounded-tl-3xl rounded-bl-3xl ">
        <div className="absolute inset-0 flex items-center justify-end z-10">
          <p className="font-bold text-arkRed-600  text-[2rem]  text-end leading-none dark:bg-arkBlue-800 rounded-bl-3xl rounded-tl-3xl px-10 py-5 w-fit">
            Partner Terpercaya untuk Armada anda
          </p>
        </div>
        <Image
          src="/welcome-door.jpg"
          alt="bg-login"
          layout="fill"
          objectFit="cover"
          className="opacity-70"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />
      </div>
      {/* sisi kanan */}
      <div className="w-[40%] h-full bg-arkBg-50 flex flex-col items-center justify-center rounded-tr-3xl rounded-br-3xl px-5 overflow-hidden">
        <div className="w-[80%]">
          <div className="flex flex-col items-center">
            <Image
              src="/bm.png"
              alt="logo"
              width={60}
              height={60}
              className="mb-2"
            />
            <p className="font-bold felx items-center text-arkBlue-800 text-md">
              Login to Your Account
            </p>
          </div>
          <div className="flex mt-5 items-center justify-center w-full py-0 border-2 border-arkBg-300 bg-arkBg-100 rounded-md">
            <Image
              src="/google.png"
              alt="logo"
              width={40}
              height={40}
              className="p-0.5 mr-2 "
            />
            <p className="text-arkBlue-800 text-sm font-bold">
              Login with Google
            </p>
          </div>
          <p className="flex w-full justify-center item-center my-4 text-arkBlue-500 text-sm font-semibold italic ">
            or Login with email
          </p>
          <div className="mt-6 w-full">
            <div className="my-2">
              <label
                htmlFor=""
                className="text-arkBg-500 text-sm font-semibold italic mt-3 pl-2"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="focus:outline-none w-full boder placeholder:italic mt-2 text-sm rounded-lg h-[35px] border-2 p-5 bg-arkBg-100 text-arkBlue-800"
              />
            </div>
            <div>
              <label
                htmlFor=""
                className="text-arkBg-500 text-sm font-semibold italic mt-3 pl-2"
              >
                Email
              </label>
              <input
                type="password"
                autoComplete="current-password"
                name="email"
                placeholder="Password"
                className="focus:outline-none w-full boder placeholder:italic text-sm mt-2 rounded-lg h-[35px] border-2 p-5 bg-arkBg-100 text-arkBlue-800"
              />
            </div>

            <Link href="/admin-dashboard">
              <Button
                variant={"default"}
                className="w-full mt-10 text-sm bg-arkBlue-700"
              >
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
