import React, { useEffect, useState } from "react";
import { LineChart, lineElementClasses } from "@mui/x-charts/LineChart";
import {
  Button,
  Grid2 as Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import moment from "moment";

function generateDateRange(startDate, endDate) {
  const dateRange = [];

  // Handle invalid input
  if (moment(endDate).isBefore(moment(startDate))) {
    console.error("End date is before start date.");
    return dateRange;
  }

  const start = moment(startDate).clone();
  const end = moment(endDate);

  while (start.isSameOrBefore(end)) {
    dateRange.push(start.format("YYYY-MM-DD")); // Format as YYYY-MM-DD
    start.add(1, "day");
  }

  return dateRange;
}

function countOccurrences(arr) {
  const counts = {};
  arr?.forEach((x) => {
    counts[x] = (counts[x] || 0) + 1;
  });
  return counts;
}

function getDaysOfPreviousMonths(dateStrings, numMonths) {
  const today = moment().utc().startOf("day");
  const currentYear = today.year();
  const currentMonth = today.month();

  let startMonth = currentMonth - numMonths;
  const startYear = startMonth < 0 ? currentYear - 1 : currentYear;
  startMonth = (startMonth + 12) % 12; // Adjust for negative months

  return dateStrings
    ?.filter((dateString) => {
      const date = moment(dateString).utc().startOf("day");
      const dateYear = date.year();
      const dateMonth = date.month();

      return (
        (dateYear === currentYear && dateMonth >= currentMonth - numMonths) ||
        (dateYear === startYear && dateMonth >= startMonth)
      );
    })
    ?.map((dateString) =>
      moment(dateString).utc().startOf("day").format("YYYY-MM-DD")
    );
}

const RecurringFrequency = ({ daily }) => {
  const [period, setPeriod] = useState(0);
  const [previewed, setPreviewed] = useState(daily);

  const [completedDatesLength, setCompletedDatesLength] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [fullDateRange, setFullDateRange] = useState([]);
  const [dateCounts, setDateCounts] = useState();
  const [chartData, setChartData] = useState([]);
  const [xLabels, setXLabels] = useState([]);
  const [uData, setUData] = useState([]);

  useEffect(() => {
    setPeriod(0);
  }, [previewed]);

  useEffect(() => {
    setCompletedDatesLength(
      getDaysOfPreviousMonths(previewed?.completedDates, period)?.length
    );
  }, [period]);

  useEffect(() => {
    setStartDate(
      getDaysOfPreviousMonths(previewed?.completedDates, period)?.[
        completedDatesLength - 1
      ]
    );
    setEndDate(moment().utc().startOf("day").format("YYYY-MM-DD"));
  }, [completedDatesLength]);

  useEffect(() => {
    setFullDateRange(generateDateRange(startDate, endDate));
    setDateCounts(countOccurrences(previewed?.completedDates));
  }, [startDate, endDate]);

  useEffect(() => {
    setChartData(
      fullDateRange?.map((date) => ({
        date,
        frequency: dateCounts[date] || 0,
      }))
    );
  }, [dateCounts]);

  useEffect(() => {
    // Prepare data for the chart
    setXLabels(chartData.map((item) => item.date));
    setUData(chartData.map((item) => item.frequency));
  }, [chartData]);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ mt: 1.5 }}
    >
      <LineChart
        width={500}
        height={300}
        series={[
          {
            data: uData,
            label: "Status",
            area: true,
            showMark: false,
            curve: "step",
            color: green[500],
            valueFormatter: (v) =>
              v === 1 ? (
                <Typography color="green">Done</Typography>
              ) : (
                <Typography color="red">Left</Typography>
              ),
          },
        ]}
        xAxis={[{ scaleType: "point", data: xLabels }]}
        sx={{
          [`& .${lineElementClasses.root}`]: {
            display: "none",
          },
        }}
      />

      <ToggleButtonGroup
        color="primary"
        value={period}
        exclusive
        onChange={(e, value) => {
          setPeriod(value);
        }}
        sx={{ mb: 1 }}
      >
        <ToggleButton value={0}>This Month</ToggleButton>
        <ToggleButton value={2}>3 Months</ToggleButton>
        <ToggleButton value={5}>6 Months</ToggleButton>
        <ToggleButton value={11}>This Year</ToggleButton>
      </ToggleButtonGroup>

      {daily.checklist && (
        <Button
          variant="contained"
          key={daily.$id}
          value={daily}
          color={
            JSON.stringify(previewed) === JSON.stringify(daily)
              ? "success"
              : "primary"
          }
          className="app-font"
          sx={{ mb: 1 }}
          onClick={() => {
            setPreviewed(daily);
          }}
        >
          <strong>
            {daily.title} {daily?.completedDates?.length}
          </strong>
        </Button>
      )}

      <ToggleButtonGroup
        color="primary"
        value={previewed}
        exclusive
        onChange={(e, value) => {
          setPreviewed(value);
        }}
      >
        {daily.checklist
          ?.filter((item) => item.completedDates)
          .map((item) => (
            <ToggleButton key={item.$id} value={item} className="app-font">
              {item.item} {item?.completedDates?.length}
            </ToggleButton>
          ))}
      </ToggleButtonGroup>
    </Grid>
  );
};

export default RecurringFrequency;
