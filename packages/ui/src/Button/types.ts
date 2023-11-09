import type { ComponentProps } from "react";

export interface LoadableButtonProps extends ComponentProps<"button"> {
	loading?: boolean;
}

export interface ButtonProps extends ComponentProps<"button"> {}

