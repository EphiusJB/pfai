'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit2, Check, Clock, ListChecks } from 'lucide-react';

export function ManageMilestonesDialog({
  isOpen,
  onClose,
  goal,
  milestones = [],
  onAddMilestone,
  onUpdateMilestone,
  onDeleteMilestone,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) {
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [editingMilestoneId, setEditingMilestoneId] = useState(null);
  const [editingMilestoneTitle, setEditingMilestoneTitle] = useState('');
  
  // Track separate task title and XP inputs per milestone
  const [taskInputs, setTaskInputs] = useState({});
  const [taskXpInputs, setTaskXpInputs] = useState({});

  if (!goal) return null;

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    onAddMilestone(goal.id, newMilestoneTitle);
    setNewMilestoneTitle('');
  };

  const handleStartEditMilestone = (milestone) => {
    setEditingMilestoneId(milestone.id);
    setEditingMilestoneTitle(milestone.title);
  };

  const handleSaveMilestoneTitle = (milestoneId) => {
    if (editingMilestoneTitle.trim() && onUpdateMilestone) {
      onUpdateMilestone(milestoneId, { title: editingMilestoneTitle });
    }
    setEditingMilestoneId(null);
  };

  const handleStatusChange = (milestoneId, newStatus) => {
    if (onUpdateMilestone) {
      onUpdateMilestone(milestoneId, { status: newStatus });
    }
  };

  const handleAddTask = (milestoneId) => {
    const title = taskInputs[milestoneId];
    const xp = parseInt(taskXpInputs[milestoneId] || '10', 10);

    if (!title || !title.trim()) return;

    onAddTask(milestoneId, title, xp);
    
    setTaskInputs({ ...taskInputs, [milestoneId]: '' });
    setTaskXpInputs({ ...taskXpInputs, [milestoneId]: '10' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="pr-6">
          <DialogTitle className="break-words leading-snug">Manage Milestones — {goal.title}</DialogTitle>
          <span className="inline-flex w-fit items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs font-medium">
            {goal.type === 'timed' ? <Clock className="w-3 h-3" /> : <ListChecks className="w-3 h-3" />}
            {goal.type}
          </span>
        </DialogHeader>

        <div className="space-y-5 py-2 sm:space-y-6">
          {/* Add Milestone Input */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="New milestone title..."
              value={newMilestoneTitle}
              onChange={(e) => setNewMilestoneTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMilestone()}
              enterKeyHint="done"
            />
            <Button onClick={handleAddMilestone} variant="secondary" className="w-full shrink-0 gap-1 sm:w-auto">
              <Plus className="w-4 h-4" /> Add Milestone
            </Button>
          </div>

          {/* Milestones List */}
          <div className="space-y-3 sm:space-y-4">
            {milestones.length === 0 ? (
              <p className="text-xs text-center text-muted-foreground py-4 border border-dashed rounded-lg">
                No milestones added yet. Add one above to break down your goal.
              </p>
            ) : (
              milestones.map((milestone) => (
                <div key={milestone.id} className="border rounded-lg p-3 sm:p-4 bg-card">
                  {/* Milestone Header: title on its own row on phones, status + delete below */}
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    {editingMilestoneId === milestone.id ? (
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <Input
                          value={editingMilestoneTitle}
                          onChange={(e) => setEditingMilestoneTitle(e.target.value)}
                          className="h-10 text-base sm:h-8 sm:text-sm"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label="Save milestone title"
                          onClick={() => handleSaveMilestoneTitle(milestone.id)}
                          className="h-10 w-10 shrink-0 p-0 sm:h-8 sm:w-8"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex min-w-0 items-center gap-1">
                        <h4 className="min-w-0 break-words text-sm font-semibold">{milestone.title}</h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label="Rename milestone"
                          onClick={() => handleStartEditMilestone(milestone)}
                          className="h-9 w-9 shrink-0 p-0 text-muted-foreground sm:h-6 sm:w-6"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Select
                        value={milestone.status || 'not-started'}
                        onValueChange={(status) => handleStatusChange(milestone.id, status)}
                      >
                        <SelectTrigger className="h-10 flex-1 text-xs sm:h-7 sm:w-[115px] sm:flex-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-started">Not Started</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label="Delete milestone"
                        onClick={() => onDeleteMilestone(milestone.id)}
                        className="h-10 w-10 shrink-0 p-0 text-destructive sm:h-7 sm:w-7"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Tasks in Milestone */}
                  <div className="ml-1 space-y-1 border-l pl-3 sm:ml-2 sm:space-y-2">
                    {(milestone.tasks || []).map((task) => (
                      <div key={task.id} className="flex items-start justify-between gap-2 py-0.5 text-sm sm:items-center sm:text-xs">
                        {/* The whole label is tappable, not just the 16px checkbox */}
                        <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-2.5 py-1.5 sm:items-center sm:py-1">
                          <Checkbox
                            checked={task.is_completed}
                            onCheckedChange={(checked) => onToggleTask(task.id, checked)}
                            className="mt-0.5 sm:mt-0"
                          />
                          <span className={`min-w-0 break-words ${task.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </span>
                        </label>

                        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
                          {task.xp > 0 && (
                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">
                              +{task.xp} XP
                            </span>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            aria-label="Delete task"
                            onClick={() => onDeleteTask(task.id)}
                            className="h-9 w-9 p-0 text-destructive sm:h-5 sm:w-5"
                          >
                            <Trash2 className="w-4 h-4 sm:w-3 sm:h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Inline Task Creation: title row, then XP + Add row on phones */}
                    <div className="grid grid-cols-[5rem_1fr] gap-2 pt-2 sm:flex">
                      <Input
                        placeholder="Add task title..."
                        className="col-span-2 h-10 text-base sm:h-8 sm:flex-1 sm:text-xs"
                        value={taskInputs[milestone.id] || ''}
                        onChange={(e) => setTaskInputs({ ...taskInputs, [milestone.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask(milestone.id)}
                        enterKeyHint="done"
                      />
                      <Input
                        type="number"
                        inputMode="numeric"
                        placeholder="XP"
                        aria-label="Task XP"
                        className="h-10 text-base sm:h-8 sm:w-16 sm:text-xs"
                        value={taskXpInputs[milestone.id] ?? '10'}
                        onChange={(e) => setTaskXpInputs({ ...taskXpInputs, [milestone.id]: e.target.value })}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-10 w-full gap-1 text-sm sm:h-8 sm:w-auto sm:shrink-0 sm:text-xs"
                        onClick={() => handleAddTask(milestone.id)}
                      >
                        <Plus className="w-3 h-3" /> Task
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}