// components/shared/MyMenu.tsx
"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { MenuItem } from "@/types/sidebar";
import { Badge } from "../ui/badge";
import { isActiveRoute } from "@/lib/utils/isActiveRoute";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
// import { sidebarMenuItems } from "@/lib/sidebar-data";
import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { sidebarMenuItems } from "@/config/sidebar";

interface MyMenuProps {}

const MyMenu: React.FC<MyMenuProps> = () => {
  const pathName = usePathname();
  const params = useParams();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const currentRole = currentUser?.role || "";
  const currentCompanyType = currentUser?.companyType || "";

  const { vendorId, rentalCompanyId /* , otherDynamicId */ } =
    currentUser || {};

  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const toggleSubMenu = (title: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items.filter((item) => {
      if (item.separator) return true;

      if (item.roles && !item.roles.includes(currentRole)) {
        return false;
      }

      if (
        item.companyTypes &&
        (!currentCompanyType || !item.companyTypes.includes(currentCompanyType))
      ) {
        return false;
      }

      if (item.children) {
        const filteredChildren = filterMenuItems(item.children);
        if (filteredChildren.length === 0 && item.groupTitle) {
          return false;
        }
        item.children = filteredChildren;
      } else if (item.groupTitle && !item.children) {
        return false;
      }

      return true;
    });
  };

  const visibleMenuItems = filterMenuItems(sidebarMenuItems);

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item, index) => {
      if (item.separator) {
        return (
          <div
            key={`sep-${index}`}
            className="my-2 mx-2 lg:mx-5 border border-arkBlue-100 "
          ></div>
        );
      }

      const hasChildren = item.children && item.children.length > 0;

      const allDynamicParams: Record<string, string | null | undefined> = {
        vendorId: vendorId,
        rentalCompanyId: rentalCompanyId,
        ...(params || {}),
      };

      let linkHref = item.href;
      if (linkHref) {
        const dynamicSegmentRegex = /\[(\w+)\]/g;
        linkHref = linkHref.replace(dynamicSegmentRegex, (match, paramName) => {
          if (allDynamicParams[paramName]) {
            return allDynamicParams[paramName] as string;
          }
          return match;
        });
      }

      const hasUnresolvedDynamicSegments =
        linkHref && /\[(\w+)\]/.test(linkHref);

      if (item.groupTitle) {
        return (
          <div key={item.title || `group-${index}`} className="mb-2 mt-4 px-2 ">
            <h3 className="text-[0.7rem] font-semibold text-arkBlue-500 opacity-25 uppercase tracking-wider hidden lg:block text-ellipsis overflow-hidden whitespace-nowrap">
              {item.title}
            </h3>
            <div className="mt-2 space-y-2 ">
              {renderMenuItems(item.children || [])}
            </div>
          </div>
        );
      }

      if (hasUnresolvedDynamicSegments && !hasChildren) {
        console.warn(
          `Link to ${item.href} cannot be rendered as it contains unresolved dynamic segments.`
        );
        return null;
      }

      const isActive = isActiveRoute(pathName, item, allDynamicParams);

      const IconComponent = item.icon;

      const baseClasses = "text-arkBlue-900 hover:text-arkBlue-500";
      const activeClasses = "text-arkRed-500";

      const renderWithTooltip = (element: React.ReactNode) => (
        <Tooltip>
          <TooltipTrigger asChild>{element}</TooltipTrigger>
          <TooltipContent
            side="right"
            className="hidden sm:block lg:hidden text-lg"
          >
            {item.title}
          </TooltipContent>
        </Tooltip>
      );

      return (
        <div key={item.title || `item-${index}`} className="">
          {hasChildren ? (
            <button
              onClick={() => toggleSubMenu(item.title)}
              className={cn(
                "flex items-center w-full py-2 px-4 sm:px-2 sm:py-2 rounded-lg transition-colors duration-200 group",
                // Tambahkan perataan untuk ukuran kecil
                "justify-center lg:justify-start"
              )}
            >
              {renderWithTooltip(
                IconComponent && (
                  <IconComponent
                    size={20}
                    className={cn(
                      "flex-shrink-0", // Hapus mr-1 dari sini untuk centering penuh pada sm/md
                      baseClasses,
                      isActive && activeClasses
                    )}
                  />
                )
              )}
              <span
                className={cn(
                  "hidden lg:block truncate overflow-hidden whitespace-nowrap ml-1 text-[0.8rem]", // Tambahkan ml-1 kembali untuk spasi saat lg
                  baseClasses,
                  isActive && activeClasses
                )}
              >
                {item.title}
              </span>
              <span
                className={cn(
                  "hidden lg:flex ml-auto",
                  baseClasses,
                  isActive && activeClasses
                )}
              >
                {openSubMenus[item.title] ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </span>
            </button>
          ) : (
            <Link
              href={linkHref || "#"}
              className={cn(
                "flex items-center gap-1 w-full text-[0.8rem] text-arkRed-500 py-2 px-1 sm:px-2 sm:py-2 rounded-lg relative transition-colors duration-200 group",
                // Tambahkan perataan untuk ukuran kecil
                "justify-center lg:justify-start"
              )}
            >
              {renderWithTooltip(
                IconComponent && (
                  <IconComponent
                    size={18}
                    className={cn(
                      "flex-shrink-0", // Hapus mr-1 dari sini untuk centering penuh pada sm/md
                      baseClasses,
                      isActive && activeClasses
                    )}
                  />
                )
              )}
              <span
                className={cn(
                  "hidden lg:block truncate overflow-hidden whitespace-nowrap flex-grow ml-1", // Tambahkan ml-1 kembali untuk spasi saat lg
                  baseClasses,
                  isActive && activeClasses
                )}
              >
                {item.title}
              </span>
              {item.notification !== undefined && item.notification > 0 && (
                <>
                  <Badge
                    variant={"outline"}
                    className="h-5 min-w-5 rounded-full px-1 font-mono bg-arkRed-500 text-arkBlue-50 items-center justify-center tabular-nums hidden lg:flex"
                  >
                    {item.notification}
                  </Badge>
                  <Badge
                    variant={"outline"}
                    className="
                      absolute -top-1 -right-1
                      lg:hidden rounded-full
                      bg-arkRed-500 text-arkBlue-50
                      items-center justify-center
                      flex-shrink-0
                      p-0.5 h-auto min-w-4 text-[0.6rem]
                      transform translate-x-1 -translate-y-1
                    "
                  >
                    {item.notification}
                  </Badge>
                </>
              )}
            </Link>
          )}

          {hasChildren && !item.groupTitle && openSubMenus[item.title] && (
            // Untuk sub-menu yang muncul saat terbuka, kita ingin mereka juga rata tengah
            // saat dalam mode ikon saja (sm/md)
            <div className="ml-2 mt-1 ">
              {renderMenuItems(item.children || [])}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <TooltipProvider>
      <div className="mt-1 scrollbar h-screen overflow-auto pb-10">
        {renderMenuItems(visibleMenuItems)}
      </div>
    </TooltipProvider>
  );
};

export default MyMenu;
