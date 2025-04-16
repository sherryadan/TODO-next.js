"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
      <div className="flex flex-col ml-4 text-white">
        <a
          className="text-xl font-medium my-4"
          href="/about"
          onClick={() => setOpen(false)}
        >
          About
        </a>
        <a
          className="text-xl font-normal my-4"
          href="/contact"
          onClick={() => setOpen(false)}
        >
          Contact
        </a>
      </div>
    </div>
  );
}

function UserDropdown({ user }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span className="text-white mx-2">{user.firstName}</span>
      </div>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
          <div className="px-4 py-2 text-gray-800">
            <p>
              {user.firstName} {user.lastName}
            </p>
            <p>{user.email}</p>
          </div>
          <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">
            User Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    // Fetch user data from the API
    async function fetchUserData() {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUser(data);
    }
    fetchUserData();
  }, []);

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

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#b182dd] filter drop-shadow-md px-4 py-4 h-20 flex items-center">
      {open && <MobileNav open={open} setOpen={setOpen} />}

      <div className="w-3/12 flex items-center">
        <a className="text-2xl font-semibold text-white" href="/">
          LOGO
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
          <NavLink to="/">HOME</NavLink>
          <NavLink to="/about">ABOUT</NavLink>
          {user && <UserDropdown user={user} />}
          <Button
            onClick={handleLogout}
            type="submit"
            className="bg-black text-gray-300 px-4 rounded-md font-bold py-2 h-[29px]  hover:bg-red-500 cursor-pointer"
            disabled={logoutLoading}
          >
            {logoutLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </nav>
  );
}
