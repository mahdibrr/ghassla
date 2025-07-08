"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  LogOut,
  User,
  Settings,
  ShoppingBag,
  LayoutDashboard,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import SignOutButton from "@/components/auth/sign-out-button";

interface UserProfileAvatarProps {
  inHamburgerMenu?: boolean;
  onMenuClose?: () => void;
  showStatus?: boolean;
}

export default function UserProfileAvatar({
  inHamburgerMenu = false,
  onMenuClose,
  showStatus = true,
}: UserProfileAvatarProps) {
  const { user } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const [imageError, setImageError] = useState(false);

  const handleLogout = () => {
    if (onMenuClose) {
      onMenuClose();
    }
  };

  // Get user initials for the avatar fallback
  const getInitials = () => {
    if (!user) return "U";
    const firstInitial = user.firstName
      ? user.firstName.charAt(0).toUpperCase()
      : "";
    const lastInitial = user.lastName
      ? user.lastName.charAt(0).toUpperCase()
      : "";
    return firstInitial + lastInitial || "U";
  };

  // Hide avatar/menu if user is not logged in
  if (!user) return null;

  // If in hamburger menu, show a different layout
  if (inHamburgerMenu) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center mb-4">
          <div className="mr-3">
            <Avatar showStatus={showStatus} size="lg">
              <AvatarImage
                src={user?.imageUrl || "/placeholder.svg"}
                alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
                onError={() => setImageError(true)}
              />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {user
                ? `${user.firstName || ""} ${user.lastName || ""}`
                : "Utilisateur"}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-[180px]">
              {user?.primaryEmailAddress?.emailAddress ||
                "utilisateur@example.com"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-sm text-gray-700 hover:text-[#0890F1] py-2"
            onClick={onMenuClose}
          >
            <User className="h-4 w-4" />
            <span>Tableau de bord</span>
          </Link>
          <Link
            href="/dashboard/commandes"
            className="flex items-center space-x-2 text-sm text-gray-700 hover:text-[#0890F1] py-2"
            onClick={onMenuClose}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Mes commandes</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex items-center space-x-2 text-sm text-gray-700 hover:text-[#0890F1] py-2"
            onClick={onMenuClose}
          >
            <Settings className="h-4 w-4" />
            <span>Paramètres</span>
          </Link>
          <div onClick={onMenuClose}>
            <SignOutButton />
          </div>
        </div>
      </div>
    );
  }

  // Default dropdown menu for desktop - hide on tablet
  if (isTablet && !inHamburgerMenu) {
    return null; // Hide on tablet view outside hamburger menu
  }

  // Default dropdown menu for desktop
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative p-0 h-auto w-auto rounded-full"
        >
          <Avatar showStatus={showStatus}>
            <AvatarImage
              src={user?.imageUrl || "/placeholder.svg"}
              alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
              onError={() => setImageError(true)}
            />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center gap-3 p-3">
          <Avatar size="sm" className="flex-shrink-0">
            <AvatarImage
              src={user?.imageUrl || "/placeholder.svg"}
              alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
            />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 overflow-hidden">
            <p className="text-sm font-medium leading-none truncate">
              {user
                ? `${user.firstName || ""} ${user.lastName || ""}`
                : "Utilisateur"}
            </p>
            <p className="text-xs leading-none text-gray-500 truncate">
              {user?.primaryEmailAddress?.emailAddress ||
                "utilisateur@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Tableau de bord</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/commandes"
            className="flex items-center cursor-pointer"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            <span>Mes commandes</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/profile"
            className="flex items-center cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Mon profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/settings"
            className="flex items-center cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
