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
	isToday
} from "date-fns";
import Header from "./components/Header";
import clsx from "clsx";
import { chunks, combine, switchVal } from "../../utils";

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface MonthProps extends WithStyles<typeof styles> {
	initialDate?: Date;
}

const styles = (theme: Theme) =>
	createStyles({
		root: {
			width: 320
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
		},
		dayButton: {
			height: 36,
			width: 36,
			padding: 0
		},
		outlined: {
			extend: 'dayButton',
			border: `1px solid ${theme.palette.primary.dark}`
		}
	});

const Month: React.FunctionComponent<MonthProps> = props => {
	const [date, setDate] = React.useState(props.initialDate || new Date());

	const monthStart = startOfMonth(date);
	const monthEnd = endOfMonth(date);

	const startWeek = startOfWeek(monthStart);
	const endWeek = endOfWeek(monthEnd);

	const days = [];
	for (let curr = startWeek; isBefore(curr, endWeek); ) {
		days.push(curr);
		curr = addDays(curr, 1);
	}
	
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
						<Grid key={idx} container direction="row" justify="space-around">
							{week.map((day, dayIdx) => (
								<IconButton
									key={dayIdx}
									className={combine(classes.dayButton, isToday(day) && classes.outlined)}
									disabled={!isSameMonth(date, day)}>
									<Typography
										style={{ width: 20 }}
										align="center"
										key={dayIdx}
										color={isSameMonth(date, day) ? "default" : "textSecondary"}
										variant="body2">
										{getDate(day)}
									</Typography>
								</IconButton>
							))}
						</Grid>
					))}
				</Grid>
			</Grid>
		</Paper>
	);
};

export default withStyles(styles)(Month);
