import * as React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";



const size = {
  width: 400,
  height: 200,
};

export default function PieArcLabel({data}) {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }
  const transformedData = data.map((item) => ({
    value: item.quantity,
    label: item.stream,
  }));
  
  console.log(transformedData)
  return (
    <PieChart
      series={[
        {
          arcLabel: (item) => `${item.label} (${item.value})`,
          arcLabelMinAngle: 45,
          data:transformedData,
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: "white",
          fontWeight: "bold",
        },
      }}
      {...size}
    />
  );
}
