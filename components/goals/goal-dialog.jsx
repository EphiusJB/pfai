// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { v4 as uuidv4 } from 'uuid';
// import { Plus, Trash2 } from 'lucide-react';

// export function GoalDialog({
//   isOpen,
//   onClose,
//   onSave,
//   initialGoal,
// }) {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [category, setCategory] = useState('personal');
//   const [priority, setPriority] = useState('medium');
//   const [status, setStatus] = useState('not-started');
//   const [xp, setXp] = useState('100');
//   const [milestones, setMilestones] = useState([]);
//   const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

//   useEffect(() => {
//     if (initialGoal) {
//       setTitle(initialGoal.title);
//       setDescription(initialGoal.description || '');
//       setCategory(initialGoal.category);
//       setPriority(initialGoal.priority);
//       setStatus(initialGoal.status);
//       setXp(initialGoal.xp.toString());
//       setMilestones(initialGoal.milestones || []);
//     } else {
//       resetForm();
//     }
//   }, [initialGoal, isOpen]);

//   const resetForm = () => {
//     setTitle('');
//     setDescription('');
//     setCategory('personal');
//     setPriority('medium');
//     setStatus('not-started');
//     setXp('100');
//     setMilestones([]);
//     setNewMilestoneTitle('');
//   };

//   const handleAddMilestone = () => {
//     if (newMilestoneTitle.trim()) {
//       const newMilestone = {
//         id: uuidv4(),
//         goalId: initialGoal?.id || '',
//         title,
//         status: 'not-started',
//         xp,
//         tasks: [],
//       };
//       setMilestones([...milestones, newMilestone]);
//       setNewMilestoneTitle('');
//     }
//   };

//   const handleRemoveMilestone = (id) => {
//     setMilestones(milestones.filter((m) => m.id !== id));
//   };

//   const handleAddTask = (milestoneId) => {
//     setMilestones(
//       milestones.map((m) =>
//         m.id === milestoneId
//           ? {
//               ...m,
//               tasks: [
//                 ...m.tasks,
//                 {
//                   id: uuidv4(),
//                   milestoneId,
//                   title: 'New Task',
//                   status: 'not-started',
//                   xp, // Ensure 'xp' is defined somewhere above this function
//                 },
//               ],
//             }
//           : m
//       )
//     );
//   };
//   const handleUpdateMilestone = (id, field, value) => {
//     setMilestones(
//       milestones.map((m) => (m.id === id ? { ...m, [field]: value }: {...m} ))
//     );
//   };

//   const handleUpdateTask = (milestoneId, taskId, field, value) => {
//     setMilestones(
//       milestones.map((m) =>
//         m.id === milestoneId
//           ?? {
//               ...m,
//               tasks: m.tasks.map((t) =>
//                 t.id === taskId ?? { ...t, [field]: value } ),
//             }
//           )
//     );
//   };

//   const handleRemoveTask = (milestoneId, taskId) => {
//     setMilestones(
//       milestones.map((m) =>
//         m.id === milestoneId
//           ?? { ...m, tasks: m.tasks.filter((t) => t.id !== taskId) }
//           )
//     );
//   };

//   const handleSave = () => {
//     if (!title.trim()) return;

//     onSave({
//       title,
//       description,
//       category,
//       priority,
//       status,
//       xp: parseInt(xp) || 100,
//       milestones: milestones.map((m) => ({
//         ...m,
//         goalId: initialGoal?.id || '',
//       })),
//     });

//     resetForm();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>{initialGoal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Basic Info */}
//           <div className="space-y-4">
//             <div>
//               <label className="text-sm font-medium text-foreground block mb-2">Goal Title</label>
//               <Input
//                 placeholder="e.g., Learn JavaScript"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-foreground block mb-2">Description</label>
//               <Textarea
//                 placeholder="Optional goal description..."
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-foreground block mb-2">Category</label>
//                 <Select value={category} onValueChange={setCategory}>
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="personal">Personal</SelectItem>
//                     <SelectItem value="career">Career</SelectItem>
//                     <SelectItem value="health">Health</SelectItem>
//                     <SelectItem value="learning">Learning</SelectItem>
//                     <SelectItem value="finance">Finance</SelectItem>
//                     <SelectItem value="other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-foreground block mb-2">Priority</label>
//                 <Select value={priority} onValueChange={(v) => setPriority(v)}>
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="low">Low</SelectItem>
//                     <SelectItem value="medium">Medium</SelectItem>
//                     <SelectItem value="high">High</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-foreground block mb-2">Status</label>
//                 <Select value={status} onValueChange={(v) => setStatus(v)}>
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="not-started">Not Started</SelectItem>
//                     <SelectItem value="in-progress">In Progress</SelectItem>
//                     <SelectItem value="completed">Completed</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-foreground block mb-2">XP Reward</label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={xp}
//                   onChange={(e) => setXp(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Milestones */}
//           <div className="border-t border-border pt-4">
//             <h3 className="text-sm font-medium text-foreground mb-3">Milestones (Optional)</h3>

