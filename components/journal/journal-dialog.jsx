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
import { X } from "lucide-react";

export function JournalDialog({ isOpen, onClose, onSave, initialEntry }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (initialEntry) {
      setTitle(initialEntry.title);
      setContent(initialEntry.content);
      setMood(initialEntry.mood || "");
      setTags(initialEntry.tags || []);
      setNewTag("");
    } else {
      resetForm();
    }
  }, [initialEntry, isOpen]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setMood("");
    setTags([]);
    setNewTag("");
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.toLowerCase())) {
      setTags([...tags, newTag.toLowerCase()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    onSave({
      title,
      content,
      mood,
      tags,
    });

    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialEntry ? "Edit Entry" : "New Journal Entry"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 sm:space-y-6">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Title
            </label>
            <Input
              placeholder="e.g., My first day of coding"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Content
            </label>
            <Textarea
              placeholder="Write your thoughts here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[160px] sm:min-h-[200px]"
            />
          </div>

          {/* Mood */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Mood (Optional)
            </label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger>
                <SelectValue placeholder="How are you feeling?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amazing">Amazing 🌟</SelectItem>
                <SelectItem value="happy">Happy 😊</SelectItem>
                <SelectItem value="good">Good 👍</SelectItem>
                <SelectItem value="okay">Okay 😐</SelectItem>
                <SelectItem value="sad">Sad 😢</SelectItem>
                <SelectItem value="stressed">Stressed 😰</SelectItem>
                <SelectItem value="angry">Angry 😠</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Tags
            </label>
            <div className="space-y-3">
              {/* Tag Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  enterKeyHint="done"
                  autoCapitalize="none"
                />
                <Button onClick={handleAddTag} variant="outline" className="shrink-0">
                  Add
                </Button>
              </div>

              {/* Tags Display */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="inline-flex items-center gap-1 pl-3 pr-1 py-0.5 rounded-full bg-primary/20 text-primary"
                    >
                      <span className="text-sm">#{tag}</span>
                      <button
                        type="button"
                        aria-label={`Remove tag ${tag}`}
                        onClick={() => handleRemoveTag(tag)}
                        className="flex size-8 items-center justify-center rounded-full hover:opacity-70 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim()}
          >
            {initialEntry ? "Update Entry" : "Save Entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
