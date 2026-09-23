'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education',
  'Other',
];

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Bonus',
  'Other',
];

export function FinanceDialog({
  isOpen,
  onClose,
  onSave,
  initialTransaction,
}) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (initialTransaction) {
      setType(initialTransaction.type);
      setAmount(initialTransaction.amount.toString());
      setCategory(initialTransaction.category);
      setDescription(initialTransaction.description);
      setDate(new Date(initialTransaction.created_at).toISOString().split('T')[0]);
    } else {
      resetForm();
    }
  }, [initialTransaction, isOpen]);

  useEffect(() => {
    // Reset category when type changes (if creating new)
    if (!initialTransaction) {
      setCategory('');
    }
  }, [type, initialTransaction]);

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleSave = () => {
    if (!amount || !category || !description) return;

    onSave({
      type,
      amount: parseFloat(amount),
      category,
      description,
      created_at: new Date(date),
    });

    resetForm();
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialTransaction ? 'Edit' : 'Add'} {type.charAt(0).toUpperCase() + type.slice(1)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Type + Amount share a row so the form stays short on phones */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Type</label>
              <Select value={type} onValueChange={(v) => setType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Amount (K)
              </label>
              <Input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Description
            </label>
            <Input
              placeholder="e.g., Monthly salary, Lunch"
              autoComplete="off"
              enterKeyHint="done"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!amount || !category || !description}
          >
            {initialTransaction ? 'Update' : 'Add'} Transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
