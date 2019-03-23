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
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import {
	format,
	getMonth,
	getDaysInMonth,
	startOfMonth,
	startOfWeek,
	addWeeks,
	isBefore,
	getDate,
	addDays
} from "date-fns";

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const chunks = (array: any[], size: number): any[][] => {
	return Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
		array.slice(i * size, i * size + size)
	);
};

interface MonthProps extends WithStyles<typeof styles> {
	date: Date;
}

const styles = (theme: Theme) =>
	createStyles({
		root: {
			width: 320
		},
		headerIcon: {
			padding: 12
		},
		weekDaysContainer: {
			paddingLeft: 30,
			paddingRight: 30
		}
	});

type HeaderProps = { date: Date } & WithStyles<typeof styles>;
const Header: React.FunctionComponent<HeaderProps> = ({ date, classes }) => (
	<Grid container justify="space-between" alignItems="center">
		<Grid item className={classes.headerIcon}>
			<ChevronLeft color="action" />
		</Grid>
		<Grid item>
			<Typography>{format(date, "MMMM YYYY")}</Typography>
		</Grid>
		<Grid item className={classes.headerIcon}>
			<ChevronRight color="action" />
		</Grid>
	</Grid>
);

const Month: React.FunctionComponent<MonthProps> = props => {
	const monthStart = startOfMonth(props.date);

	const startWeek = startOfWeek(monthStart);
	const endWeek = addWeeks(startWeek, 4);

	const days = [];
	for (let curr = startWeek; isBefore(curr, endWeek); ) {
		days.push(getDate(curr));
		curr = addDays(curr, 1);
	}

	const { classes } = props;
	return (
		<Paper elevation={5} className={classes.root}>
			<Grid container>
				<Header date={props.date} classes={props.classes} />

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
					style={{ marginTop: 15, marginBottom: 20 }}>
					{chunks(days, 7).map((week, idx) => (
						<Grid
							key={idx}
							container
							direction="row"
							style={{ padding: 5 }}
							justify="space-around">
							{week.map((day, dayIdx) => (
								<Typography
									style={{ width: 20 }}
									align="center"
									key={dayIdx}
									variant="body2">
									{day}
								</Typography>
							))}
						</Grid>
					))}
				</Grid>
			</Grid>
		</Paper>
	);
};

export default withStyles(styles)(Month);
