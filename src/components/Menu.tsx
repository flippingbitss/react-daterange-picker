import React from "react";
import {
  Paper,
  Grid,
  Typography,
  Divider
} from "@material-ui/core";
import {
  createStyles,
  WithStyles,
  Theme,
  withStyles
} from '@material-ui/core/styles'
import { format, differenceInCalendarMonths } from "date-fns";
import ArrowRightAlt from "@material-ui/icons/ArrowRightAlt";
import Month from "./Month";
import DefinedRanges from "./DefinedRanges";
import { DateRange, DefinedRange, Setter, NavigationAction } from "../types";
import { MARKERS } from "../markers";

const styles = (theme: Theme) =>
  createStyles({
    header: {
      padding: "20px 70px"
    },
    headerItem: {
      flex: 1,
      textAlign: "center"
    },
    divider: {
      borderLeft: `1px solid ${theme.palette.action.hover}`,
      marginBottom: 20
    }
  });

interface MenuProps extends WithStyles<typeof styles> {
  dateRange: DateRange;
  ranges: DefinedRange[];
  minDate: Date;
  maxDate: Date;
  firstMonth: Date;
  secondMonth: Date;
  setFirstMonth: Setter<Date>;
  setSecondMonth: Setter<Date>;
  setDateRange: Setter<DateRange>;
  helpers: {
    inHoverRange: (day: Date) => boolean;
  };
  handlers: {
    onDayClick: (day: Date) => void;
    onDayHover: (day: Date) => void;
    onMonthNavigate: (marker: symbol, action: NavigationAction) => void;
  };
  translation?: {
    startDate?: string;
    endDate?: string;
    months?: [string, string, string, string, string, string, string, string, string, string, string, string];
    weekDays?: [string, string, string, string, string, string, string];
    locale?: object;
  }
}

const Menu: React.FunctionComponent<MenuProps> = props => {
  const {
    classes,
    ranges,
    dateRange,
    minDate,
    maxDate,
    firstMonth,
    setFirstMonth,
    secondMonth,
    setSecondMonth,
    setDateRange,
    helpers,
    handlers,
    translation,
  } = props;
  const translationText = {
    ...{
      startDate: "Start Date",
      endDate: "End Date"
    },
    ...translation,
  } as MenuProps['translation'];

  const { startDate, endDate } = dateRange;
  const canNavigateCloser = differenceInCalendarMonths(secondMonth, firstMonth) >= 2;
  const commonProps = { dateRange, minDate, maxDate, helpers, handlers };
  return (
    <Paper elevation={5} square>
      <Grid container direction="row" wrap="nowrap">
        <Grid>
          <Grid container className={classes.header} alignItems="center">
            <Grid item className={classes.headerItem}>
              <Typography variant="subtitle1">
                {startDate ? format(startDate, "MMMM dd, yyyy", { locale: translation?.locale }) : translationText?.startDate as string}
              </Typography>
            </Grid>
            <Grid item className={classes.headerItem}>
              <ArrowRightAlt color="action" />
            </Grid>
            <Grid item className={classes.headerItem}>
              <Typography variant="subtitle1">
                {endDate ? format(endDate, "MMMM dd, yyyy", { locale: translation?.locale }) : translationText?.endDate as string}
              </Typography>
            </Grid>
          </Grid>
          <Divider />
          <Grid container direction="row" justify="center" wrap="nowrap">
            <Month
              {...commonProps}
              value={firstMonth}
              setValue={setFirstMonth}
              navState={[true, canNavigateCloser]}
              marker={MARKERS.FIRST_MONTH}
              weekDays={translationText?.weekDays}
              months={translationText?.months}
            />
            <div className={classes.divider} />
            <Month
              {...commonProps}
              value={secondMonth}
              setValue={setSecondMonth}
              navState={[canNavigateCloser, true]}
              marker={MARKERS.SECOND_MONTH}
              weekDays={translationText?.weekDays}
              months={translationText?.months}
            />
          </Grid>
        </Grid>
        <div className={classes.divider} />
        <Grid>
          <DefinedRanges
            selectedRange={dateRange}
            ranges={ranges}
            setRange={setDateRange}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default withStyles(styles)(Menu);
