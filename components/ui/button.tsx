import type React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  isCircular?: boolean
}

export function Button({
  variant = "primary",
  size = "default",
  className,
  isCircular = false,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed",
    ghost:
      "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed",
  }

  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1 text-xs",
    lg: "px-5 py-3 text-base",
    icon: "p-2",
  }

  const circularClass = isCircular ? "rounded-full" : "rounded-md"

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${circularClass}
        ${className || ""}
        font-medium
      `}
      {...props}
    >
      {children}
    </button>
  )
}

