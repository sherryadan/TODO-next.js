"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// import Task from "../../../../models/Task";

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const router = useRouter();

  useEffect(() => {
  const fetchTask = async () => {
    try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        const gettask = data.find((task) => task._id===id)
      setTask(gettask);
      console.log("Task fetched:", id, gettask, );
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

    fetchTask();
  }, [id]);

  if (!task) {
    return <div>Loading...</div>;
  }


  return (
    <>
     
        <div><button
        className="bg-blue-500 text-white px-4 py-1 font-semibold rounded-md block mx-auto cursor-pointer"
        onClick={() => router.push("/")}
      >
        Back to Tasks
      </button>
      <h1 className="text-3xl font-bold p-5 underline mb-4 text-center"> Task Title: {task.title}</h1>
      <p className="text-lg text-gray-700 mb-6 text-center">Task Description: {task.description}</p>
     
    </div>
    </>
  
  );
};

export default TaskDetails;
