// CustomDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface CustomDropdownProps {
  triggerContent: React.ReactNode;
  children: React.ReactNode;
  className?: string
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ triggerContent, children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => setIsOpen(false);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="inline-block" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="border px-1 text-center border-dotted">
        {triggerContent}
      </button>
      {isOpen && (
        <div
          className={twMerge(
            "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          style={{
            transform: "translate(-50%, -100%)",
            marginBottom: "8px",
            outline: "none",
            pointerEvents: "auto",
          }}
          data-state={isOpen ? "open" : "closed"}
          role="menu"
          aria-orientation="vertical"
          tabIndex={-1}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
