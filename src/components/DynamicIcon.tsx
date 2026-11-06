"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import {
  ShieldCheck,
  Shield,
  ShieldAlert,
  Lock,
  Unlock,
  Key,
  FileCheck,
  Fingerprint,
  Eye,
  Binary,
  Users,
  UserCheck,
  UserPlus,
  User,
  Crown,
  Award,
  Medal,
  Trophy,
  Star,
  Sparkles,
  Briefcase,
  Building,
  GraduationCap,
  Compass,
  Flag,
  Bookmark,
  BadgeCheck,
  Calendar,
  Clock,
  Hourglass,
  Bell,
  Flame,
  Rocket,
  Zap,
  Ticket,
  MapPin,
  Radio,
  Newspaper,
  FileText,
  BookOpen,
  Terminal,
  Activity,
  Hash,
  Megaphone,
  Send,
  Cpu,
  Globe,
  Server,
  Database,
  Code,
  Laptop,
  Monitor,
  Wifi,
  Layers,
  Network,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  Link as LinkIcon,
  HelpCircle,
} from "lucide-react";

export interface IconDefinition {
  name: string;
  label: string;
  category: "Security" | "People" | "Badges" | "Events" | "News" | "Tech" | "Actions";
}

export const AVAILABLE_ICONS: IconDefinition[] = [
  // Security & Trust
  { name: "ShieldCheck", label: "Shield Check", category: "Security" },
  { name: "Shield", label: "Shield", category: "Security" },
  { name: "ShieldAlert", label: "Shield Alert", category: "Security" },
  { name: "Lock", label: "Lock", category: "Security" },
  { name: "Unlock", label: "Unlock", category: "Security" },
  { name: "Key", label: "Key", category: "Security" },
  { name: "Fingerprint", label: "Fingerprint", category: "Security" },
  { name: "FileCheck", label: "File Check", category: "Security" },
  { name: "Eye", label: "Eye / Watch", category: "Security" },
  { name: "Binary", label: "Binary Data", category: "Security" },

  // People & Community
  { name: "Users", label: "Users / Team", category: "People" },
  { name: "UserCheck", label: "User Verified", category: "People" },
  { name: "UserPlus", label: "User Plus", category: "People" },
  { name: "User", label: "Single User", category: "People" },
  { name: "Crown", label: "Crown / Leader", category: "People" },
  { name: "GraduationCap", label: "University / Student", category: "People" },
  { name: "Briefcase", label: "Professional / Career", category: "People" },
  { name: "Building", label: "Organization", category: "People" },

  // Badges & Honors
  { name: "Award", label: "Award Ribbon", category: "Badges" },
  { name: "BadgeCheck", label: "Verified Badge", category: "Badges" },
  { name: "Medal", label: "Medal", category: "Badges" },
  { name: "Trophy", label: "Trophy", category: "Badges" },
  { name: "Star", label: "Star", category: "Badges" },
  { name: "Sparkles", label: "Sparkles / Highlights", category: "Badges" },
  { name: "Flag", label: "Flag", category: "Badges" },
  { name: "Bookmark", label: "Bookmark", category: "Badges" },

  // Calendar & Events
  { name: "Calendar", label: "Calendar", category: "Events" },
  { name: "Clock", label: "Clock", category: "Events" },
  { name: "Hourglass", label: "Hourglass", category: "Events" },
  { name: "Bell", label: "Notification Bell", category: "Events" },
  { name: "Flame", label: "Trending / Hot", category: "Events" },
  { name: "Rocket", label: "Launch / Rocket", category: "Events" },
  { name: "Zap", label: "Lightning / Speed", category: "Events" },
  { name: "Ticket", label: "Ticket / Pass", category: "Events" },
  { name: "MapPin", label: "Location Pin", category: "Events" },
  { name: "Radio", label: "Live Broadcast", category: "Events" },

  // Publications & News
  { name: "Newspaper", label: "Newspaper", category: "News" },
  { name: "FileText", label: "Article / Document", category: "News" },
  { name: "BookOpen", label: "Open Book / Guide", category: "News" },
  { name: "Terminal", label: "Terminal Console", category: "News" },
  { name: "Activity", label: "Activity / Monitor", category: "News" },
  { name: "Hash", label: "Hashtag / Topic", category: "News" },
  { name: "Megaphone", label: "Announcement", category: "News" },
  { name: "Send", label: "Send / Telegram", category: "News" },

  // Technology & Systems
  { name: "Cpu", label: "Processor / Chip", category: "Tech" },
  { name: "Globe", label: "Globe / Web", category: "Tech" },
  { name: "Server", label: "Server Rack", category: "Tech" },
  { name: "Database", label: "Database", category: "Tech" },
  { name: "Code", label: "Code Brackets", category: "Tech" },
  { name: "Laptop", label: "Laptop", category: "Tech" },
  { name: "Monitor", label: "Screen Display", category: "Tech" },
  { name: "Wifi", label: "Wireless Network", category: "Tech" },
  { name: "Layers", label: "Multi-Layers", category: "Tech" },
  { name: "Network", label: "Interconnection", category: "Tech" },

  // Actions & Arrows
  { name: "ArrowRight", label: "Arrow Right", category: "Actions" },
  { name: "ArrowUpRight", label: "External Arrow", category: "Actions" },
  { name: "ChevronRight", label: "Chevron Right", category: "Actions" },
  { name: "ExternalLink", label: "External Link", category: "Actions" },
  { name: "Link", label: "Web Link", category: "Actions" },
  { name: "Compass", label: "Navigation Compass", category: "Actions" },
];

export const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Shield,
  ShieldAlert,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  FileCheck,
  Eye,
  Binary,
  Users,
  UserCheck,
  UserPlus,
  User,
  Crown,
  GraduationCap,
  Briefcase,
  Building,
  Award,
  BadgeCheck,
  Medal,
  Trophy,
  Star,
  Sparkles,
  Flag,
  Bookmark,
  Calendar,
  Clock,
  Hourglass,
  Bell,
  Flame,
  Rocket,
  Zap,
  Ticket,
  MapPin,
  Radio,
  Newspaper,
  FileText,
  BookOpen,
  Terminal,
  Activity,
  Hash,
  Megaphone,
  Send,
  Cpu,
  Globe,
  Server,
  Database,
  Code,
  Laptop,
  Monitor,
  Wifi,
  Layers,
  Network,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  Link: LinkIcon,
  Compass,
};

interface DynamicIconProps {
  name?: string;
  className?: string;
  fallback?: React.ReactNode;
}

export default function DynamicIcon({ name, className = "w-4 h-4", fallback }: DynamicIconProps) {
  if (!name) return <>{fallback ?? <HelpCircle className={className} />}</>;

  // Check in mapped dictionary first
  const Component = ICON_MAP[name];
  if (Component) {
    return <Component className={className} />;
  }

  // Fallback to dynamic lookup from Lucide if available
  const LucideAny = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  const DynamicComp = LucideAny[name];
  if (DynamicComp) {
    return <DynamicComp className={className} />;
  }

  return <>{fallback ?? <HelpCircle className={className} />}</>;
}
