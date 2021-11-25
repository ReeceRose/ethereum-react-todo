import { Component } from "react";
import Web3 from "web3";
import "./App.css";

class App extends Component {
  componentDidMount() {
    this.loadBlockchainData();
  }

  constructor(props: any) {
    super(props);
    console.log("started");
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    const network = await web3.eth.net.getNetworkType();
    console.log(network);
  }

  render() {
    return (
      <div className="App">
        <div className="App-content">
          <h1 className="App-header">Ethereum + React Todo List</h1>
          <ul id="taskList" className="list-unstyled">
            <div className="tasktemplate checkbox display-none">
              <label>
                <input type="checkbox" />
                <span className="content">Content here...</span>
              </label>
            </div>
          </ul>
          <ul id="completedTaskList" className="list-unstyled"></ul>
        </div>
      </div>
    );
  }
}

export default App;
