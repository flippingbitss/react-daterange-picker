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
import { getDate, isSameMonth, isToday } from "date-fns";
import Header from "./components/Header";
import { chunks } from "../../utils";
import Day from "./components/Day";

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface MonthProps extends WithStyles<typeof styles> {
	initialDate?: Date;
	functions: {
		inHoverRange: (date: Date) => boolean;
		inDateRange: (date: Date) => boolean;
		isStartOfRange: (date: Date) => boolean;
		isEndOfRange: (date: Date) => boolean;
		matchEnds: (date: Date) => boolean;
		setHoverDay: React.Dispatch<React.SetStateAction<Date | undefined>>;
		getDaysInMonth: (date: Date) => ReadonlyArray<Date>;
		handleClick: (date: Date) => void;
	};
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
	const { classes, functions: fns } = props;
	return (
		<Paper square elevation={0} className={classes.root}>
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
									onHover={() => fns.setHoverDay(day)}
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
