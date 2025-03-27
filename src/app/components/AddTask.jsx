"use client";
import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit, MdRemoveRedEye } from "react-icons/md";
import { useRouter } from "next/navigation";

const AddTask = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mainTasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

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

  return (
    <div className="max-w-4xl mx-auto p-5">
      <form onSubmit={submitHandler} className="mb-5 flex flex-wrap gap-3">
        <input
          type="text"
          className="border-2 px-3 py-2 w-full sm:w-64 bg-gray-300 rounded-md"
          placeholder="Enter Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          className="border-2 px-3 py-2 w-full sm:w-64 bg-gray-300 rounded-md"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button className="bg-gray-700 text-white px-4 py-2 rounded-md font-bold w-full sm:w-auto">
          {editTaskId !== null ? "Update Task" : "Add Task"}
        </button>
      </form>

      <div className="bg-gray-500 p-5 rounded-lg text-amber-50 overflow-x-auto">
        {mainTasks.length > 0 ? (
          <table className="w-full border-collapse border border-gray-400 text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="border border-gray-400 px-4 py-2 text-center">Title</th>
                <th className="border border-gray-400 px-4 py-2 text-center">Description</th>
                <th className="border border-gray-400 px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {mainTasks.map((task, i) => (
                <tr key={i} className="border border-gray-400">
                  <td className="border border-gray-400 px-4 py-2">{task.title}</td>
                  <td className="border border-gray-400 px-4 py-2">{task.description}</td>
                  <td className="border border-gray-400 px-4 py-2 flex justify-center gap-2 flex-wrap">
                    <button
                      className="bg-blue-400 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded-md"
                      onClick={() => router.push(`/tasks/${task._id}`)}
                    >
                      <MdRemoveRedEye />
                    </button>
                    <button
                      className="bg-yellow-400 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded-md"
                      onClick={() => editTask(task)}
                    >
                      <MdEdit />
                    </button>
                    <button
                      className="bg-red-400 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded-md"
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
          <h2 className="text-center text-lg font-semibold">No Task Available</h2>
        )}
      </div>
    </div>
  );
};

export default AddTask;
