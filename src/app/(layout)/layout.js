import "../globals.css";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";

export default function NavLayout({ children }) {
  return (
    <main>
      <Navbar />
            <Toaster position="top-right" reverseOrder={false} />
      
      {children}
    </main>
  );
}
