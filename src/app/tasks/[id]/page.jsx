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
        const gettask = data.find((task) => task._id === id);
        setTask(gettask);
        console.log("Task fetched:", id, gettask);
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
      <div className="max-w-4xl mx-auto mt-20 outline-1 ">
        <h1 className="text-2xl font-bold p-5"> TASK DETAILS</h1>
        <div className="bg-amber-700 ">
          <h2 className="text-xl font-semibold p-2 mt-4 mb-auto text-center">
            {" "}
            {task.title}
          </h2>
        </div>
        <div className="bg-amber-500 mb-30"> 
          <p className="text-m text-gray-700 mb-6 text-center hover: ">
          {task.description}
          </p>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-1 mb-5 font-semibold rounded-md block mx-auto cursor-pointer"
          onClick={() => router.push("/")}
        >
          Back to Tasks
        </button>
      </div>
    </>
  );
};

export default TaskDetails;
