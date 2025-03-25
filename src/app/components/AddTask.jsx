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


  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);


  const submitHandler = async (e) => {
    e.preventDefault();

    if (editTaskId !== null) {

      const res = await fetch("/api/tasks", {
        method: "PUT",
        body: JSON.stringify({ id: editTaskId, title, description }),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        setTasks(mainTasks.map((task) => (task.id === editTaskId ? updatedTask : task)));
        setEditTaskId(null); 
      }
    } else {
      const newTask = { title, description };
      const res = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify(newTask),
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
    await fetch("/api/tasks", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    setTasks(mainTasks.filter((task) => task.id !== id));
  };


  const editTask = (task) => {
    setEditTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
  };

  return (
    <div className="gap-2 p-5">
      <form onSubmit={submitHandler} className="mb-5">
        <input
          type="text"
          className="border-2 px-3 py-2 mr-3 w-64"
          placeholder="Enter Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          className="border-2 px-3 py-2 mr-3 w-64"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="bg-black text-white px-4 py-2 font-bold rounded-sm">
          {editTaskId !== null ? "Update Task" : "Add Task"}
        </button>
      </form>

      <div className="bg-gray-200 p-5 rounded-lg">
        {mainTasks.length > 0 ? (
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-500 text-white">
                <th className="border border-gray-400 px-4 py-2 text-left">Title</th>
                <th className="border border-gray-400 px-4 py-2 text-left">Description</th>
                <th className="border border-gray-400 px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {mainTasks.map((task, i) => (
                <tr key={i} className="border border-gray-400">
                  <td className="border border-gray-400 px-4 py-2">{task.title}</td>
                  <td className="border border-gray-400 px-4 py-2">{task.description}</td>
                  <td className="border border-gray-400 px-4 py-2">
                    <button
                      className="bg-blue-100 text-black px-3 py-1 rounded-sm mr-2"
                      onClick={() => router.push(`/tasks/${task.id}`)}
                    >
                      <MdRemoveRedEye />
                    </button>
                    <button
                      className="bg-blue-300 text-white px-3 py-1 rounded-sm mr-2"
                      onClick={() => editTask(task)}
                    >
                      <MdEdit />
                    </button>
                    <button
                      className="bg-red-800 text-white px-3 py-1 rounded-sm"
                      onClick={() => deleteTask(task.id)}
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
