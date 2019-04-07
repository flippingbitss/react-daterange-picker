import {
	WithStyles,
	Grid,
	Typography,
	createStyles,
	withStyles,
	IconButton
} from "@material-ui/core";
import React from "react";
import { ChevronLeft, ChevronRight, FastRewind } from "@material-ui/icons";
import { format, addMonths, isSameDay, isSameMonth } from "date-fns";

interface HeaderProps extends WithStyles<typeof styles> {
	date: Date;
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

const Header: React.FunctionComponent<HeaderProps> = ({
	date,
	classes,
	nextDisabled,
	prevDisabled,
	onClickNext,
	onClickPrevious
}) => (
	<Grid container justify="space-between" alignItems="center">
		<Grid item className={classes.iconContainer}>
			<IconButton className={classes.icon} disabled={prevDisabled} onClick={onClickPrevious}>
				<ChevronLeft color={prevDisabled ? "disabled" : "action"} />
			</IconButton>
		</Grid>
		<Grid item>
			<Typography>{format(date, "MMMM YYYY")}</Typography>
		</Grid>
		<Grid item className={classes.iconContainer}>
			<IconButton className={classes.icon} disabled={nextDisabled} onClick={onClickNext}>
				<ChevronRight color={nextDisabled ? "disabled" : "action"} />
			</IconButton>
		</Grid>
	</Grid>
);

export default withStyles(styles)(
	React.memo(Header, (prev, next) => {
		return isSameMonth(prev.date, next.date) &&
			prev.nextDisabled == next.nextDisabled &&
			prev.prevDisabled == next.prevDisabled;
	})
);
