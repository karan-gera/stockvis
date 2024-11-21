import React, { Component } from "react";
import * as d3 from "d3";
import "./Child1.css";

class Child1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company: "Apple",
      selectedMonth: "November",
      filteredData: [], // Data filtered by company and month
    };
  }

  componentDidMount() {
    this.filterData(); // Initial data filtering
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.stockData !== this.props.stockData || // If new data is uploaded
      prevState.company !== this.state.company || // If company changes
      prevState.selectedMonth !== this.state.selectedMonth // If month changes
    ) {
      this.filterData();
    }
  }

  filterData = () => {
    const { company, selectedMonth } = this.state;
    const { stockData } = this.props;

    const filteredData = stockData.filter(
      (d) =>
        d.Company === company &&
        d.Date.toLocaleString("default", { month: "long" }) === selectedMonth
    );
    this.setState({ filteredData }, this.renderChart);
  };

  handleCompanyChange = (event) => {
    this.setState({ company: event.target.value });
  };

  handleMonthChange = (event) => {
    this.setState({ selectedMonth: event.target.value });
  };

  renderChart = () => {
    const { filteredData } = this.state;

    const svgWidth = 800;
    const svgHeight = 400;
    const margin = { top: 50, right: 30, bottom: 50, left: 60 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Remove previous chart
    d3.select("#chart").selectAll("*").remove();

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(filteredData, (d) => d.Date))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(filteredData, (d) => Math.min(d.Open, d.Close)),
        d3.max(filteredData, (d) => Math.max(d.Open, d.Close)),
      ])
      .range([height, 0]);

    // Add axes
    chart
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));
    chart.append("g").call(d3.axisLeft(yScale));

    // Add lines
    const lineOpen = d3
      .line()
      .x((d) => xScale(d.Date))
      .y((d) => yScale(d.Open));
    chart
      .append("path")
      .data([filteredData])
      .attr("fill", "none")
      .attr("stroke", "#b2df8a")
      .attr("stroke-width", 2)
      .attr("d", lineOpen);

    const lineClose = d3
      .line()
      .x((d) => xScale(d.Date))
      .y((d) => yScale(d.Close));
    chart
      .append("path")
      .data([filteredData])
      .attr("fill", "none")
      .attr("stroke", "#e41a1c")
      .attr("stroke-width", 2)
      .attr("d", lineClose);

    // Add circles and tooltips for "Open"
    chart
      .selectAll(".dot-open")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("class", "dot-open")
      .attr("cx", (d) => xScale(d.Date))
      .attr("cy", (d) => yScale(d.Open))
      .attr("r", 4)
      .attr("fill", "#b2df8a")
      .on("mouseover", (event, d) => {
        const tooltip = d3.select("#tooltip");
        tooltip
          .style("visibility", "visible")
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`)
          .html(
            `Date: ${d.Date.toLocaleDateString()}<br>Open: ${d.Open}<br>Close: ${d.Close}`
          );
      })
      .on("mouseout", () => d3.select("#tooltip").style("visibility", "hidden"));

    // Add circles and tooltips for "Close"
    chart
      .selectAll(".dot-close")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("class", "dot-close")
      .attr("cx", (d) => xScale(d.Date))
      .attr("cy", (d) => yScale(d.Close))
      .attr("r", 4)
      .attr("fill", "#e41a1c")
      .on("mouseover", (event, d) => {
        const tooltip = d3.select("#tooltip");
        tooltip
          .style("visibility", "visible")
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`)
          .html(
            `Date: ${d.Date.toLocaleDateString()}<br>Open: ${d.Open}<br>Close: ${d.Close}`
          );
      })
      .on("mouseout", () => d3.select("#tooltip").style("visibility", "hidden"));

    // Add legend
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${margin.left},${margin.top - 30})`);

    legend
      .append("circle")
      .attr("cx", 10)
      .attr("cy", 10)
      .attr("r", 5)
      .attr("fill", "#b2df8a");
    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 15)
      .text("Open")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");

    legend
      .append("circle")
      .attr("cx", 90)
      .attr("cy", 10)
      .attr("r", 5)
      .attr("fill", "#e41a1c");
    legend
      .append("text")
      .attr("x", 100)
      .attr("y", 15)
      .text("Close")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");
  };

  render() {
    return (
      <div className="child1-container">
        <div className="controls">
          <div className="company-selector">
            <label>Company:</label>
            {["Apple", "Microsoft", "Amazon", "Google", "Meta"].map((company) => (
              <label key={company}>
                <input
                  type="radio"
                  value={company}
                  checked={this.state.company === company}
                  onChange={this.handleCompanyChange}
                />
                {company}
              </label>
            ))}
          </div>
          <div className="month-selector">
            <label>Month:</label>
            <select value={this.state.selectedMonth} onChange={this.handleMonthChange}>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div id="chart"></div>
        <div id="tooltip" className="tooltip"></div>
      </div>
    );
  }
}

export default Child1;
