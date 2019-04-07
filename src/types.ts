


export interface DateRange {
	startDate?: Date;
	endDate?: Date;
}

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

export enum NavigationAction {
	Previous = -1,
	Next = 1
}
