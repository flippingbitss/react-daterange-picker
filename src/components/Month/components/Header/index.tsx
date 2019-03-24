import {
	WithStyles,
	Grid,
	Typography,
	createStyles,
	withStyles,
	IconButton
} from "@material-ui/core";
import React from "react";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import { format, addMonths } from "date-fns";

interface HeaderProps extends WithStyles<typeof styles> {
	date: Date;
	onChange: (date: Date) => void;
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

const Header: React.FunctionComponent<HeaderProps> = ({ date, classes, onChange }) => {
	const handleNext = () => onChange(addMonths(date, 1));
	const handlePrev = () => onChange(addMonths(date, -1));

	return (
		<Grid container justify="space-between" alignItems="center">
			<Grid item className={classes.iconContainer}>
				<IconButton className={classes.icon} onClick={handlePrev}>
					<ChevronLeft color="action" />
				</IconButton>
			</Grid>
			<Grid item>
				<Typography>{format(date, "MMMM YYYY")}</Typography>
			</Grid>
			<Grid item className={classes.iconContainer}>
				<IconButton className={classes.icon} onClick={handleNext}>
					<ChevronRight color="action" />
				</IconButton>
			</Grid>
		</Grid>
	);
};

export default withStyles(styles)(Header);
