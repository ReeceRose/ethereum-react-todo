import { ChangeEvent, Component } from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";

import "./App.css";
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
  content: string;
}

class App extends Component<{}, State> {
  componentDidMount() {
    this.loadBlockchainData();
  }

  constructor(props: any) {
    super(props);
    this.state = {
      account: "",
      todoList: undefined,
      taskCount: 0,
      tasks: [],
      content: "",
    };
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

  async createTask() {
    try {
      await this.state.todoList?.methods
        .createTask(this.state.content)
        .send({ from: this.state.account });
    } catch (e) {
      console.log("Failed to create new task", e);
    }
    let taskCount = this.state.taskCount + 1;
    const task: Task = {
      completed: false,
      content: this.state.content,
      id: taskCount.toString(),
    };
    this.setState({
      taskCount: taskCount,
      tasks: [...this.state.tasks, task],
    });
  }

  handleContentChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ content: e.target.value });
  }

  async toggleTask(id: string) {
    try {
      await this.state.todoList?.methods
        .toggleCompleted(id)
        .send({ from: this.state.account });
    } catch (e) {
      console.log("Failed to toggle task", e);
    }
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
              value={this.state.content}
              onChange={this.handleContentChange.bind(this)}
            />
            <button
              type="button"
              className="form-button"
              onClick={this.createTask.bind(this)}
            >
              Add
            </button>
          </form>
          <ul id="taskList" className="task-list">
            <div className="tasktemplate checkbox display-none">
              {this.state.tasks.map((task) => (
                <label key={task.id} className="task">
                  <input
                    type="checkbox"
                    className="task-checkbox"
                    defaultChecked={task.completed}
                    onClick={async () => this.toggleTask(task.id)}
                  />
                  <span className="task-content">{task.content}</span>
                  <br />
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
