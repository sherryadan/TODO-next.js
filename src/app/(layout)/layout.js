import "../globals.css";
import Navbar from "../components/Navbar";

export default function NavLayout({ children }) {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
}
