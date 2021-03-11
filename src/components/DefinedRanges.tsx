import React from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { DefinedRange, DateRange } from "../types";
import { isSameDay } from "date-fns";

type DefinedRangesProps = {
	resetRange: () => void;
	setRange: (range: DateRange) => void;
	selectedRange: DateRange;
	ranges: DefinedRange[];
};

const isSameRange = (first: DateRange, second: DateRange) => {
	const { startDate: fStart, endDate: fEnd } = first;
	const { startDate: sStart, endDate: sEnd } = second;
	if (fStart && sStart && fEnd && sEnd) {
		return isSameDay(fStart, sStart) && isSameDay(fEnd, sEnd);
	}
	return false;
};

const DefinedRanges: React.FunctionComponent<DefinedRangesProps> = props => {
	return (
		<List>
			{props.ranges.map((range, idx) => (
				<ListItem button key={idx} onClick={() => props.setRange(range)}>
					<ListItemText
						primaryTypographyProps={{
							variant: "body2",
							style: {
								fontWeight: isSameRange(range, props.selectedRange)
									? "bold"
									: "normal"
							}
						}}>
						{range.label}
					</ListItemText>
				</ListItem>
			))}
			<ListItem button onClick={() => props.resetRange()}>
				<ListItemText
					primaryTypographyProps={{
						variant: "body2",
					}}>
					Reset Range
				</ListItemText>
			</ListItem>
		</List>
	);
};

export default DefinedRanges;
