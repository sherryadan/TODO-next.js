import "../globals.css";
import UserProfile from "../components/UserProfile";
import Navbar from "../components/Navbar";

export default function Profile() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <Navbar/>
      <div ><UserProfile/></div>
    </main>
  );
}
