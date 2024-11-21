import React, { Component } from "react";
import FileUpload from "./FileUpload";
import Child1 from "./Child1";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stockData: null, // Holds the parsed JSON data from FileUpload
    };
  }

  handleSetData = (data) => {
    this.setState({ stockData: data }); // Update state with JSON data
  };

  render() {
    return (
      <div className="app">
        <h1>Stock Price Visualizer</h1>
        <FileUpload set_data={this.handleSetData} />
        {this.state.stockData && <Child1 stockData={this.state.stockData} />}
      </div>
    );
  }
}

export default App;
