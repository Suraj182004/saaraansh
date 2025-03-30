'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function NavLink({
    href,
    children,
    className,
    onClick,
}: {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    const pathname = usePathname();
    const isActive = pathname === href || (href !== "/" && pathname.startsWith(href)) || (href === "/" && pathname === "/");
    
    return (
        <Link 
            href={href} 
            className={cn(
                "transition-colors text-sm duration-200 hover:text-indigo-600", 
                className, 
                isActive ? "text-indigo-600 font-medium" : "text-gray-600"
            )}
            onClick={onClick}
        >
            {children}
        </Link>
    );
}
