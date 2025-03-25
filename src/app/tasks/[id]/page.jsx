"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TaskDetails = ({ params }) => {
  const { id } = params;
  const [task, setTask] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`/api/tasks`);
      const tasks = await res.json();
      const foundTask = tasks.find((t) => t.id == id);
      setTask(foundTask);
    };
    fetchTask();
  }, [id]);

  if (!task) return <h1>Loading...</h1>;

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">{task.title}</h1>
      <p className="text-lg">{task.description}</p>
      <button className="bg-blue-500 text-white px-4 py-2 mt-3" onClick={() => router.push("/")}>
        Back to Tasks
      </button>
    </div>
  );
};

export default TaskDetails;
