import { Badge } from "@/components/ui/badge"

interface BookingStatusBadgeProps {
  status: "confirmed" | "cancelled"
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  return (
    <Badge variant={status === "confirmed" ? "success" : "destructive"} className="capitalize">
      {status}
    </Badge>
  )
}
