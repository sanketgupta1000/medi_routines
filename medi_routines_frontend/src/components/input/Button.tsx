import React from 'react'

// a general button compoent
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>
{
    type?: "button" | "submit",
    onClick?: (e: React.MouseEvent<HTMLButtonElement>|null) => void,
    children: React.ReactNode,
    className?: string,
    disabled?: boolean,
    loading?: boolean,
}

function Button({
    type = "button",
    onClick=() => {},
    children,
    className = "",
    disabled = false,
    loading = false,
    ...rest
}: ButtonProps)
{
    return (        <button
            type={type}
            onClick={onClick}
            className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ${className}`}
            disabled={disabled || loading}
            {...rest}
        >
            {loading ? "..." : children}
        </button>

    );
}

export default Button;
export type { ButtonProps };