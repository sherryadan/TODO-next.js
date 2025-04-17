import AddTask from "../components/AddTask";
import "../globals.css";

export default function Home() {
  return (
    <div className="flex justify-center h-screen  min-w-screen">
      <AddTask />
    </div>
  );
}