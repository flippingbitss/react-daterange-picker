import * as React from "react";
import {
	MuiThemeProvider,
	createMuiTheme,
	CssBaseline,
	createStyles,
	WithStyles,
	withStyles,
	Theme
} from "@material-ui/core";
import {
	addMonths,
	isSameDay,
	isWithinRange,
	isAfter,
	startOfWeek,
	startOfMonth,
	endOfWeek,
	endOfMonth,
	isBefore,
	addDays,
	isSameMonth,
	getDate,
	addWeeks
} from "date-fns";
import { DateRange, NavigationAction, DefinedRange } from "./types";
import Menu from "./components/Menu";

const theme = createMuiTheme({ typography: { useNextVariants: true } });
type Marker = symbol;

export const MARKERS: { [key: string]: Marker } = {
	FIRST_MONTH: Symbol("firstMonth"),
	SECOND_MONTH: Symbol("secondMonth")
};

const styles = (theme: Theme) =>
	createStyles({
		header: {
			padding: "20px 70px"
		},
		headerItem: {
			flex: 1
		},
		divider: {
			borderLeft: `1px solid ${theme.palette.action.hover}`,
			marginBottom: 20
		}
	});

const getRanges = (date: Date): DefinedRange[] => [
	{
		label: "Today",
		startDate: date,
		endDate: date
	},
	{
		label: "Yesterday",
		startDate: addDays(date, -1),
		endDate: addDays(date, -1)
	},
	{
		label: "This Week",
		startDate: startOfWeek(date),
		endDate: endOfWeek(date)
	},
	{
		label: "Last Week",
		startDate: startOfWeek(addWeeks(date, -1)),
		endDate: endOfWeek(addWeeks(date, -1))
	},
	{
		label: "This Month",
		startDate: startOfMonth(date),
		endDate: endOfMonth(date)
	},
	{
		label: "Last Month",
		startDate: startOfMonth(addMonths(date, -1)),
		endDate: endOfMonth(addMonths(date, -1))
	}
];

interface DateRangePickerProps extends WithStyles<typeof styles> {
	title: string;
	definedRanges?: DefinedRange[];
	dateRange?: DateRange;
	open: boolean;
	onChange: (dateRange: DateRange) => void;
}

const DateRangePickerImpl: React.FunctionComponent<DateRangePickerProps> = props => {
	// console.log("rendering DateRangePicker");
	const [dateRange, setDateRange] = React.useState<DateRange>({ ...props.dateRange });
	const [hoverDay, setHoverDay] = React.useState<Date>();
	const [firstMonth, setFirstMonth] = React.useState<Date>(
		(props.dateRange && props.dateRange.startDate) || new Date()
	);
	const [secondMonth, setSecondMonth] = React.useState<Date>(
		(props.dateRange && props.dateRange.endDate) || addMonths(firstMonth, 1)
	);

	const { startDate, endDate } = dateRange;
	const { classes, open, onChange } = props;
	const ranges = getRanges(new Date());

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
		if (range.startDate && range.endDate) {
			setDateRange(range);
			setFirstMonth(range.startDate);
			setSecondMonth(
				isSameMonth(range.startDate, range.endDate)
					? addMonths(range.startDate, 1)
					: range.endDate
			);
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
		onMonthNavigate
	};

	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			{open && (
				<Menu
					dateRange={dateRange}
					ranges={ranges}
					firstMonth={firstMonth}
					secondMonth={secondMonth}
					setFirstMonth={setFirstMonthValidated}
					setSecondMonth={setSecondMonthValidated}
					setDateRange={setDateRangeValidated}
					helpers={helpers}
					handlers={handlers}
				/>
			)}
		</MuiThemeProvider>
	);

	//return (<Typography>Hello blahblas {props.title}</Typography>);
};

export const DateRangePicker = withStyles(styles)(DateRangePickerImpl);
