import React from "react";
import { getRandomUser } from "./Utility/api";
import Instructor from "./Instructor";

class CyclOPediaClassPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = JSON.parse(localStorage.getItem("cyclopediaState")) || {
      instructor: undefined,
      studentList: [],
      studentCount: 0,
      hideInstructor: false,
      inputName: "",
      inputFeedback: "",
    };
  }

  componentDidMount = async () => {
    console.log("Component did mount");
    if (!this.state.instructor) {
      const response = await getRandomUser();
      const user = response.data.results[0];
      this.setState({
        instructor: {
          name: user.name.first + " " + user.name.last,
          email: user.email,
          phone: user.phone,
        },
      });
    }
  };

  componentDidUpdate(previousProps, previousState) {
    if (previousState !== this.state) {
      localStorage.setItem("cyclopediaState", JSON.stringify(this.state));
    }
  }

  componentWillUnmount() {
    console.log("Component will unmount");
  }

  handleAddStudent = async () => {
    const response = await getRandomUser();
    const user = response.data.results[0];
    this.setState((prevState) => ({
      studentCount: prevState.studentCount + 1,
      studentList: [
        ...prevState.studentList,
        { name: user.name.first + " " + user.name.last },
      ],
    }));
  };

  handleRemoveAllStudent = () => {
    this.setState({
      studentCount: 0,
      studentList: [],
    });
  };

  handleToggleInstructor = () => {
    this.setState((prevState) => ({
      hideInstructor: !prevState.hideInstructor,
    }));
  };

  render() {
    console.log("Render Component");
    return (
      <div>
        <div className="p-3">
          <span className="h4 text-success">Instructor &nbsp;</span>
          <i
            className={`bi ${
              this.state.hideInstructor ? "bi-toggle-off" : "bi-toggle-on"
            } btn btn-success btn-sm`}
            onClick={this.handleToggleInstructor}
          ></i>
          {!this.state.hideInstructor && this.state.instructor ? (
            <Instructor instructor={this.state.instructor} />
          ) : null}
        </div>

        <div className="p-3">
          <span className="h4 text-success">Feedback</span>
          <br />
          <input
            type="text"
            value={this.state.inputName}
            placeholder="Name..."
            onChange={(e) => this.setState({ inputName: e.target.value })}
          />
          {" "}Value: {this.state.inputName}
          <br />
          <textarea
            value={this.state.inputFeedback}
            placeholder="Feedback..."
            onChange={(e) => this.setState({ inputFeedback: e.target.value })}
          />
          Value: {this.state.inputFeedback}
        </div>

        <div className="p-3">
          <span className="h4 text-success">Students</span>
          <br />
          <div>Student Count : {this.state.studentCount}</div>
          <button className="btn btn-success btn-sm" onClick={this.handleAddStudent}>
            Add Student
          </button>
          &nbsp;
          <button className="btn btn-danger btn-sm" onClick={this.handleRemoveAllStudent}>
            Remove All Students
          </button>
          {this.state.studentList.map((student, index) => (
            <div className="text-white" key={index}>
              - {student.name}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default CyclOPediaClassPage;
