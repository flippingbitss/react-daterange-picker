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
import { getDaysInMonth, getMonth, format } from "date-fns";
import Month from "./components/Month";

const theme = createMuiTheme();

export const DateRangePicker: React.FunctionComponent<{ title: string }> = props => {

	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			<Month date={new Date()} />
		</MuiThemeProvider>
	);

	//return (<Typography>Hello blahblas {props.title}</Typography>);
};
