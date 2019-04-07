import * as React from "react";
import {
	Paper,
	Grid,
	Typography,
	createStyles,
	Theme,
	WithStyles,
	withStyles
} from "@material-ui/core";
import { getDate, isSameMonth, isToday, addMonths } from "date-fns";
import { chunks } from "../utils";
import Header from "./Header";
import Day from "./Day";
import { NavigationAction, Setter } from "../types";

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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

interface MonthProps extends WithStyles<typeof styles> {
	value: Date;
	marker: symbol;
	setDate: (date: Date) => void;
	functions: {
		getDaysInMonth: (date: Date) => ReadonlyArray<Date>;
		inHoverRange: (date: Date) => boolean;
		inDateRange: (date: Date) => boolean;
		isStartOfRange: (date: Date) => boolean;
		isEndOfRange: (date: Date) => boolean;
		matchEnds: (date: Date) => boolean;
		onNavigate: (marker: symbol, action: NavigationAction) => void;
		canNavigate: (marker: symbol) => [boolean, boolean]
		handleClick: (date: Date) => void;
		onHover: (date: Date) => void;
	};
}

const Month: React.FunctionComponent<MonthProps> = props => {
	const { classes, functions: fns, value: date, marker, setDate } = props;
	const [back, forward] = fns.canNavigate(marker);
	return (
		<Paper square elevation={0} className={classes.root}>
			<Grid container>
				<Header
					date={date}
					setDate={setDate}
					nextDisabled={!forward}
					prevDisabled={!back}
					onClickPrevious={() => fns.onNavigate(marker, NavigationAction.Previous)}
					onClickNext={() => fns.onNavigate(marker, NavigationAction.Next)}
				/>

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
					{chunks(fns.getDaysInMonth(date), 7).map((week, idx) => (
						<Grid key={idx} container direction="row" justify="center">
							{week.map((day, dayIdx) => (
								<Day
									key={dayIdx}
									filled={fns.matchEnds(day)}
									outlined={isToday(day)}
									highlighted={fns.inDateRange(day) || fns.inHoverRange(day)}
									disabled={!isSameMonth(date, day)}
									startOfRange={fns.isStartOfRange(day)}
									endOfRange={fns.isEndOfRange(day)}
									onClick={() => fns.handleClick(day)}
									onHover={() => fns.onHover(day)}
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
