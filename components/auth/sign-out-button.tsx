"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

// Minimal logout button: disconnects user and redirects to home page
export default function SignOutButton() {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      // Use window.location.href directly to avoid Server Actions
      await signOut({
        redirectUrl: `${window.location.protocol}//${window.location.host}/`,
      });
    } catch (error) {
      console.error("Sign out error:", error);
      // Force redirect on error
      window.location.href = "/";
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleSignOut}
      type="button"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Déconnexion
    </Button>
  );
}
