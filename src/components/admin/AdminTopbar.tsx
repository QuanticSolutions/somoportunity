import { Bell, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export function AdminTopbar() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border/50 bg-card px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <span className="text-sm font-medium text-muted-foreground">
          Somopportunity Admin
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-1.5">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{profile?.full_name || "Admin"}</span>
          <Badge variant="secondary" className="text-xs capitalize">
            {profile?.role}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
