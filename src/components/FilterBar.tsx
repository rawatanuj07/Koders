"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface FilterBarProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
  onModeFilter: (mode: string) => void;
  onStartDateFilter?: (startDate: string) => void;
  onEndDateFilter?: (endDate: string) => void;
  selectedCategory?: string;
  selectedMode?: string;
  startDate?: string; // added prop for controlled input
  endDate?: string; // added prop for controlled input
}

const categories = [
  "All",
  "Music",
  "Tech",
  "Business",
  "Sports",
  "Art",
  "Food",
];
const modes = ["All", "Online", "In-person"];

export function FilterBar({
  onSearch,
  onCategoryFilter,
  onModeFilter,
  onStartDateFilter,
  onEndDateFilter,
  selectedCategory = "All",
  selectedMode = "All",
  startDate = "",
  endDate = "",
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Synchronize searchQuery with onSearch callback
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  // Pass date changes up
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStartDateFilter?.(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onEndDateFilter?.(e.target.value);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-100 w-5 h-5" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={handleSearch}
          className="pl-10 text-gray-100"
        />
      </div>

      {/* Category Filters */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-200 flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={
                selectedCategory === category ? "destructive" : "outline"
              }
              className={`cursor-pointer hover:scale-105 transition-transform 
              ${
                selectedCategory === category ? "border-2 border-green-300" : ""
              }`}
              onClick={() => onCategoryFilter(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Mode Filters */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-300">Event Mode</h3>
        <div className="flex flex-wrap gap-2">
          {modes.map((mode) => (
            <Badge
              key={mode}
              variant={selectedMode === mode ? "default" : "outline"}
              className={`cursor-pointer hover:scale-105 transition-transform 
              ${selectedMode === mode ? "border-2 border-green-300" : ""}`}
              onClick={() => onModeFilter(mode)}
            >
              {mode}
            </Badge>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-300">Date Range</h3>
        <div className="flex gap-2 items-center">
          <div className="flex flex-col">
            <label htmlFor="start-date" className="text-xs text-gray-400 mb-1">
              From
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="end-date" className="text-xs text-gray-400 mb-1">
              To
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
