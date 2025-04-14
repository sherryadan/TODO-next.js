"use client";
import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit, MdRemoveRedEye } from "react-icons/md";
import { ImSpinner6 } from "react-icons/im";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@radix-ui/react-dialog";
import toast, { Toaster } from "react-hot-toast";

const AddTask = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");
  const [description, setDescription] = useState("");
  const [mainTasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({ title: "", description: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addloading, setAddLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();

      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error("API did not return an array:", data);
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const validateInputs = (titleToValidate, descriptionToValidate) => {
    let isValid = true;
    let newErrors = { title: "", description: "" };

    if (/^\d+$/.test(titleToValidate)) {
      newErrors.title = "Invalid Title";
      isValid = false;
    }
    if (!titleToValidate.trim()) {
      newErrors.title = "Title Required";
      isValid = false;
    }

    if (/^\d+$/.test(descriptionToValidate)) {
      newErrors.description = "Invalid Description";
      isValid = false;
    }
    if (!descriptionToValidate.trim()) {
      newErrors.description = "Description Required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setLogoutLoading(false);

    const isValid = isDialogOpen
      ? validateInputs(dialogTitle, dialogDescription)
      : validateInputs(title, description);

    if (!isValid) {
      setAddLoading(false);
      return;
    }

    if (isDialogOpen && editTaskId !== null) {
      const updatedTask = {
        _id: editTaskId,
        title: dialogTitle,
        description: dialogDescription,
      };
      await fetch(`/api/tasks/${editTaskId}`, {
        method: "PUT",
        body: JSON.stringify(updatedTask),
        headers: {
          "Content-Type": "application/json",
        },
      });
      fetchTasks();
      setEditTaskId(null);
      setIsDialogOpen(false);
      toast.success("Task updated successfully!");
      setAddLoading(false);
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
        toast.success("Task added successfully!");
      } else {
        toast.error(errorData.message || "Failed to add task");
      }
    }
    setAddLoading(false);

    setTitle("");
    setDescription("");
    setDialogTitle("");
    setDialogDescription("");
    setErrors({ title: "", description: "" });
  };

  const openDeleteDialog = (task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      try {
        await fetch(`/api/tasks/${taskToDelete._id}`, {
          method: "DELETE",
        });
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskToDelete._id)
        );
        toast.success("Task deleted successfully!");
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task.");
      } finally {
        setIsDeleteDialogOpen(false);
        setTaskToDelete(null);
      }
    }
  };

  const editTask = (task) => {
    setEditTaskId(task._id);
    setDialogTitle(task.title);
    setDialogDescription(task.description);
    setIsDialogOpen(true);
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
      setLogoutLoading(true);

      if (response.ok) {
        toast.success("Logout successful!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        console.error("Failed to logout");
        toast.error("Logout failed!");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error during logout!");
    }
  };

  return (
    <div className={`max-w-4xl mx-auto p-5 mt-10`}>
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-400">
        Task Manager
      </h1>

      <form onSubmit={submitHandler} className="mb-5 flex flex-wrap gap-3">
        <div className="w-full sm:w-64">
          <input
            type="text"
            className="border-1 px-3 py-2 w-full border-violet-800 placeholder-gray-500 text-gray-400 rounded-md"
            placeholder="Enter Task Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, title: "" }));
            }}
          />
          <p className="text-red-500 text-xs min-h-[20px]">
            {errors.title || " "}
          </p>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            className="border-1 px-3 py-2 w-full border-violet-800 placeholder-gray-500 text-gray-400 rounded-md"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, description: "" }));
            }}
          />
          <p className="text-red-500 text-xs min-h-[20px]">
            {errors.description || " "}
          </p>
        </div>

        <Button
          type="submit"
          className="bg-black text-gray-300 px-4 rounded-md font-bold py-2 h-[42px]  hover:bg-violet-500 cursor-pointer"
          disabled={addloading}
        >
          {addloading ? "Adding..." : "Add Task"}
        </Button>
      </form>

      <div className=" p-2 rounded-lg text-amber-50 overflow-x-auto ">
        {loading ? (
          <h2 className="text-center text-lg font-semibold flex items-center justify-center">
            <ImSpinner6 className="animate-spin text-2xl mr-2" />
            Loading...
          </h2>
        ) : mainTasks.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 text-xs sm:text-sm">
            <thead>
              <tr className="bg-violet-400 text-gray-800">
                <th className=" border-gray-400 px-4 py-2 text-center">
                  Title
                </th>
                <th className=" border-gray-400 px-4 py-2 text-center">
                  Description
                </th>
                <th className="border-gray-400 px-4 py-2 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {mainTasks.map((task, i) => (
                <tr key={i} className="border border-gray-400">
                  <td className="border border-gray-400 px-4 py-2 text-center text-violet-400 font-semibold">
                    {task.title}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-center relative group text-violet-400">
                    <span>{truncateDescription(task.description)}</span>
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-2 flex-wrap">
                    <Button
                      className="bg-violet-400 hover:bg-violet-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded-md cursor-pointer"
                      onClick={() => router.push(`/tasks/${task._id}`)}
                    >
                      <MdRemoveRedEye />
                    </Button>
                    <Button
                      className="bg-violet-400 hover:bg-violet-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded-md cursor-pointer"
                      onClick={() => editTask(task)}
                    >
                      <MdEdit />
                    </Button>
                    <Button
                      className="bg-violet-400 hover:bg-red-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded-md cursor-pointer"
                      onClick={() => openDeleteDialog(task)}
                    >
                      <MdDelete />
                    </Button>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {isDialogOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 z-40"></div>

            {/* Dialog Content */}
            <DialogContent className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-[#1e1728] p-6 rounded-md shadow-lg w-full max-w-md">
                <DialogTitle className="text-lg font-bold text-gray-300">
                  Edit Task
                </DialogTitle>
                <form onSubmit={submitHandler} className="space-y-4">
                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Title
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full p-2 border border-gray-600 rounded-md bg-[#1e1728] text-gray-300"
                      value={dialogTitle}
                      onChange={(e) => setDialogTitle(e.target.value)}
                    />
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  </div>

                  {/* Description Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Description
                    </label>
                    <textarea
                      className="mt-1 block w-full p-2 border border-gray-600 rounded-md bg-[#1e1728] text-gray-300"
                      value={dialogDescription}
                      onChange={(e) => setDialogDescription(e.target.value)}
                    />
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                      <Button className="bg-gray-600 text-gray-300 px-4 py-2 rounded-md">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="bg-violet-500 text-white px-4 py-2 rounded-md"
                    >
                      Save
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#1e1728] p-6 rounded-md shadow-lg w-full max-w-md">
            <DialogTitle className="text-lg font-bold text-gray-300">
              Confirm Delete
            </DialogTitle>
            <p className="text-gray-400 mt-4">
              Are you sure you want to delete this task?
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <DialogClose asChild>
                <Button className="bg-gray-600 text-gray-300 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-700">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-600"
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        onClick={handleLogout}
        type="submit"
        className="bg-black text-gray-300 px-4 rounded-md font-bold py-2 h-[42px]  hover:bg-red-500 cursor-pointer mt-4"
        disabled={logoutLoading}
      >
        {logoutLoading ? "Logging out..." : "Logout"}
      </Button>
      <Button
        onClick={() => router.push("/profiledata")}
        type="submit"
        className="bg-black text-gray-300 px-4 rounded-md font-bold py-2 h-[42px]  hover:bg-red-500 cursor-pointer mt-4"
      
      >
        UserProfile
      </Button>
    </div>
  );
};

export default AddTask;
