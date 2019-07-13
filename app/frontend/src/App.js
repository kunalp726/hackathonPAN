import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import rootUrl from "./helpers/rootUrl";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {
    let res = await axios.get(`${rootUrl}/routes/test`);
    this.setState({
      displayText: res.data.message
    });
  }
  render() {
    return (
      <div className="App">
        <header>Smart Human-in-the-loop APPID System</header>
        <div className="action-parent">{this.state.displayText}</div>
      </div>
    );
  }
}

export default App;
