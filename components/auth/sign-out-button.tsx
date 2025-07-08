"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Minimal logout button: disconnects user and redirects to home page
export default function SignOutButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      // Fallback to window.location if router fails
      window.location.href = "/";
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleSignOut}
      type="button"
      form={undefined}
      formAction={undefined}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Déconnexion
    </Button>
  );
}
