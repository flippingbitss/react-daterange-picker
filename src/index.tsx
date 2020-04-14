import * as React from "react";
import {
	addMonths,
	isSameDay,
	isWithinRange,
	isAfter,
	isBefore,
	isSameMonth,
	addYears,
	max,
	min
} from "date-fns";
import { DateRange, NavigationAction, DefinedRange } from "./types";
import Menu from "./components/Menu";
import { defaultRanges } from "./defaults";
import { parseOptionalDate } from "./utils";

type Marker = symbol;

export const MARKERS: { [key: string]: Marker } = {
	FIRST_MONTH: Symbol("firstMonth"),
	SECOND_MONTH: Symbol("secondMonth")
};

const getValidatedMonths = (range: DateRange, minDate: Date, maxDate: Date) => {
	let { startDate, endDate } = range;
	if (startDate && endDate) {
		const newStart = max(startDate, minDate);
		const newEnd = min(endDate, maxDate);

		return [newStart, isSameMonth(newStart, newEnd) ? addMonths(newStart, 1) : newEnd];
	} else {
		return [startDate, endDate];
	}
};

interface DateRangePickerProps {
	open: boolean;
	initialDateRange?: DateRange;
	definedRanges?: DefinedRange[];
	minDate?: Date | string;
	maxDate?: Date | string;
	onChange: (dateRange: DateRange) => void;
}

const DateRangePickerImpl: React.FunctionComponent<DateRangePickerProps> = props => {
	const today = new Date();

	const {
		open,
		onChange,
		initialDateRange,
		minDate,
		maxDate,
		definedRanges = defaultRanges
	} = props;

	const minDateValid = parseOptionalDate(minDate, addYears(today, -10));
	const maxDateValid = parseOptionalDate(maxDate, addYears(today, 10));
	const [intialFirstMonth, initialSecondMonth] = getValidatedMonths(
		initialDateRange || {},
		minDateValid,
		maxDateValid
	);

	// console.log("rendering DateRangePicker");
	const [dateRange, setDateRange] = React.useState<DateRange>({ ...initialDateRange });
	const [hoverDay, setHoverDay] = React.useState<Date>();
	const [firstMonth, setFirstMonth] = React.useState<Date>(intialFirstMonth || today);
	const [secondMonth, setSecondMonth] = React.useState<Date>(
		initialSecondMonth || addMonths(firstMonth, 1)
	);

	const { startDate, endDate } = dateRange;

	// handlers
	const setFirstMonthValidated = (date: Date) => {
		if (isBefore(date, secondMonth)) {
			setFirstMonth(date);
		}
	};

	const setSecondMonthValidated = (date: Date) => {
		if (isAfter(date, firstMonth)) {
			setSecondMonth(date);
		}
	};

	const setDateRangeValidated = (range: DateRange) => {
		let { startDate: newStart, endDate: newEnd } = range;
		if (newStart && newEnd) {
			range.startDate = newStart = max(newStart, minDateValid);
			range.endDate = newEnd = min(newEnd, maxDateValid);
			setDateRange(range);
			onChange(range);
			setFirstMonth(newStart);
			setSecondMonth(isSameMonth(newStart, newEnd) ? addMonths(newStart, 1) : newEnd);
		}
	};

	const onDayClick = (day: Date) => {
		if (startDate && !endDate && !isBefore(day, startDate)) {
			const newRange = { startDate, endDate: day };
			onChange(newRange);
			setDateRange(newRange);
		} else {
			setDateRange({ startDate: day, endDate: undefined });
		}
		setHoverDay(day);
	};

	const onMonthNavigate = (marker: Marker, action: NavigationAction) => {
		if (marker == MARKERS.FIRST_MONTH) {
			const firstNew = addMonths(firstMonth, action);
			if (isBefore(firstNew, secondMonth)) setFirstMonth(firstNew);
		} else {
			const secondNew = addMonths(secondMonth, action);
			if (isBefore(firstMonth, secondNew)) setSecondMonth(secondNew);
		}
	};

	const onDayHover = (date: Date) => {
		if (startDate && !endDate) {
			if (!hoverDay || !isSameDay(date, hoverDay)) {
				setHoverDay(date);
			}
		}
	};

	const onReset = () =>  {
		setDateRange({});
		onChange({});
	}

	// helpers
	const inHoverRange = (day: Date) => {
		return (startDate &&
			!endDate &&
			hoverDay &&
			isAfter(hoverDay, startDate) &&
			isWithinRange(day, startDate, hoverDay)) as boolean;
	};

	const helpers = {
		inHoverRange
	};

	const handlers = {
		onDayClick,
		onDayHover,
		onMonthNavigate,
		onReset
	};

	return open ? (
		<Menu
			dateRange={dateRange}
			minDate={minDateValid}
			maxDate={maxDateValid}
			ranges={definedRanges}
			firstMonth={firstMonth}
			secondMonth={secondMonth}
			setFirstMonth={setFirstMonthValidated}
			setSecondMonth={setSecondMonthValidated}
			setDateRange={setDateRangeValidated}
			helpers={helpers}
			handlers={handlers}
		/>
	) : null;
};

export { DateRange, DefinedRange } from "./types";
export const DateRangePicker = DateRangePickerImpl;
