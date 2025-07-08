"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import UserProfileAvatar from "@/components/user-profile-avatar";
import { useUser } from "@clerk/nextjs";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const headerRef = useRef<HTMLElement>(null);
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled past threshold
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }

      // Calculate scroll progress
      const windowHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolledY = window.scrollY;
      const progress = windowHeight > 0 ? (scrolledY / windowHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);

    // Call once to set initial state
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    if (isDesktop) {
      setMobileMenuOpen(false);
    }
  }, [isDesktop]);

  // Navigation items for unauthenticated users only
  const navItems = [
    {
      label: "Comment ça fonctionne",
      href: "/#how-it-works",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    { label: "Prix et services", href: "/prix-et-services", icon: null },
    { label: "À propos de nous", href: "/about", icon: null },
    { label: "Pour les entreprises", href: "/#business", icon: null },
  ];

  const isHomePage = pathname === "/";
  const bgColor = !isHomePage || scrolled ? "bg-white" : "bg-[#0890F1]";
  const textColor = !isHomePage || scrolled ? "text-[#0890F1]" : "text-white";
  const logoTextColor =
    !isHomePage || scrolled ? "text-gray-900" : "text-white";

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 w-full",
        bgColor,
        scrolled && "shadow-md",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center group">
              <Heart
                className={`h-8 w-8 ${textColor} group-hover:scale-110 transition-transform`}
              />
              <span className={`ml-2 text-xl font-bold ${logoTextColor}`}>
                8assla
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Only visible on large screens */}
          <nav className="hidden lg:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-all text-sm ${
                  pathname === item.href
                    ? `bg-opacity-20 bg-white ${textColor} font-semibold`
                    : textColor
                } nav-item-hover relative px-3 py-2 rounded-md hover:bg-white hover:bg-opacity-10`}
              >
                <span className="flex items-center">
                  {item.icon}
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* CTA Buttons or User Avatar */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoaded && !isSignedIn && (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className={`border ${textColor} border-[#0890F1] hover:bg-gray-100/10 font-medium transition-colors text-sm`}
                  >
                    Se connecter
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="ghost"
                    className={`border ${textColor} border-[#0890F1] hover:bg-gray-100/10 font-medium transition-colors text-sm`}
                  >
                    S'inscrire
                  </Button>
                </Link>
              </>
            )}
            {isLoaded && isSignedIn && <UserProfileAvatar />}
          </div>

          {/* Hamburger Menu Button - Visible on medium screens and down */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              className={`${textColor} p-2 rounded-md hover:bg-opacity-10 hover:bg-gray-200`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#FFD06D] to-[#0890F1] transition-all duration-300 ease-out scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Mobile/Tablet Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 lg:hidden",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Mobile/Tablet Menu Panel */}
      <div
        className={cn(
          "lg:hidden fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="p-6 flex-1 flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart className="h-8 w-8 text-[#0890F1]" />
              <span className="ml-2 text-2xl font-bold text-gray-900">
                8assla
              </span>
            </Link>
            <button
              type="button"
              className="text-gray-700 p-2 rounded-full hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 mb-8">
            <p className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-2 pl-4">
              Navigation
            </p>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center py-3 px-4 text-gray-700 hover:bg-[#0890F1]/10 hover:text-[#0890F1] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon || (
                  <ChevronRight className="h-4 w-4 mr-2 text-[#0890F1]" />
                )}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* CTA Buttons / User Actions */}
          <div className="space-y-4 mt-auto">
            <p className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-2 pl-4">
              Actions
            </p>
            {isLoaded && !isSignedIn && (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Se connecter
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="bg-[#0890F1] hover:bg-[#0780d8] text-white w-full">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
            {isLoaded && isSignedIn && (
              <UserProfileAvatar
                inHamburgerMenu={true}
                onMenuClose={() => setMobileMenuOpen(false)}
              />
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500 text-center">
              © 2023 8assla. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
