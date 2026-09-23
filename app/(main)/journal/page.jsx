"use client";

import { useState, useMemo, useEffect } from "react";
import { useJournalStore } from "@/lib/store/useJournalStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, X, Loader2 } from "lucide-react";
import { JournalDialog } from "@/components/journal/journal-dialog";
import { PageHeader, FabSpacer } from "@/components/page-header";
import { RowActions } from "@/components/row-actions";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";

export default function JournalPage() {
  // Consume modular Zustand journal store
  const {
    journalEntries,
    loading,
    loadJournalEntries,
    addJournalEntry,
    editJournalEntry,
    removeJournalEntry,
  } = useJournalStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // Fetch journal entries on mount
  useEffect(() => {
    loadJournalEntries();
  }, [loadJournalEntries]);

  // Extract unique tags safely
  const allTags = useMemo(() => {
    const tags = new Set();
    (journalEntries || []).forEach((entry) => {
      (entry.tags || []).forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [journalEntries]);

  // Safe entry filtering
  const filteredEntries = useMemo(() => {
    const entriesList = journalEntries || [];
    return entriesList.filter((entry) => {
      const title = entry.title || "";
      const content = entry.content || "";
      const matchesSearch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.toLowerCase().includes(searchTerm.toLowerCase());

      const entryTags = entry.tags || [];
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => entryTags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [journalEntries, searchTerm, selectedTags]);

  // Async store handlers
  const handleCreateEntry = async (entryData) => {
    try {
      await addJournalEntry(entryData);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create journal entry:", error);
    }
  };

  const handleUpdateEntry = async (entryData) => {
    if (editingEntryId) {
      try {
        await editJournalEntry(editingEntryId, entryData);
        setEditingEntryId(null);
        setIsDialogOpen(false);
      } catch (error) {
        console.error("Failed to update journal entry:", error);
      }
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await removeJournalEntry(id);
    } catch (error) {
      console.error("Failed to delete journal entry:", error);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [tag]
    );
  };

  const totalEntriesCount = (journalEntries || []).length;

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <PageHeader
          title="Journal"
          description={`${totalEntriesCount} ${totalEntriesCount === 1 ? "entry" : "entries"} recorded`}
          action={{
            label: "New Entry",
            icon: Plus,
            onClick: () => {
              setEditingEntryId(null);
              setIsDialogOpen(true);
            },
          }}
        />

        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 pl-10 sm:h-9"
            />
          </div>

          {/* Tag Filters */}
          {allTags.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Filter by tags:
              </p>
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`shrink-0 whitespace-nowrap px-3 py-1.5 sm:py-1 text-sm rounded-full transition-colors ${
                      selectedTags.includes(tag)
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground hover:border-primary/50"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="shrink-0 whitespace-nowrap px-3 py-1.5 sm:py-1 text-sm rounded-full bg-card border border-border text-muted-foreground hover:border-primary/50 flex items-center gap-1"
                  >
                    Clear <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Entries List */}
        <div className="space-y-3 sm:space-y-4">
          {loading ? (
            <Card>
              <CardContent className="pt-12 pb-12">
                <div className="flex items-center justify-center text-muted-foreground gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <p className="text-sm">Loading journal entries...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => {
              const entryTags = entry.tags || [];
              const entryDate = entry.date || entry.created_at;

              return (
                <Card
                  key={entry.id}
                  className="hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg sm:text-xl mb-1 leading-snug break-words">
                          {entry.title}
                        </CardTitle>
                        {entryDate && (
                          <p className="text-sm text-muted-foreground">
                            {new Date(entryDate).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                      <RowActions
                        label="entry"
                        revealOnHover
                        onEdit={() => {
                          setEditingEntryId(entry.id);
                          setIsDialogOpen(true);
                        }}
                        onDelete={() => setPendingDeleteId(entry.id)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Mood Badge */}
                    {entry.mood && (
                      <div className="inline-block">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-primary/20 text-primary">
                          Mood: {entry.mood}
                        </span>
                      </div>
                    )}

                    {/* Content Preview */}
                    <p className="text-foreground line-clamp-3">
                      {entry.content}
                    </p>

                    {/* Tags */}
                    {entryTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {entryTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              if (!selectedTags.includes(tag)) {
                                setSelectedTags([...selectedTags, tag]);
                              }
                            }}
                            className="text-xs bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 px-2.5 py-1.5 sm:px-2 sm:py-1 rounded transition-colors"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    {totalEntriesCount === 0
                      ? "No journal entries yet. Start reflecting!"
                      : "No entries match your search."}
                  </p>
                  {totalEntriesCount === 0 && (
                    <Button
                      onClick={() => {
                        setEditingEntryId(null);
                        setIsDialogOpen(true);
                      }}
                    >
                      Write your first entry
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <FabSpacer />

        <ConfirmDeleteDialog
          open={pendingDeleteId !== null}
          onOpenChange={(open) => !open && setPendingDeleteId(null)}
          title="Delete this entry?"
          description="This journal entry will be permanently removed."
          onConfirm={() => {
            handleDeleteEntry(pendingDeleteId);
            setPendingDeleteId(null);
          }}
        />

        {/* Journal Dialog */}
        <JournalDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setEditingEntryId(null);
          }}
          onSave={editingEntryId ? handleUpdateEntry : handleCreateEntry}
          initialEntry={
            editingEntryId
              ? (journalEntries || []).find((e) => e.id === editingEntryId)
              : undefined
          }
        />
      </div>
    </div>
  );
}
