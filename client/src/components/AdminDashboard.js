import React, { Component } from "react";
import { FaUserGraduate } from "react-icons/fa";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import BasicLineChart from "./Linediagram";
import "../styles/AdminDashboard.css";

class AdminDashboard extends Component {
  constructor() {
    super();
    this.state = {
      streamData: [],
      lineChartData: [],
    };
  }

  componentDidMount() {
    this.fetchData();
    this.fetchLineChartData();
  }

  fetchData = async () => {
    try {
      const response = await fetch("showquantitystudent", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      this.setState({ streamData: data });
    } catch (error) {
      console.error("Catch Error:", error);
    }
  };
  fetchLineChartData = async () => {
    try {
      const response = await fetch("showbookquantity", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const lineChartData = await response.json();
      this.setState({ lineChartData });
    } catch (error) {
      console.error("Catch Error:", error);
    }
  };
  renderStreamCards = () => {
    const { streamData } = this.state;

    return streamData.map(({ _id, stream, quantity }) => (
      <div className="stream" key={_id}>
        <div className="item">
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <FaUserGraduate />
                <h1>{stream}</h1>
                <h4>{quantity}</h4>
              </div>
              <div className="flip-card-back">
                <p>
                  The {stream} department offers a comprehensive business
                  education, preparing students for leadership roles. Courses
                  cover management, marketing, finance, and more, fostering
                  critical thinking and professional skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  render() {
    const { streamData } = this.state;

    const transformedData = streamData.map(({ quantity, stream }) => ({
      value: quantity,
      label: stream,
    }));

    return (
      <div className="container">
        <div className="first">{this.renderStreamCards()}</div>
        <div className="second">
          <div className="linediagram">
           <BasicLineChart />
          </div>
          <div className="pie-container">
            <div className="pie-3d-effect"></div>
            <PieChart

              series={[
                {
                  arcLabel: (item) => `${item.label} (${item.value})`,
                  arcLabelMinAngle: 45,
                  data: transformedData,
                },
              ]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: "white",
                  fontWeight: "bold",
                },
              }}
              width={400}
              height={200}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AdminDashboard;

