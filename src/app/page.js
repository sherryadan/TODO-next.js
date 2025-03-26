import AddTask from "./components/AddTask";
import "./globals.css";

export default function Home() {
  return (
        <main className="max-w-4xl mx-auto mt-4">
          <div className="text-center my-4 flex flex-col gap-2">
            <h1 className="text-2xl font-bold mt-20"> 
              Task Manager
            </h1>
            <div className="flex justify-center">
            <AddTask/>
            </div>
          </div>
        </main>
  );
}
