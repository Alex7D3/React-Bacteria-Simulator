import { useEffect } from "react";

export default function useKeyPress(callback: (...args: any[]) => void, keyPressed: string, condition?: boolean) {
	useEffect(() => {
    if(!(condition ?? true)) return;
		const keyPressHandler = (event: KeyboardEvent): void => {
			if (event.code === keyPressed) {
				event.preventDefault();
				callback();
			}
		};
		window.addEventListener("keydown", keyPressHandler);

		return () => window.removeEventListener("keydown", keyPressHandler);
	}, [callback, keyPressed, condition]);
}