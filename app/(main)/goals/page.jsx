'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ListChecks } from 'lucide-react';
import { PageHeader, FabSpacer } from '@/components/page-header';
import { RowActions } from '@/components/row-actions';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';

import { GoalDialog } from '@/components/goals/goal-dialog';
import { ManageMilestonesDialog } from '@/components/goals/manageMilestonesDialog';

import * as goalsService from '@/lib/services/goalsService';
import * as milestonesService from '@/lib/services/milestonesService';
import * as tasksService from '@/lib/services/tasksService';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog State Management
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [selectedGoalForEdit, setSelectedGoalForEdit] = useState(null);

  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
  const [selectedGoalForMilestones, setSelectedGoalForMilestones] = useState(null);
  const [pendingDeleteGoalId, setPendingDeleteGoalId] = useState(null);

  // Load goals on mount
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await goalsService.fetchGoals();
      setGoals(data || []);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Goal CRUD Handlers ---

  const handleOpenCreateGoal = () => {
    setSelectedGoalForEdit(null);
    setIsGoalDialogOpen(true);
  };

  const handleOpenEditGoal = (goal) => {
    setSelectedGoalForEdit(goal);
    setIsGoalDialogOpen(true);
  };

  const handleSaveGoal = async (goalData) => {
    try {
      if (goalData.id) {
        await goalsService.updateGoal(goalData.id, goalData);
      } else {
        const newGoal = await goalsService.createGoal(goalData);
        // Prompt user immediately to manage milestones for the newly created goal
        setSelectedGoalForMilestones(newGoal);
        setIsMilestoneDialogOpen(true);
      }
      await loadGoals();
    } catch (error) {
      console.error('Failed to save goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await goalsService.deleteGoal(goalId);
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  // --- Milestone & Task Handlers for ManageMilestonesDialog ---

  const handleOpenMilestonesDialog = (goal) => {
    setSelectedGoalForMilestones(goal);
    setIsMilestoneDialogOpen(true);
  };

  const handleAddMilestone = async (goalId, title) => {
    try {
      const createdMilestone = await milestonesService.createMilestone({
        goal_id: goalId,
        title,
      });

      // Update state locally so UI refreshes immediately
      setSelectedGoalForMilestones((prev) => ({
        ...prev,
        milestones: [...(prev.milestones || []), { ...createdMilestone, tasks: [] }],
      }));
      await loadGoals();
    } catch (error) {
      console.error('Failed to add milestone:', error);
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    try {
      await milestonesService.deleteMilestone(milestoneId);

      setSelectedGoalForMilestones((prev) => ({
        ...prev,
        milestones: prev.milestones.filter((m) => m.id !== milestoneId),
      }));
      await loadGoals();
    } catch (error) {
      console.error('Failed to delete milestone:', error);
    }
  };

  const handleAddTask = async (milestoneId, title, xp) => {
    try {
      const createdTask = await tasksService.createTask({
        milestone_id: milestoneId,
        title,
        xp
      });

      setSelectedGoalForMilestones((prev) => ({
        ...prev,
        milestones: prev.milestones.map((m) =>
          m.id === milestoneId
            ? { ...m, tasks: [...(m.tasks || []), createdTask] }
            : m
        ),
      }));
      await loadGoals();
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleToggleTask = async (taskId, isCompleted) => {
    try {
      await tasksService.updateTask(taskId, { is_completed: isCompleted });

      setSelectedGoalForMilestones((prev) => ({
        ...prev,
        milestones: prev.milestones.map((m) => ({
          ...m,
          tasks: (m.tasks || []).map((t) =>
            t.id === taskId ? { ...t, is_completed: isCompleted } : t
          ),
        })),
      }));
      await loadGoals();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await tasksService.deleteTask(taskId);

      setSelectedGoalForMilestones((prev) => ({
        ...prev,
        milestones: prev.milestones.map((m) => ({
          ...m,
          tasks: (m.tasks || []).filter((t) => t.id !== taskId),
        })),
      }));
      await loadGoals();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        compact
        title="My Goals"
        description="Track and structure your long-term progress."
        action={{ label: 'Create Goal', icon: Plus, onClick: handleOpenCreateGoal }}
        className="sm:mb-6"
      />

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading goals...</p>
      ) : goals.length === 0 ? (
        <div className="text-center p-8 sm:p-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No goals found. Create your first goal to get started.</p>
          <Button onClick={handleOpenCreateGoal}>Create Goal</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <div key={goal.id} className="border rounded-lg p-4 bg-card shadow-sm flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-lg break-words min-w-0">{goal.title}</h3>
                  <span className="shrink-0 text-xs px-2 py-1 rounded bg-secondary uppercase font-medium">
                    {goal.type}
                  </span>
                </div>
                {goal.description && (
                  <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-3 text-xs text-muted-foreground">
                  <span>Category: {goal.category}</span>
                  <span>•</span>
                  <span>Priority: {goal.priority}</span>
                  {goal.due_date && (
                    <>
                      <span>•</span>
                      <span>Due: {new Date(goal.due_date).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center gap-2 mt-6 pt-3 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-xs h-10 sm:h-8"
                  onClick={() => handleOpenMilestonesDialog(goal)}
                >
                  <ListChecks className="w-3.5 h-3.5" />
                  Milestones ({goal.milestones?.length || 0})
                </Button>

                <RowActions
                  label="goal"
                  onEdit={() => handleOpenEditGoal(goal)}
                  onDelete={() => setPendingDeleteGoalId(goal.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <FabSpacer />

      <ConfirmDeleteDialog
        open={pendingDeleteGoalId !== null}
        onOpenChange={(open) => !open && setPendingDeleteGoalId(null)}
        title="Delete this goal?"
        description="This goal will be permanently removed."
        onConfirm={() => {
          handleDeleteGoal(pendingDeleteGoalId);
          setPendingDeleteGoalId(null);
        }}
      />

      {/* Modal 1: Basic Goal Metadata */}
      <GoalDialog
        isOpen={isGoalDialogOpen}
        onClose={() => setIsGoalDialogOpen(false)}
        onSave={handleSaveGoal}
        initialGoal={selectedGoalForEdit}
      />

      {/* Modal 2: Independent Milestone & Sub-Task Breakdowns */}
      <ManageMilestonesDialog
        isOpen={isMilestoneDialogOpen}
        onClose={() => {
          setIsMilestoneDialogOpen(false);
          setSelectedGoalForMilestones(null);
        }}
        goal={selectedGoalForMilestones}
        milestones={selectedGoalForMilestones?.milestones || []}
        onAddMilestone={handleAddMilestone}
        onDeleteMilestone={handleDeleteMilestone}
        onAddTask={handleAddTask}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}