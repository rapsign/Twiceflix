// src/components/ui/ActionButton.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";

/**
 * Props:
 * - type: "edit" | "delete" | "view" | "custom"
 * - onClick: function
 * - label: string (optional, default sesuai type)
 * - size: "sm" | "md" | "lg" (default "sm")
 * - variant: "default" | "destructive" | "outline" | etc
 * - icon: ReactNode (optional, untuk custom icon)
 */
export default function ActionButton({
  type = "custom",
  onClick,
  label,
  size = "sm",
  variant,
  icon,
}) {
  // Pilih icon dan label default berdasarkan type
  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case "edit":
        return <Edit className="w-4 h-4" />;
      case "delete":
        return <Trash2 className="w-4 h-4" />;
      case "view":
        return <Eye className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Button
      size={size}
      variant={variant || (type === "delete" ? "destructive" : "outline")}
      onClick={onClick}
      className="flex items-center gap-1"
    >
      {getIcon()}
    </Button>
  );
}
