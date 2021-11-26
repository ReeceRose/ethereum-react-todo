import { Component } from "react";
import Web3 from "web3";
import "./App.css";
import { Contract } from "web3-eth-contract";

import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from "./config";

interface Task {
  id: string;
  content: string;
  completed: boolean;
}

interface State {
  account: string;
  todoList: Contract | undefined;
  taskCount: number;
  tasks: Task[];
}

class App extends Component<{}, State> {
  componentDidMount() {
    this.loadBlockchainData();
  }

  constructor(props: any) {
    super(props);
    this.state = { account: "", todoList: undefined, taskCount: 0, tasks: [] };
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    let accounts = await web3.eth.requestAccounts();
    const todoList = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);
    const taskCount = await todoList.methods.taskCount().call();
    let tasks = [];
    for (let i = 1; i <= taskCount; i++) {
      tasks.push(await todoList.methods.tasks(i).call());
    }
    this.setState({
      account: accounts[0],
      todoList: todoList,
      taskCount: taskCount,
      tasks: tasks,
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-content">
          <h1 className="App-header">Ethereum + React Todo List</h1>
          <h3>Your account: {this.state.account}</h3>
          <p>Current number of tasks: {this.state.taskCount}</p>
          <form>
            <input
              type="text"
              className="task-input"
              placeholder="New task"
              required
            />
            <button className="form-button">Add</button>
          </form>
          <ul id="taskList" className="task-list">
            <div className="tasktemplate checkbox display-none">
              {this.state.tasks.map((task) => (
                <label key={task.id} className="task">
                  <input type="checkbox" className="task-checkbox" />
                  <span className="task-content">{task.content}</span>
                </label>
              ))}
            </div>
          </ul>
          <ul id="completedTaskList" className="list-unstyled"></ul>
        </div>
      </div>
    );
  }
}

export default App;
