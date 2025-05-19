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

const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title Required")
    .regex(/^[^\d]*$/, "Invalid Title"),
  description: z
    .string()
    .min(1, "Description Required")
    .regex(/^[^\d]*$/, "Invalid Description"),
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
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "", description: "" },
  });

  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    formState: { errors: editErrors, isSubmitting: isEditSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "", description: "" },
  });

  const [editTaskId, setEditTaskId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [isGroupNameDialogOpen, setIsGroupNameDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [isGroupCreating, setIsGroupCreating] = useState(false);

  const handleAddSubmit = async (data) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task added successfully!");
      reset();
    } else {
      toast.error("Failed to add task");
    }
  };

  const openEditDialog = (task) => {
    setEditTaskId(task._id);
    resetEditForm({ title: task.title, description: task.description });
    setIsDialogOpen(true);
  };

  const handleEditSave = async (data) => {
    await fetch(`/api/tasks/${editTaskId}`, {
      method: "PUT",
      body: JSON.stringify({ _id: editTaskId, ...data }),
      headers: { "Content-Type": "application/json" },
    });

    queryClient.invalidateQueries(["tasks"]);
    toast.success("Task updated successfully!");
    setIsDialogOpen(false);
    setEditTaskId(null);
  };

  const openDeleteDialog = (task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`/api/tasks/${taskToDelete._id}`, { method: "DELETE" });
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task deleted successfully!");
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const truncateDescription = (text, wordLimit = 3) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const toggleTaskSelection = (taskId) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) newSelected.delete(taskId);
    else newSelected.add(taskId);
    setSelectedTasks(newSelected);
  };

  const toggleCreateGroup = () => {
    if (selectedTasks.size === 0) {
      toast.error("Please select at least one task");
      return;
    }
    setIsGroupNameDialogOpen(true);
  };

  const handleGroupNameSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      toast.error("Group name is required");
      return;
    }

    setIsGroupCreating(true);

    try {
      // Step 1: Create the group
      const response = await fetch("/api/taskgroup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: groupName,
          tasks: Array.from(selectedTasks),
        }),
      });

      const data = await response.json();
      const groupId = data.groupId;

      if (!groupId) {
        console.error("Group ID not returned");
        toast.error("Failed to create group");
        setIsGroupCreating(false);
        return;
      }

      // Step 2: Update each selected task with this groupId
      for (const taskId of selectedTasks) {
        const res = await fetch("/api/taskaddgroup", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskId, groupId }),
        });

        if (!res.ok) {
          toast.error(`Failed to add task ${taskId} to group`);
          setIsGroupCreating(false);
          return;
        }
      }

      toast.success(
        `Group "${groupName}" created with ${selectedTasks.size} tasks!`
      );
      setIsGroupNameDialogOpen(false);
      setIsCreatingGroup(false);
      setSelectedTasks(new Set());
      setGroupName("");
      queryClient.invalidateQueries(["tasks"]);
    } catch (err) {
      toast.error("Failed to create group");
    } finally {
      setIsGroupCreating(false);
    }
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
                  placeholder="Enter Task Title"
                  className="border px-3 py-2 w-full border-violet-800 text-gray-400 rounded-md"
                />
                <p className="text-red-500 text-xs min-h-[20px]">
                  {errors.title?.message}
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
                  placeholder="Enter Description"
                  className="border px-3 py-2 w-full border-violet-800 text-gray-400 rounded-md"
                />
                <p className="text-red-500 text-xs min-h-[20px]">
                  {errors.description?.message}
                </p>
              </>
            )}
          />
        </div>
        <Button
          type="submit"
          className="bg-black text-gray-300 px-4 font-bold py-2 rounded-md hover:bg-violet-500 cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Task"}
        </Button>
      </form>

      <div className="p-2 rounded-lg overflow-x-auto">
        {loading ? (
          <div className="text-center flex justify-center items-center text-lg">
            <ImSpinner6 className="animate-spin mr-2" /> Loading...
          </div>
        ) : mainTasks.length > 0 ? (
          <table className="w-full border text-sm bg-[#1e1728] rounded-lg shadow-lg">
            <thead>
              <tr className="bg-violet-400 text-gray-800">
                {isCreatingGroup && (
                  <th className="px-4 py-2">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTasks(
                            new Set(mainTasks.map((t) => t._id))
                          );
                        } else {
                          setSelectedTasks(new Set());
                        }
                      }}
                      checked={selectedTasks.size === mainTasks.length}
                    />
                  </th>
                )}
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mainTasks.map((task) => (
                <tr
                  key={task._id}
                  className="border-t divide-x border-gray-600"
                >
                  {isCreatingGroup && (
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedTasks.has(task._id)}
                        onChange={() => toggleTaskSelection(task._id)}
                      />
                    </td>
                  )}
                  <td className="px-4 py-2 text-violet-400 text-center">
                    {task.title}
                  </td>
                  <td className="px-4 py-2 text-violet-400 text-center">
                    {truncateDescription(task.description)}
                  </td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <Button
                      onClick={() => router.push(`/tasks/${task._id}`)}
                      className="bg-violet-400 hover:bg-violet-600 text-white text-xs px-3 py-1 rounded-md cursor-pointer"
                      disabled={isCreatingGroup}
                    >
                      <MdRemoveRedEye />
                    </Button>
                    <Button
                      onClick={() => openEditDialog(task)}
                      className="bg-violet-400 hover:bg-violet-600 text-white text-xs px-3 py-1 rounded-md cursor-pointer"
                      disabled={isCreatingGroup}
                    >
                      <MdEdit />
                    </Button>
                    <Button
                      onClick={() => openDeleteDialog(task)}
                      className="bg-violet-400 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-md cursor-pointer"
                      disabled={isCreatingGroup}
                    >
                      <MdDelete />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-lg font-semibold">No Task Available</p>
        )}
      </div>

      {mainTasks.length > 0 && (
        <div className="mt-4 flex items-center gap-3">
          {!isCreatingGroup ? (
            <Button
              onClick={() => setIsCreatingGroup(true)}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-md font-semibold shadow-lg"
            >
              Create Group
            </Button>
          ) : (
            <>
              <Button
                onClick={toggleCreateGroup}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold shadow-lg"
              >
                Done
              </Button>
              <Button
                onClick={() => {
                  setIsCreatingGroup(false);
                  setSelectedTasks(new Set());
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-semibold shadow-lg"
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#1e1728] p-6 rounded-md shadow-md w-full max-w-md">
            <DialogTitle className="text-lg font-bold text-gray-300">
              Edit Task
            </DialogTitle>
            <form
              onSubmit={handleEditSubmit(handleEditSave)}
              className="space-y-4 mt-4"
            >
              <div>
                <Controller
                  name="title"
                  control={editControl}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full p-2 border border-gray-600 rounded-md bg-[#1e1728] text-gray-300"
                    />
                  )}
                />
                <p className="text-red-500 text-xs">
                  {editErrors.title?.message}
                </p>
              </div>
              <div>
                <Controller
                  name="description"
                  control={editControl}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="w-full p-2 border border-gray-600 rounded-md bg-[#1e1728] text-gray-300"
                    />
                  )}
                />
                <p className="text-red-500 text-xs">
                  {editErrors.description?.message}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button className="bg-gray-600 text-white px-4 py-2 rounded-md cursor-pointer">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-violet-500 text-white px-4 py-2 rounded-md cursor-pointer"
                  disabled={isEditSubmitting}
                >
                  {isEditSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#1e1728] p-6 rounded-md shadow-md w-full max-w-md">
            <DialogTitle className="text-lg font-bold text-gray-300">
              Confirm Delete
            </DialogTitle>
            <p className="text-gray-400 mt-4">
              Are you sure you want to delete this task?
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <DialogClose asChild>
                <Button className="bg-gray-600 text-white px-4 py-2 rounded-md">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isGroupNameDialogOpen}
        onOpenChange={setIsGroupNameDialogOpen}
      >
        <DialogContent className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#1e1728] p-6 rounded-md shadow-md w-full max-w-md">
            <DialogTitle className="text-lg font-bold text-gray-300">
              Name Your Group
            </DialogTitle>
            <form onSubmit={handleGroupNameSubmit} className="mt-4 space-y-4">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                className="w-full p-2 border border-gray-600 rounded-md bg-[#1e1728] text-gray-300"
              />
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="bg-gray-600 text-white px-4 py-2 rounded-md"
                    onClick={() => setGroupName("")}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-violet-500 text-white px-4 py-2 rounded-md"
                >
                  Create Group
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddTask;
