import { any } from "prop-types";

export const identity = <T>(x: T) => x;

export const chunks = <T>(array: T[], size: number): T[][] => {
	return Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
		array.slice(i * size, i * size + size)
	);
};

export const combine = (...args: any[]): string => args.filter(identity).join(" ");