"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import { clearUser } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import {
  useGetAdminByAuthIdQuery,
  useLogoutMutation,
} from "@/redux/Apis/authApi";
import useToast from "@/hooks/useToast";
import getAuthIdFromToken from "@/utils/jwtDecode";
import { useSocketNotifications } from "@/hooks/useSocketNotifications";
export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { success, error } = useToast();
  const [logout, { isLoading }] = useLogoutMutation();
  const authId = getAuthIdFromToken();
  const { data: adminResponse } = useGetAdminByAuthIdQuery(authId, {
    skip: !authId, // Skip the query if authId is null
  });
  const admin = adminResponse?.data;
  console.log("admin", admin);

  // Socket notifications
  const { unreadCount, isConnected } = useSocketNotifications();

  const handleLogout = async () => {
    try {
      // Call logout API (no parameters needed, but RTK Query requires at least one argument)
      await logout(undefined).unwrap();
      success("Logged out successfully");
    } catch {
      // Even if API call fails, still logout locally
      error("Logout failed, but you have been logged out locally");
    } finally {
      // Always clear local state and trigger cross-tab logout
      dispatch(clearUser());
      router.push("/auth/login");
    }
  };
  return (
    <div className="w-full bg-sidebar border-b flex-shrink-0">
      <header className="flex h-20 w-full items-center px-4">
        <SidebarTrigger />

        <div className="ml-auto flex gap-2">
          <Button
            className="p-0 border bg-transparent h-10 hover:bg-white"
            onClick={() => {
              router.push("/notifications");
            }}
          >
            <IoIosNotificationsOutline className="text-black" />
            {unreadCount > 0 && (
              <Badge
                className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                variant="destructive"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
            {/* {!isConnected && (
              <div
                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white"
                title="Connection lost"
              />
            )} */}
          </Button>

          {/* Shadcn Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex h-10 w-[180px] items-center justify-between px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={admin?.profile} />
                    <AvatarFallback>
                      {admin?.name
                        ? admin.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  {/* <span className="text-sm">
                    {admin?.name.split(" ")[0] +
                      " " +
                      admin?.name.split(" ")[1] || "Profile"}
                  </span> */}
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[180px]" align="end">
              <DropdownMenuItem asChild>
                <Link href="/my-profile" className="cursor-pointer">
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/change-password" className="cursor-pointer">
                  Change Password
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={handleLogout}
                disabled={isLoading}
              >
                {isLoading ? "Logging out..." : "Log Out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
}
