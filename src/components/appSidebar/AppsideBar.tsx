"use client";

import { useAppDispatch } from "@/redux/hooks";
import { clearUser } from "@/redux/slices/authSlice";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import provideIcon from "@/utils/provideIcon";
import { ChevronRight, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { GiPayMoney } from "react-icons/gi";
import { HiMiniUsers } from "react-icons/hi2";
import { MdCampaign } from "react-icons/md";
import { RiDashboardHorizontalFill, RiLogoutCircleRLine } from "react-icons/ri";
import LogoutConfirmationDialog from "../confirmation/logoutConfirmation";
import { Button } from "../ui/button";
type SidebarItem = {
  name: string;
  path: string;
  icon: React.ComponentType | string;
  hasSubmenu?: boolean;
  isCustomIcon?: boolean;
};

const sidebars: SidebarItem[] = [
  { name: "Dashboard", path: "/", icon: RiDashboardHorizontalFill },
  {
    name: "Donor  & Invitees",
    path: "/donor-invitees",
    icon: HiMiniUsers,
  },
  {
    name: "Donations",
    path: "/donations",
    icon: GiPayMoney,
  },
  {
    name: "Campaigns",
    path: "/campaigns",
    icon: MdCampaign,
  },
  {
    name: "Downline Content",
    path: "/downline",
    icon: MdCampaign,
  },

  { name: "Settings", path: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    dispatch(clearUser());
    // Use replace to avoid keeping the dashboard in history
    router.replace("/auth/login");
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };
  const toggleSubmenu = (itemName: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const policyPages = [
    { name: "Terms & Conditions", path: "/policies/terms-&-conditions" },
    { name: "Privacy Policy", path: "/policies/privacy-policy" },
    { name: "Cookie Policy", path: "/policies/cookie-policy" },
    { name: "Refund Policy", path: "/policies/refund-policy" },
    { name: "Shipping Policy", path: "/policies/shipping-policy" },
  ];

  return (
    <Sidebar>
      <SidebarContent className="bg-white text-gray-900">
        <SidebarGroup>
          <SidebarGroupLabel className="flex flex-col justify-center items-center my-7 ">
            <Image
              src="/auth/logo.png"
              alt="logo"
              width={200}
              height={200}
              className="w-3/4 h-28 object-contain mt-10 scale-110"
            />
          </SidebarGroupLabel>

          <SidebarGroupContent className="mt-16">
            <SidebarMenu>
              {sidebars.map((item) => (
                <SidebarMenuItem key={item.name}>
                  {item.hasSubmenu ? (
                    <>
                      <SidebarMenuButton
                        onClick={() => toggleSubmenu(item.name)}
                        className={`w-full hover:bg-purple-600 hover:text-white active:bg-purple-600 active:text-white ${isActive(item.path) ? "bg-purple-600 text-white" : ""
                          }`}
                      >
                        {item.isCustomIcon
                          ? provideIcon({ name: item.icon as string })
                          : React.createElement(
                            item.icon as React.ComponentType
                          )}
                        <span>{item.name}</span>
                        <ChevronRight
                          className={`ml-auto transition-transform ${openSubmenus[item.name] ? "rotate-90" : ""
                            }`}
                        />
                      </SidebarMenuButton>
                      {openSubmenus[item.name] && (
                        <SidebarMenuSub>
                          {policyPages.map((policy) => (
                            <SidebarMenuSubItem key={policy.name}>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={policy.path}
                                  className={`hover:bg-purple-600 text-white ${isActive(policy.path) ? "bg-purple-600" : ""
                                    }`}
                                >
                                  {policy.name}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      className={`hover:bg-purple-600 hover:text-white ${isActive(item.path) ? "bg-purple-600 text-white" : ""
                        }`}
                    >
                      <Link href={item.path}>
                        {item.isCustomIcon
                          ? provideIcon({ name: item.icon as string })
                          : React.createElement(
                            item.icon as React.ComponentType
                          )}
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-white text-gray-900">
        <SidebarGroupLabel className="text-bold text-2xl mb-4">
          <Button
            className="w-full flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleLogoutClick}
          >
            <RiLogoutCircleRLine />
            Logout
          </Button>
        </SidebarGroupLabel>
      </SidebarFooter>

      <LogoutConfirmationDialog
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </Sidebar>
  );
}
