import { Facebook, Github, Instagram, Linkedin, Youtube } from "lucide-react";

export function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
  if (platform === "instagram") return <Instagram className={className} />;
  if (platform === "youtube") return <Youtube className={className} />;
  if (platform === "github") return <Github className={className} />;
  if (platform === "facebook") return <Facebook className={className} />;
  if (platform === "linkedin") return <Linkedin className={className} />;
  return <span className={className} aria-hidden="true">𝕏</span>;
}