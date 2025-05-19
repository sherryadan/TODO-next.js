"use client";
import React, { useState } from "react";
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
import { MdDelete, MdShare } from "react-icons/md";

const fetchTaskGroups = async () => {
  const res = await fetch("/api/taskgroup");
  if (!res.ok) throw new Error("Failed to fetch groups");
  return res.json();
};

const TaskGroupsPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["taskgroup"],
    queryFn: fetchTaskGroups,
  });

  const [deleteGroupId, setDeleteGroupId] = useState(null);
  const [shareGroupLink, setShareGroupLink] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const confirmDeleteGroup = async () => {
    try {
      const res = await fetch(`/api/taskgroup/${deleteGroupId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Group deleted successfully");
      queryClient.invalidateQueries(["taskgroup"]);
    } catch (err) {
      toast.error("Failed to delete group");
    } finally {
      setDeleteGroupId(null);
    }
  };

  const openShareDialog = (group) => {
    const url = `${window.location.origin}/taskgroup/share/${group._id}`;
    setShareGroupLink(url);
  };

  const copyLinkToClipboard = () => {
    if (!shareGroupLink) return;
    navigator.clipboard
      .writeText(shareGroupLink)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const openTaskListModal = (group) => {
    setSelectedGroup(group);
  };

  return (
    <div className="max-w-5xl mx-auto p-5 mt-15">
      <h1 className="text-2xl font-bold text-gray-300 mb-6 flex justify-center">
        Task Groups
      </h1>

      {isLoading ? (
        <p className="text-center text-lg text-gray-400">Loading groups...</p>
      ) : groups.length === 0 ? (
        <p className="text-center text-lg text-gray-400">
          No groups available.
        </p>
      ) : (
        <table className="w-full border text-sm bg-[#1e1728] rounded-lg shadow-lg">
          <thead>
            <tr className="bg-violet-400 text-gray-800">
              <th className="px-4 py-2 text-left">Group Name</th>
              <th className="px-4 py-2 text-center">Tasks</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr
                key={group._id}
                className="border-t border-gray-600 cursor-pointer hover:bg-[#2a1e3c]"
                onClick={() => openTaskListModal(group)}
              >
                <td className="px-4 py-2 text-violet-400">{group.name}</td>
                <td className="px-4 py-2 text-center text-gray-300">
                  {group.taskIds.length}
                </td>
                <td
                  className="px-4 py-2 text-center flex gap-2 justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    onClick={() => openShareDialog(group)}
                    className="bg-violet-500 hover:bg-violet-600 text-white px-3 py-1 rounded-md"
                  >
                    <MdShare />
                  </Button>
                  <Button
                    onClick={() => setDeleteGroupId(group._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                  >
                    <MdDelete />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Dialog
        open={!!shareGroupLink}
        onOpenChange={() => setShareGroupLink(null)}
      >
        <DialogContent className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#1e1728] p-6 rounded-md shadow-md w-full max-w-md">
            <DialogTitle className="text-lg font-bold text-gray-300">
              Share Group Link
            </DialogTitle>
            <div className="mt-4 flex flex-col gap-2">
              <input
                readOnly
                value={shareGroupLink || ""}
                className="p-2 border border-gray-600 rounded-md bg-[#1e1728] text-gray-300"
              />
              <div className="flex justify-end gap-2 mt-4">
                <DialogClose asChild>
                  <Button className="bg-gray-600 text-white px-4 py-2 rounded-md">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={copyLinkToClipboard}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md"
                >
                  Copy to Clipboard
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteGroupId}
        onOpenChange={() => setDeleteGroupId(null)}
      >
        <DialogContent className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#1e1728] p-6 rounded-md shadow-md w-full max-w-md">
            <DialogTitle className="text-lg font-bold text-gray-300">
              Confirm Delete
            </DialogTitle>
            <p className="text-gray-400 mt-4">
              Are you sure you want to delete this group?
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <DialogClose asChild>
                <Button className="bg-gray-600 text-white px-4 py-2 rounded-md">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={confirmDeleteGroup}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedGroup}
        onOpenChange={() => setSelectedGroup(null)}
      >
        <DialogContent className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#1e1728] p-6 rounded-md shadow-md w-full max-w-lg">
            <DialogTitle className="text-lg font-bold text-gray-300">
              Tasks in Group: {selectedGroup?.name}
            </DialogTitle>
            <ul className="mt-4 list-disc pl-5 text-gray-300 max-h-80 overflow-y-auto">
              {selectedGroup?.taskIds?.map((task, index) => (
                <li key={task._id || index} className="mb-1">
                  {task.title
                    ? ` ${task.title}`
                    : `Task ID: ${task._id || "Unknown"}`}
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <DialogClose asChild>
                <Button className="bg-gray-600 text-white px-4 py-2 rounded-md">
                  Close
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskGroupsPage;
