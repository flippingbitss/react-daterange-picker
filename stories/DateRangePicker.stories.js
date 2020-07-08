import React from "react";
import { DateRangePicker } from "../src/index";

export default {
  title: "DateRangePicker",
  component: DateRangePicker,
};

export const DateRangePickerStory = () => (
  <DateRangePicker
    open={true}
    onChange={(dateRange) => console.log(dateRange)}
  />
);
