import { Badge } from "@/components/ui/badge";

interface BookingStatusBadgeProps {
  status: "confirmed" | "cancelled";
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  return (
    <Badge
      variant={status === "confirmed" ? "default" : "destructive"}
      className={`capitalize text-lg ${
        status === "confirmed"
          ? "text-green-600 border-green-600"
          : "text-red-600 border-red-600"
      }`}
    >
      {status}
    </Badge>
  );
}
