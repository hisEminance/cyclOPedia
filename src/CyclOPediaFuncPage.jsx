import React, { useEffect, useId, useRef, useState } from "react";
import { getRandomUser } from "./Utility/api";
import Instructor from "./Instructor";

const CyclOPediaFuncPage = () => {
  const [state, setState] = useState(() => {
    return {
      instructor: undefined,
      studentList: [],
      studentCount: 0,
      hideInstructor: false,
    };
  });

  const [inputName, setInputName] = useState(() => {
    return "";
  });

  const totalRender = useRef(0);
  const prevStudentCount = useRef(0);
  const feedbackInputRef = useRef(null);
  const id = useId();

  const [inputFeedback, setInputFeedback] = useState(() => {
    return "";
  });

  useEffect(() => {
    totalRender.current = totalRender.current + 1;
    console.log("Render" + totalRender.current);
  });

  useEffect(() => {
    const getUser = async () => {
      const response = await getRandomUser();
      const user = response.data.results[0];

      setState((prevState) => ({
        ...prevState,
        instructor: {
          name: `${user.name.first} ${user.name.last}`,
          email: user.email,
          phone: user.phone,
        },
      }));
    };

    if (!state.hideInstructor) {
      getUser();
    }
  }, [state.hideInstructor]);

  useEffect(() => {
    const getUser = async () => {
      const response = await getRandomUser();
      const user = response.data.results[0];

      setState((prevState) => ({
        ...prevState,
        studentList: [
          ...prevState.studentList,
          {
            name: `${user.name.first} ${user.name.last}`,
          },
        ],
      }));
    };

    if (prevStudentCount.current < state.studentCount) {
      getUser();
    } else if (prevStudentCount.current > state.studentCount) {
      setState((prevState) => {
        return { ...prevState, studentList: [] };
      });
    }
  }, [state.studentCount]);

  useEffect(() => {
    prevStudentCount.current = state.studentCount;
  }, [state.studentCount]);

  useEffect(() => {
    feedbackInputRef.current.focus();
  }, []);

  const handleAddStudent = () => {
    setState((prevState) => {
      return {
        ...prevState,
        studentCount: prevState.studentCount + 1,
      };
    });
  };

  const handleRemoveAllStudent = () => {
    setState((prevState) => {
      return {
        ...prevState,
        studentCount: 0,
      };
    });
  };

  const handleToggleInstructor = () => {
    setState((prevState) => {
      return {
        ...prevState,
        hideInstructor: !prevState.hideInstructor,
      };
    });
  };

  return (
    <div>
      <div className="p-3">
        <span className="h4 text-success">Instructor &nbsp;</span>
        <i
          className={`bi ${
            state.hideInstructor ? "bi-toggle-off" : "bi-toggle-on"
          } btn btn-success btn-sm`}
          onClick={handleToggleInstructor}
        ></i>
        {!state.hideInstructor && state.instructor ? (
          <Instructor instructor={state.instructor} />
        ) : null}
      </div>

      <div className="p-3">Total render : {totalRender.current}</div>

      <div className="p-3">
        <span className="h4 text-success">Feedback</span>
        <br />
        <input
          type="text"
          value={inputName}
          placeholder="Name..."
          onChange={(e) => setInputName(e.target.value)}
          id={`${id}-inputName`}
        />{" "}
        <label htmlFor={`${id}-inputName`}> Name Value : </label>
        {inputName}
        <br />
        <textarea
          value={inputFeedback}
          ref={feedbackInputRef}
          id={`${id}-inputFeedback`}
          placeholder="Feedback..."
          onChange={(e) => setInputFeedback(e.target.value)}
        />
        <label htmlFor={`${id}-inputFeedback`}>Feedback Value : </label>{" "}
        {inputFeedback}
      </div>

      <div className="p-3">
        <span className="h4 text-success">Students</span>
        <br />
        <div>Student Count : {state.studentCount}</div>
        <button className="btn btn-success btn-sm" onClick={handleAddStudent}>
          Add Student
        </button>
        &nbsp;
        <button className="btn btn-danger btn-sm" onClick={handleRemoveAllStudent}>
          Remove All Students
        </button>
        {state.studentList.map((student, index) => (
          <div className="text-white" key={index}>
            - {student.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CyclOPediaFuncPage;
//дякую гпт шо відформатував мені кодік і воно не виглядає погано