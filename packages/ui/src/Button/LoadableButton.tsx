import { Button } from "./Button";
import type { LoadableButtonProps } from "./types";

export function LoadableButton({ loading, children, ...props }: LoadableButtonProps) {
	return <Button {...props}>{loading ? "Loading..." : children}</Button>;
}

