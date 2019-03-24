export const sum = (a: number, b: number) => a + b;

import * as React from "react";
import {
	Typography,
	MuiThemeProvider,
	createMuiTheme,
	CssBaseline,
	Grid,
	Paper,
	Icon
} from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import { getDaysInMonth, getMonth, format, addMonths } from "date-fns";
import Month from "./components/Month";

const theme = createMuiTheme({ typography: { useNextVariants: true } });

export const DateRangePicker: React.FunctionComponent<{ title: string }> = props => {
	const dateFirst = new Date();
	const dateSecond = addMonths(dateFirst, 1);

	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />

			<Grid container direction="row" justify="space-around">
				<Month initialDate={dateFirst} />
				<Month initialDate={dateSecond} />
			</Grid>
		</MuiThemeProvider>
	);

	//return (<Typography>Hello blahblas {props.title}</Typography>);
};
