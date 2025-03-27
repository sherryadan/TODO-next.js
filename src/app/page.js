import AddTask from "./components/AddTask";
import Form from "./components/Form";
import "./globals.css";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto mt-4 px-4 sm:px-6 lg:px-8">
            <AddTask />
    </main>
  );
}
