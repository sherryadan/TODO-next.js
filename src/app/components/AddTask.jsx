"use client";
import React, { useState } from "react";
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
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Validation schema with Zod
const taskSchema = z.object({
  title: z.string().min(1, "Title Required").regex(/^\D*$/, "Invalid Title"),
  description: z
    .string()
    .min(1, "Description Required")
    .regex(/^\D*$/, "Invalid Description"),
});

const fetchTasks = async () => {
  const res = await fetch("/api/tasks");
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

const AddTask = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: mainTasks = [], isLoading: loading } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddSubmit = async (data) => {
    setIsSaving(true);

    const res = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task added successfully!");
      setValue("title", "");
      setValue("description", "");
    } else {
      toast.error("Failed to add task");
    }

    setIsSaving(false);
  };

  const handleEditSubmit = async (data) => {
    setIsSaving(true);

    const updatedTask = {
      _id: editTaskId,
      title: data.title,
      description: data.description,
    };
    await fetch(`/api/tasks/${editTaskId}`, {
      method: "PUT",
      body: JSON.stringify(updatedTask),
      headers: {
        "Content-Type": "application/json",
      },
    });
    queryClient.invalidateQueries(["tasks"]);
    toast.success("Task updated successfully!");
    setIsSaving(false);
    setIsDialogOpen(false);
    setEditTaskId(null);
    setDialogTitle("");
    setDialogDescription("");
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
        queryClient.invalidateQueries(["tasks"]);
        toast.success("Task deleted successfully!");
      } catch (error) {
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

  return (
    <div className="max-w-4xl mx-auto p-5 mt-15">
      <form
        onSubmit={handleSubmit(handleAddSubmit)}
        className="mb-5 flex flex-wrap gap-3"
      >
        <div className="w-full sm:w-64">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <>
                <input
                  {...field}
                  type="text"
                  className="border-1 px-3 py-2 w-full border-violet-800 placeholder-gray-500 text-gray-400 rounded-md"
                  placeholder="Enter Task Title"
                />
                <p className="text-red-500 text-xs min-h-[20px]">
                  {errors.title?.message || " "}
                </p>
              </>
            )}
          />
        </div>

        <div className="w-full sm:w-64">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <>
                <input
                  {...field}
                  type="text"
                  className="border-1 px-3 py-2 w-full border-violet-800 placeholder-gray-500 text-gray-400 rounded-md"
                  placeholder="Enter Description"
                />
                <p className="text-red-500 text-xs min-h-[20px]">
                  {errors.description?.message || " "}
                </p>
              </>
            )}
          />
        </div>

        <Button
          type="submit"
          className="bg-black text-gray-300 px-4 rounded-md font-bold py-2 h-[42px] hover:bg-violet-500 cursor-pointer"
          disabled={isSubmitting || isSaving}
        >
          {isSubmitting || isSaving ? "Adding..." : "Add Task"}
        </Button>
      </form>

      <div className="p-2 rounded-lg text-amber-50 overflow-x-auto">
        {loading ? (
          <h2 className="text-center text-lg font-semibold flex items-center justify-center">
            <ImSpinner6 className="animate-spin text-2xl mr-2" />
            Loading...
          </h2>
        ) : mainTasks.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 text-xs sm:text-sm bg-[90, 16,133,0.38] border-radius-16px backdrop-filter-blur-7.2px -webkit-backdrop-filter-blur-7.2px  p-4 rounded-lg shadow-lg">
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
            <div className="fixed inset-0 bg-black/60 z-40"></div>
            <DialogContent className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-[#1e1728] p-6 rounded-md shadow-lg w-full max-w-md">
                <DialogTitle className="text-lg font-bold text-gray-300">
                  Edit Task
                </DialogTitle>
                <form
                  onSubmit={handleSubmit(handleEditSubmit)}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Title
                    </label>
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="mt-1 block w-full p-2 border border-gray-600 rounded-md bg-[#1e1728] text-gray-300"
                          value={dialogTitle}
                          onChange={(e) => setDialogTitle(e.target.value)}
                        />
                      )}
                    />
                    <p className="text-red-500 text-xs mt-1">
                      {errors.title?.message}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Description
                    </label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          className="mt-1 block w-full p-2 border border-gray-600 rounded-md bg-[#1e1728] text-gray-300"
                          value={dialogDescription}
                          onChange={(e) => setDialogDescription(e.target.value)}
                        />
                      )}
                    />
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description?.message}
                    </p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                      <Button className="bg-gray-600 text-gray-300 px-4 py-2 rounded-md cursor-pointer">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="bg-violet-500 text-white px-4 py-2 rounded-md cursor-pointer"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save"}
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
    </div>
  );
};

export default AddTask;
