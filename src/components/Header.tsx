import {
	WithStyles,
	Grid,
	createStyles,
	withStyles,
	IconButton,
	Select,
	MenuItem
} from "@material-ui/core";
import React from "react";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import { setMonth, getMonth, setYear, getYear } from "date-fns";

interface HeaderProps extends WithStyles<typeof styles> {
	date: Date;
	setDate: (date: Date) => void;
	nextDisabled: boolean;
	prevDisabled: boolean;
	onClickNext: () => void;
	onClickPrevious: () => void;
}

const styles = createStyles({
	iconContainer: {
		padding: 5
	},
	icon: {
		padding: 10,
		"&:hover": {
			background: "none"
		}
	}
});

const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"June",
	"July",
	"Aug",
	"Sept",
	"Oct",
	"Nov",
	"Dec"
];

const generateYears = (relativeTo: Date, count: number) => {
	const half = Math.floor(count / 2);
	return Array(count)
		.fill(0)
		.map((y, i) => relativeTo.getFullYear() - half + i); // TODO: make part of the state
};

const Header: React.FunctionComponent<HeaderProps> = ({
	date,
	classes,
	setDate,
	nextDisabled,
	prevDisabled,
	onClickNext,
	onClickPrevious
}) => {
	const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setDate(setMonth(date, parseInt(event.target.value)));
	};

	const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setDate(setYear(date, parseInt(event.target.value)));
	};

	return (
		<Grid container justify="space-between" alignItems="center">
			<Grid item className={classes.iconContainer}>
				<IconButton
					className={classes.icon}
					disabled={prevDisabled}
					onClick={onClickPrevious}>
					<ChevronLeft color={prevDisabled ? "disabled" : "action"} />
				</IconButton>
			</Grid>
			<Grid item>
				<Select
					value={getMonth(date)}
					onChange={handleMonthChange}
					MenuProps={{ disablePortal: true }}>
					{MONTHS.map((month, idx) => (
						<MenuItem key={month} value={idx}>
							{month}
						</MenuItem>
					))}
				</Select>
			</Grid>

			<Grid item>
				<Select
					value={getYear(date)}
					onChange={handleYearChange}
					MenuProps={{ disablePortal: true }}>
					{generateYears(date, 30).map(year => (
						<MenuItem key={year} value={year}>
							{year}
						</MenuItem>
					))}
				</Select>

				{/* <Typography>{format(date, "MMMM YYYY")}</Typography> */}
			</Grid>
			<Grid item className={classes.iconContainer}>
				<IconButton className={classes.icon} disabled={nextDisabled} onClick={onClickNext}>
					<ChevronRight color={nextDisabled ? "disabled" : "action"} />
				</IconButton>
			</Grid>
		</Grid>
	);
};

export default withStyles(styles)(Header);