//             {/* Add Milestone */}
//             <div className="flex gap-2 mb-4">
//               <Input
//                 placeholder="Add milestone title..."
//                 value={newMilestoneTitle}
//                 onChange={(e) => setNewMilestoneTitle(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleAddMilestone()}
//               />
//               <Button
//                 size="sm"
//                 onClick={handleAddMilestone}
//                 variant="outline"
//                 className="gap-1"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add
//               </Button>
//             </div>

//             {/* Milestones List */}
//             <div className="space-y-3">
//               {milestones.map((milestone) => (
//                 <div key={milestone.id} className="border border-border rounded-lg p-3 bg-card/50">
//                   <div className="flex items-end gap-2 mb-3">
//                     <div className="flex-1">
//                       <label className="text-xs font-medium text-muted-foreground block mb-1">
//                         Milestone Title
//                       </label>
//                       <Input
//                         size="sm"
//                         value={milestone.title}
//                         onChange={(e) =>
//                           handleUpdateMilestone(milestone.id, 'title', e.target.value)
//                         }
//                         className="text-sm"
//                       />
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => handleRemoveMilestone(milestone.id)}
//                       className="text-destructive hover:text-destructive"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </Button>
//                   </div>

//                   {/* Tasks in Milestone */}
//                   <div className="ml-2 space-y-2 border-l border-border/50 pl-3">
//                     {milestone.tasks.map((task) => (
//                       <div key={task.id} className="flex gap-2 items-end">
//                         <Input
//                           size="sm"
//                           value={task.title}
//                           onChange={(e) =>
//                             handleUpdateTask(milestone.id, task.id, 'title', e.target.value)
//                           }
//                           placeholder="Task title"
//                           className="text-xs"
//                         />
//                         <Button
//                           size="sm"
//                           variant="ghost"
//                           onClick={() => handleRemoveTask(milestone.id, task.id)}
//                           className="text-destructive hover:text-destructive"
//                         >
//                           <Trash2 className="w-3 h-3" />
//                         </Button>
//                       </div>
//                     ))}
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       className="w-full gap-1 text-xs"
//                       onClick={() => handleAddTask(milestone.id)}
//                     >
//                       <Plus className="w-3 h-3" />
//                       Add Task
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button onClick={handleSave} disabled={!title.trim()}>
//             {initialGoal ? 'Update Goal' : 'Create Goal'}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function GoalDialog({ isOpen, onClose, onSave, initialGoal }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("checklist");
  const [category, setCategory] = useState("personal");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("not-started");
  const [dueDate, setDueDate] = useState("");
  const [xp, setXp] = useState("100");

  useEffect(() => {
    if (initialGoal) {
      setTitle(initialGoal.title || "");
      setDescription(initialGoal.description || "");
      setType(initialGoal.type || "checklist");
      setCategory(initialGoal.category || "personal");
      setPriority(initialGoal.priority || "medium");
      setStatus(initialGoal.status || "not-started");
      setDueDate(
        initialGoal.due_date ? initialGoal.due_date.split("T")[0] : ""
      );
      setXp(initialGoal.xp ? initialGoal.xp.toString() : "100");
    } else {
      resetForm();
    }
  }, [initialGoal, isOpen]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("checklist");
    setCategory("personal");
    setPriority("medium");
    setStatus("not-started");
    setDueDate("");
    setXp("100");
  };

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      ...(initialGoal?.id && { id: initialGoal.id }),
      title,
      description,
      type,
      category,
      priority,
      status,
      due_date: type === "timed" ? dueDate : null,
      xp: parseInt(xp, 10) || 100,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {initialGoal ? "Edit Goal" : "Create New Goal"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-sm font-medium block mb-1">Goal Title</label>
            <Input
              placeholder="e.g., Learn Next.js"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              Description
            </label>
            <Textarea
              placeholder="Optional details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checklist">Checklist Goal</SelectItem>
                  <SelectItem value="timed">Timed Goal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {type === "timed" && (
            <div>
              <label className="text-sm font-medium block mb-1">Due Date</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="text-sm font-medium block mb-1">
                XP Reward
              </label>
              <Input
                type="number"
                inputMode="numeric"
                min="0"
                value={xp}
                onChange={(e) => setXp(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {initialGoal ? "Update Goal" : "Save & Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
