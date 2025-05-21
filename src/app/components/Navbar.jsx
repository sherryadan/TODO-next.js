"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

function NavLink({ children, to }) {
  return (
    <a href={to} className={`mx-4`}>
      {children}
    </a>
  );
}

function MobileNav({ open, setOpen }) {
  return (
    <div className="absolute top-0 left-0 h-screen w-screen bg-[#c8c1d0] z-40 transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-center h-20">
        <a className="text-xl font-semibold text-white" href="/">
          LOGO
        </a>
      </div>
      <div className="flex flex-col ml-4 text-white  ">
        <a
          className="text-xl font-medium my-4"
          href="/"
          onClick={() => setOpen(false)}
        >
        Home 
        </a>
        <a
          className="text-xl font-normal my-4"
          href="/taskgroups"
          onClick={() => setOpen(false)}
        >
          Group Tasks
        </a>
      </div>
    </div>
  );
}

function UserDropdown({ user }) {
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "GET",
      });
      setLogoutLoading(true);

      if (response.ok) {
        toast.success("Logout successful!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        console.error("Failed to logout");
        toast.error("Logout failed!");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error during logout!");
    }
  };

  const initials = `${user.firstName[0]}${user.lastName[0]}`;
  const imageUrl = user.avatarUrl || "/uploads/default-avatar.png"; 

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
          <Avatar className="cursor-pointer hover:opacity-80 transition-opacity size-11">
            <AvatarImage
              src={imageUrl}
              alt={user.firstName}
              className="rounded-full"
            />
            <AvatarFallback className="text-black">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer hover:text-white hover:bg-black transition-colors duration-200 ease-in-out"
            onClick={() => router.push("/profile")}
          >
            <FaUser className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer hover:text-white hover:bg-black transition-colors duration-200 ease-in-out"
        >
          <FaSignOutAlt className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUser(data);
    }
    fetchUserData();
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#61437e] filter drop-shadow-md px-4 py-4 h-15 flex items-center ">
      {open && <MobileNav open={open} setOpen={setOpen} />}
      <div className="w-3/12 flex items-center">
        <a className="text-2xl font-semibold text-white" href="/">
          TASK MANAGER
        </a>
      </div>
      <div className="w-9/12 flex justify-end items-center">
        <div
          className="z-50 flex relative w-8 h-8 flex-col justify-between items-center md:hidden"
          onClick={() => setOpen(!open)}
        >
          {/* Hamburger button */}
          <span
            className={`h-1 w-full bg-white rounded-lg transform transition duration-300 ease-in-out ${
              open ? "rotate-45 translate-y-3.5" : ""
            }`}
          />
          <span
            className={`h-1 w-full bg-white rounded-lg transition-all duration-300 ease-in-out ${
              open ? "w-0" : "w-full"
            }`}
          />
          <span
            className={`h-1 w-full bg-white rounded-lg transform transition duration-300 ease-in-out ${
              open ? "-rotate-45 -translate-y-3.5" : ""
            }`}
          />
        </div>
        <div className="hidden md:flex text-white">
          <div className="flex items-center">
            <NavLink to="/"> Home</NavLink>
            <NavLink to="/taskgroups">Group Tasks</NavLink>
          </div>
          {user && <UserDropdown user={user} />}
        </div>
      </div>
    </nav>
  );
}
// Done
