"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoArrowBackCircle } from "react-icons/io5";
import { Button } from "@/components/ui/button";

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
      <div className="flex justify-center items-center min-w-screen">
        <div className="bg-[#371c5d] text-gray-300 shadow-xl rounded-xl p-6 w-full max-w-lg text-center">
          <h2 className="text-xl font-semibold animate-pulse">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center  min-w-screen ">
      <div className="bg-[#371c5d] shadow-xl rounded-xl p-6 w-full max-w-lg text-center text-gray-300">
        <h1 className="text-3xl font-bold text-gray-300 mb-6">Task Details</h1>

        <div className=" text-gray-300 p-4 rounded-lg shadow-md mb-4 text-left capitalize">
          <h2 className="text-xl">Title: {task.title}</h2>
        </div>

        <div className=" text-gray-300 p-4 rounded-lg shadow-md mb-6 text-left capitalize">
          <p className="text-m ">
            Description: <span className="text-sm"> {task.description}</span>
          </p>
        </div>

        <Button
          className="w-20 h-10 bg-black text-white rounded-sm text-sm font-medium hover:bg-violet-500 cursor-pointer"
          onClick={() => router.back()}
        >
          <IoArrowBackCircle size={24} />
          Back
        </Button>
      </div>
    </div>
  );
};

export default TaskDetails;
