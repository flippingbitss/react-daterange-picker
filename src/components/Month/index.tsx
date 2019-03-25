import * as React from "react";
import {
	Paper,
	Grid,
	Typography,
	createStyles,
	Theme,
	WithStyles,
	withStyles,
	IconButton
} from "@material-ui/core";
import {
	startOfMonth,
	startOfWeek,
	addWeeks,
	isBefore,
	getDate,
	addDays,
	endOfMonth,
	endOfWeek,
	addMonths,
	isSameWeek,
	isSameMonth,
	isToday,
	isSameDay,
	isWithinRange,
	isAfter
} from "date-fns";
import Header from "./components/Header";
import { chunks, combine } from "../../utils";
import Day from "./components/Day";

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface MonthProps extends WithStyles<typeof styles> {
	initialDate?: Date;
}

interface DateRange {
	startDate?: Date;
	endDate?: Date;
}

const styles = (theme: Theme) =>
	createStyles({
		root: {
			width: 290
		},
		weekDaysContainer: {
			marginTop: 10,
			paddingLeft: 30,
			paddingRight: 30
		},
		daysContainer: {
			paddingLeft: 15,
			paddingRight: 15,
			marginTop: 15,
			marginBottom: 20
		}
	});

const Month: React.FunctionComponent<MonthProps> = props => {
	const [date, setDate] = React.useState(props.initialDate || new Date());
	const [{ startDate, endDate }, setDateRange] = React.useState<DateRange>({
		startDate: new Date(2019, 3, 5),
		endDate: new Date(2019, 3, 18)
	});
	const [hoverDay, setHoverDay] = React.useState<Date>();

	const monthStart = startOfMonth(date);
	const monthEnd = endOfMonth(date);

	const startWeek = startOfWeek(monthStart);
	const endWeek = endOfWeek(monthEnd);

	const days = [];
	for (let curr = startWeek; isBefore(curr, endWeek); ) {
		days.push(curr);
		curr = addDays(curr, 1);
	}

	const matchEnds = (day: Date) => {
		return isStartofRange(day) || isEndofRange(day);
	};

	const isStartofRange = (day: Date) => startDate && isSameDay(day, startDate);
	const isEndofRange = (day: Date) => endDate && isSameDay(day, endDate);

	const inDateRange = (day: Date) => {
		return startDate && endDate && isWithinRange(day, startDate, endDate);
	};

	const inHoverRange = (day: Date) => {
		return (
			startDate &&
			!endDate &&
			hoverDay &&
			isAfter(hoverDay, startDate) &&
			isWithinRange(day, startDate, hoverDay)
		);
	};

	const handleClick = (day: Date) => {
		if (startDate && !endDate && isAfter(day, startDate)) {
			setDateRange({ startDate, endDate: day });
		} else {
			setDateRange({ startDate: day, endDate: undefined });
		}
	};

	const { classes } = props;
	return (
		<Paper elevation={5} className={classes.root}>
			<Grid container>
				<Header date={date} onChange={setDate} />

				<Grid
					item
					container
					direction="row"
					justify="space-between"
					className={classes.weekDaysContainer}>
					{WEEK_DAYS.map(day => (
						<Typography color="textSecondary" key={day} variant="caption">
							{day}
						</Typography>
					))}
				</Grid>

				<Grid
					item
					container
					direction="column"
					justify="space-between"
					className={classes.daysContainer}>
					{chunks(days, 7).map((week, idx) => (
						<Grid key={idx} container direction="row" justify="center">
							{week.map((day, dayIdx) => (
								<Day
									key={dayIdx}
									filled={matchEnds(day)}
									outlined={isToday(day)}
									highlighted={inDateRange(day) || inHoverRange(day)}
									disabled={!isSameMonth(date, day)}
									startOfRange={isStartofRange(day)}
									endOfRange={isEndofRange(day)}
									onClick={() => handleClick(day)}
									onHover={() => setHoverDay(day)}
									value={getDate(day)}
								/>
							))}
						</Grid>
					))}
				</Grid>
			</Grid>
		</Paper>
	);
};

export default withStyles(styles)(Month);
