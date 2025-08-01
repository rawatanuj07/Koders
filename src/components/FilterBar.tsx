"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface FilterBarProps {
  onSearch: (query: string) => void
  onCategoryFilter: (category: string) => void
  onModeFilter: (mode: string) => void
  selectedCategory?: string
  selectedMode?: string
}

const categories = ["All", "Music", "Tech", "Business", "Sports", "Art", "Food"]
const modes = ["All", "Online", "In-person"]

export function FilterBar({
  onSearch,
  onCategoryFilter,
  onModeFilter,
  selectedCategory = "All",
  selectedMode = "All",
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    onSearch(e.target.value)
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input placeholder="Search events..." value={searchQuery} onChange={handleSearch} className="pl-10" />
      </div>

      {/* Category Filters */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700 flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onCategoryFilter(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Mode Filters */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Event Mode</h3>
        <div className="flex flex-wrap gap-2">
          {modes.map((mode) => (
            <Badge
              key={mode}
              variant={selectedMode === mode ? "default" : "outline"}
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onModeFilter(mode)}
            >
              {mode}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
