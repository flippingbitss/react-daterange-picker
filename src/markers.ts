export type Marker = symbol;

export const MARKERS: { [key: string]: Marker } = {
	FIRST_MONTH: Symbol("firstMonth"),
	SECOND_MONTH: Symbol("secondMonth")
};
