import * as React from "react";
import { MuiThemeProvider, createMuiTheme, CssBaseline, Grid, Paper, Typography, createStyles, WithStyles, withStyles, Divider, Theme } from "@material-ui/core";
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
	format
} from "date-fns";
import Month from "./components/Month";
import { ArrowRightAlt } from "@material-ui/icons";

const theme = createMuiTheme({ typography: { useNextVariants: true } });

const styles = (theme: Theme) => createStyles({
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
})



interface DateRangePickerProps extends WithStyles<typeof styles> {
	title: string;
	dateRange?: DateRange;
}

interface DateRange {
	startDate?: Date;
	endDate?: Date;
}

const DateRangePickerImpl: React.FunctionComponent<DateRangePickerProps> = props => {
	const [dateRange, setDateRange] = React.useState<DateRange>({ ...props.dateRange });
	const [hoverDay, setHoverDay] = React.useState<Date>();
	const { startDate, endDate } = dateRange;
	const { classes } = props;

	const matchEnds = (day: Date) => isStartOfRange(day) || isEndOfRange(day);
	const isStartOfRange = (day: Date) => (startDate && isSameDay(day, startDate)) as boolean;
	const isEndOfRange = (day: Date) => (endDate && isSameDay(day, endDate)) as boolean;
	const inDateRange = (day: Date) => {
		return (startDate && endDate && isWithinRange(day, startDate, endDate)) as boolean;
	};

	const inHoverRange = (day: Date) => {
		return (startDate &&
			!endDate &&
			hoverDay &&
			isAfter(hoverDay, startDate) &&
			isWithinRange(day, startDate, hoverDay)) as boolean;
	};

	const getDaysInMonth = (date: Date) => {
		const startWeek = startOfWeek(startOfMonth(date));
		const endWeek = endOfWeek(endOfMonth(date));
		const days = [];
		for (let curr = startWeek; isBefore(curr, endWeek); ) {
			days.push(curr);
			curr = addDays(curr, 1);
		}
		return days;
	};

	const handleClick = (day: Date) => {
		if (startDate && !endDate && isAfter(day, startDate)) {
			setDateRange({ startDate, endDate: day });
		} else {
			setDateRange({ startDate: day, endDate: undefined });
		}
	};

	const functions = {
		inHoverRange,
		inDateRange,
		isStartOfRange,
		isEndOfRange,
		matchEnds,
		getDaysInMonth,
		setHoverDay,
		handleClick
	};


	const dateFirst = new Date();
	const dateSecond = addMonths(dateFirst, 1);

	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />

			<Grid direction="column">
				<Paper elevation={0} square>
					<Grid container className={classes.header} alignItems="center" >
						<Grid item className={classes.headerItem}><Typography variant="subheading">{startDate ? format(startDate, "MMMM DD, YYYY") : "Start Date"}</Typography></Grid>
						<Grid item className={classes.headerItem}><ArrowRightAlt color="action"/></Grid>
						<Grid item className={classes.headerItem}><Typography variant="subheading">{endDate ? format(endDate, "MMMM DD, YYYY") : "End Date"}</Typography></Grid>
					</Grid>
				
				<Grid container direction="row" justify="center">
					<Month initialDate={dateFirst} functions={functions} />
					<div className={classes.divider}></div>
					<Month initialDate={dateSecond} functions={functions} />
				</Grid>
				</Paper>
			</Grid>
		</MuiThemeProvider>
	);

	//return (<Typography>Hello blahblas {props.title}</Typography>);
};

export const DateRangePicker = withStyles(styles)(DateRangePickerImpl)
