import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode, memo } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

type ButtonVariant = "error" | "success" | "default";

export const Button = memo<ButtonProps>(
  ({ children, variant = "default", className, ...props }) => {
    return (
      <button
        {...props}
        type="button"
        className={clsx(
          "btn no-animation",
          className,

          variant === "success" && "hover:border-green-600 hover:bg-green-600",
          variant === "error" && "hover:border-red-600 hover:bg-red-600",
        )}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
