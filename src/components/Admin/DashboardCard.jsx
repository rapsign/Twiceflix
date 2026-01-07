// src/components/Admin/DashboardCard.jsx
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardCard({ to, icon: Icon, count, label }) {
  return (
    <Link to={to}>
      <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
            <Icon className="h-6 w-6 text-red-500" />
          </div>

          <div>
            <p className="text-2xl font-bold text-white">{count}</p>
            <p className="text-sm text-zinc-400">{label}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
