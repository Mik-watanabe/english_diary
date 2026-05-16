"use client";

import { useUser } from "@/components/providers/UserProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LogOutIcon,
} from "lucide-react";
import { useState } from "react";
import SignoutDialog from "./signout-dialog";

export function ProfileButton() {
  const { user } = useUser();
  const initial =
    user?.user_metadata?.first_name?.[0] && user?.user_metadata?.last_name?.[0]
      ? `${user?.user_metadata?.first_name?.[0]}${user?.user_metadata?.last_name?.[0]}`
      : "User";

  const [open, setOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button className="hover:cursor-pointer font-semibold text-xs size-9 rounded-full bg-[#F5F9FF] text-blue-600 shadow-sm hover:bg-blue-50">
              {initial}
            </button>
          }
        />
        <DropdownMenuContent>
          {/* {TODO: Add profile page} */}
          {/* <DropdownMenuItem>
          <UserIcon />
          Profile
        </DropdownMenuItem> */}
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setOpen(true);
            }}
          >
            <LogOutIcon/>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SignoutDialog isOpen={open} onSetOpen={setOpen} />
    </>
  );
}
