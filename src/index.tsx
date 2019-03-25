import * as React from "react";
import { MuiThemeProvider, createMuiTheme, CssBaseline, Grid } from "@material-ui/core";
import { addMonths } from "date-fns";
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
