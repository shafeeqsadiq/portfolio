import Link from "next/link";
import { ThemeSwitch } from "./theme-switch";
import { metaData } from "../config";

// Define the type for nav items
type NavItem = {
  name: string;
  path: string; // Path for internal or external links
  external?: boolean; // Optional property to indicate external links
};

// Define the navigation items with proper typing
const navItems: NavItem[] = [
  { name: "Blog", path: "https://medium.com/@shafeeqsadiq", external: true },
  { name: "Projects", path: "/projects" },
  {
    name: "Resume",
    path: "https://docs.google.com/document/d/13nXyEOaNnc3sddG7Vr1udnzwWlyMwV-N/edit?usp=sharing&ouid=115254755596298504348&rtpof=true&sd=true",
    external: true,
  },
];

export function Navbar() {
  return (
    <nav className="lg:mb-16 mb-12 py-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-3xl font-semibold tracking-tight">
            {metaData.title}
          </Link>
        </div>
        <div className="flex flex-row gap-4 mt-6 md:mt-0 md:ml-auto items-center">
          {navItems.map(({ name, path, external }) =>
            external ? (
              <a
                key={name}
                href={path}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative"
              >
                {name}
              </a>
            ) : (
              <Link
                key={name}
                href={path}
                className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative"
              >
                {name}
              </Link>
            )
          )}
          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
}
