"use client";
import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit, MdRemoveRedEye } from "react-icons/md";
import { ImSpinner6 } from "react-icons/im";
import { useRouter } from "next/navigation";

const AddTask = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mainTasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ title: "", description: "" });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    setLoading(false);
    router.push("/");
  };
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        const data = await response.json();

        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          console.error("API did not return an array:", data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const validateInputs = () => {
    let isValid = true;
    let newErrors = { title: "", description: "" };

    if (/^\d+$/.test(title)) {
      newErrors.title = "Invalid Title";
      isValid = false;
    }
    if (!title.trim()) {
      newErrors.title = "Title Required";
      isValid = false;
    }

    if (/^\d+$/.test(description)) {
      newErrors.description = " Invalid Description";
      isValid = false;
    }
    if (!description.trim()) {
      newErrors.description = "Description Required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    if (!Array.isArray(mainTasks)) {
      console.error("mainTasks is not an array:", mainTasks);
      return;
    }
    mainTasks.forEach((task) => {
      console.log(task);
    });

    if (editTaskId !== null) {
      const Updatetask = { _id: editTaskId, title, description };
      await fetch(`/api/tasks/${editTaskId}`, {
        method: "PUT",
        body: JSON.stringify(Updatetask),
        headers: {
          "Content-Type": "application/json",
        },
      });
      fetchTasks();
      setEditTaskId(null);
    } else {
      const newTask = { title, description };
      const res = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify(newTask),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const createdTask = await res.json();
        setTasks([...mainTasks, createdTask]);
      }
    }

    setTitle("");
    setDescription("");
    setErrors({ title: "", description: "" });
  };

  const deleteTask = async (id) => {
    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    fetchTasks();
  };

  const editTask = (task) => {
    setEditTaskId(task._id);
    setTitle(task.title);
    setDescription(task.description);
  };
  const truncateDescription = (text, wordLimit = 3) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "GET",
      });

      if (response.ok) {
        router.push("/login");
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center">Task Manager</h1>

      <form onSubmit={submitHandler} className="mb-5 flex flex-wrap gap-3">
        <div className="w-full sm:w-64">
          <input
            type="text"
            className="border-2 px-3 py-2 w-full bg-gray-300 rounded-md"
            placeholder="Enter Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <p className="text-red-500 text-xs min-h-[20px]">
            {errors.title || " "}
          </p>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            className="border-2 px-3 py-2 w-full bg-gray-300 rounded-md"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="text-red-500 text-xs min-h-[20px]">
            {errors.description || " "}
          </p>
        </div>

        <button
          type="submit"
          className="bg-gray-700 text-white px-4 rounded-md font-bold py-2 h-[42px]  hover:bg-gray-950 cursor-pointer"
        >
          {editTaskId !== null ? "Update Task" : "Add Task"}
        </button>
      </form>

      <div className="bg-gray-500 p-5 rounded-lg text-amber-50 overflow-x-auto">
        {loading ? (
          <h2 className="text-center text-lg font-semibold flex items-center justify-center">
            <ImSpinner6 className="animate-spin text-2xl mr-2" />
          </h2>
        ) : mainTasks.length > 0 ? (
          <table className="w-full border-collapse border border-gray-400 text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="border border-gray-400 px-4 py-2 text-center">
                  Title
                </th>
                <th className="border border-gray-400 px-4 py-2 text-center">
                  Description
                </th>
                <th className="border border-gray-400 px-4 py-2 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {mainTasks.map((task, i) => (
                <tr key={i} className="border border-gray-400">
                  <td className="border border-gray-400 px-4 py-2 text-center">
                    {task.title}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-center relative group cursor-pointer">
                    <span>{truncateDescription(task.description)}</span>
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-200 text-black text-xs rounded-md p-2 w-48 shadow-md">
                      {task.description}
                    </div>
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-2 flex-wrap">
                    <button
                      className="bg-blue-400 hover:bg-blue-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded-md cursor-pointer"
                      onClick={() => router.push(`/tasks/${task._id}`)}
                    >
                      <MdRemoveRedEye />
                    </button>
                    <button
                      className="bg-yellow-400 hover:bg-yellow-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded-md cursor-pointer"
                      onClick={() => editTask(task)}
                    >
                      <MdEdit />
                    </button>
                    <button
                      className="bg-red-400 hover:bg-red-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded-md cursor-pointer"
                      onClick={() => deleteTask(task._id)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h2 className="text-center text-lg font-semibold">
            No Task Available
          </h2>
        )}
      </div>

 {/* login and signup buttons  */}
      {/* <button
        onClick={() => router.push("/signup")}
        className="mt-4 bg-gray-700 text-white px-3 py-2 rounded cursor-pointer hover:bg-gray-950"
      >
        Sign Up
      </button>
      <button
        onClick={() => router.push("/login")}
        type="submit"
        className="mt-4 bg-gray-700 text-white px-4 ml-2 py-2 rounded cursor-pointer hover:bg-gray-950"
      >
        Login
      </button> */}
      
      <button 
      onClick={handleLogout} 
      type="submit"
      className="mt-4 bg-gray-700 text-white px-4 ml-2 py-2 rounded cursor-pointer hover:bg-gray-950">
        Logout
      </button>
    </div>
  );
};

export default AddTask;
