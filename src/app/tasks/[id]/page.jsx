"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoArrowBackCircle } from "react-icons/io5";

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
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTask();
  }, [id]);

  if (!task) {
    return (
      <div className="flex justify-center items-center min-h-screen min-w-screen bg-#dae1ea">
        <div className="bg-gray-300 shadow-xl rounded-xl p-6 w-full max-w-lg text-center">
          <h2 className="text-xl font-semibold animate-pulse">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen min-w-screen bg-#dae1ea ">
      <div className="bg-gray-300 shadow-xl rounded-xl p-6 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Task Details</h1>

        <div className=" text-black p-4 rounded-lg shadow-md mb-4 text-left capitalize">
          <h2 className="text-xl">Title: {task.title}</h2>
        </div>

        <div className=" text-black p-4 rounded-lg shadow-md mb-6 text-left capitalize">
          <p className="text-m ">
            Description: <span className="text-sm"> {task.description}</span>
          </p>
        </div>

        <button
          className="flex items-center justify-center gap-2 bg-green-800 text-white px-5 py-3 rounded-lg font-semibold hover:bg-green-950 transition duration-200 mx-auto cursor-pointer"
          onClick={() => router.push("/")}
        >
          <IoArrowBackCircle size={24} />
          Back
        </button>
      </div>
    </div>
  );
};

export default TaskDetails;
