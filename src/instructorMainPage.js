import React from 'react';
import './instructorMainPage.css';
import logo from './bilkent.png';
import { useNavigate } from 'react-router-dom';
import GoogleDrive from './googledrive';

const InstructorMainPage = () => {

  const navigate = useNavigate();
  const [status, setStatus] = React.useState('reportUploaded');

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

 
  const statusClasses = {
    waitingFirstSubmission: 'waitingFirstSubmission',
    reportUploaded: 'reportUploaded',
    revisionAsked: 'revisionAsked',
    waitingForCriteria: 'waitingForCriteria',
    satisfactory: 'satisfactory',
    unsatisfactory: 'unsatisfactory'
  }
  const departmentId = localStorage.getItem('departmentId');
  const email = localStorage.getItem('email');
  const isVerified = localStorage.getItem('isVerified');
  const name = localStorage.getItem('name');
  const notifToMail = localStorage.getItem('notifToMail');
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');


  const OpenFrame = () => {
    console.log("openframe geldi"); 
    navigate('/googledrive');
  }
  const jsonString = localStorage.getItem('arrayOfStructs');

    // Convert the JSON string back to an array of structs
  const arrayOfStructs = JSON.parse(jsonString);
  const [userArray, setUserArray] = React.useState([]);
  const url = `http://localhost:8080/users/get/${localStorage.getItem('userId')}` ;
  
  const myObject = {
    email: localStorage.getItem('email'),
    password: localStorage.getItem('password')
  };
  React.useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          console.log("OK");
          const parsedData = await response.json();
          const jsonString = JSON.stringify(parsedData.course_info);
          localStorage.setItem('arrayOfStructs', jsonString);
          setUserArray(parsedData.course_info);
        } else {
          console.log("BAD");
          throw new Error('Request failed with status code ' + response.status);
        }
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  

  const status1 = localStorage.getItem('status1');
  const course_name1 = localStorage.getItem('course_name1');
  const student_name1 = localStorage.getItem('student_name1');
  const TA_check1 = localStorage.getItem('TA_check1');


  const statusClass = statusClasses[status];

  return (
    <div className="instructorMainPage-all-items">  
      <div className="instructorMainPage-header">
        <div className="instructorMainPage-image-div">
          <img src={logo} alt="Bilkent University logo" className="instructorMainPage-image" />
          <h2 className="instructorMainPage-header_title">INTERNSHIP MANAGEMENT SYSTEM</h2>
        </div>
        <img className="instructorMainPage-announcement_icon" />
        <img className="instructorMainPage-nofitication_icon" />
        <img className="instructorMainPage-logout_icon" />
      </div>
      <h3 className="instructorMainPage-header_welcome_message">Hello, {name}</h3>

      <div className="instructorMainPage-body_class">
        <div className="instructorMainPage-Profile_Information">
          <p className="instructorMainPage-user_name">Name: {name}</p>
          <p className="instructorMainPage-email">Email: {email}</p>
          <div className="instructorMainPage-switch_div">
            <p className="instructorMainPage-notify">Notify me with mail</p>
            <label className="instructorMainPage-switch">
              <input type="instructorMainPage-checkbox" />
              <span className="instructorMainPage-slider round"></span>
            </label>
          </div>
          <form action="/action_page.php">
            <input type="file" id="myFile" name="filename" />
            <input type="submit" />
          </form>
          <hr />
          <p className="instructorMainPage-announcements">ANNOUNCEMENTS</p>
          <hr />
          <p className="instructorMainPage-semester_statistics">SEMESTER STATISTICS</p>
          <hr />
        </div>

        <div className="instructorMainPage-student_profile_body">
        {userArray.map((user, index) => (
        <CustomDiv
          key={index}
          openFrame={OpenFrame}
          status={user.status}
          course_name={user.course_name}
          student_name={user.student_name}
          TA_check={user.TA_check}
        />
      ))}
        </div>
      </div>
    </div>
  );
}


// burada öğrencileri bulmamız lazım alo


function CustomDiv({ status , openFrame, course_name, student_name, TA_check}) {
   
  return(
    <div className={`instructorMainPage-my-div ${status}`}>
      {
        status === 'waitingSummerTrainingEvaluationFromCompany' &&(
          <>
          <div className="instructorMainPage-display_inline">
            <h4 className="instructorMainPage-student_name">Name: {student_name}</h4>
          </div>
          <h4 className="instructorMainPage-student_course">Course: {course_name}</h4>
          <h4 className="instructorMainPage-student_check">TA Check: {TA_check}</h4>
          <h4 className="instructorMainPage-student_status">Status: {status}</h4>
          </>
        )
      }
      {
        status === 'waitingFirstSubmission' && (
          <>
          <div className="instructorMainPage-display_inline">
            <h4 className="instructorMainPage-student_name">Name: Ece Ateş</h4>
          </div>
          <h4 className="instructorMainPage-student_course">Course: CS299</h4>
          <h4 className="instructorMainPage-student_check">TA Check: Passed</h4>
          <h4 className="instructorMainPage-student_status">Status: {status}</h4>
          </>
        )
      }
      {
        status === 'waitingInstructorEvaluation' && (
          <>
            <button className = "instructorMainPage-all_reports" onClick = {openFrame}> Reports </button>
            <button className="instructorMainPage-evaluate">EVALUATE</button>
            <div className="instructorMainPage-display_inline">
              <h4 className="instructorMainPage-student_name">Name: Ece Ateş</h4>
            </div>
            <h4 className="instructorMainPage-student_course">Course: CS299</h4>
            <h4 className="instructorMainPage-student_check">TA Check: Passed</h4>
            <h4 className="instructorMainPage-student_status">Status: {status}</h4>
          </>
        )
      }
      {
        status === 'uploadRevision' && (
          <>
            <button className="instructorMainPage-all_reports" onClick = {openFrame}> Reports </button>
            <button className="instructorMainPage-criteria_mode"> Criteria Mode </button>
            <div className="instructorMainPage-display_inline">
              <h4 className="instructorMainPage-student_name">Name: Ece Ateş</h4>
            </div>
            <h4 className="instructorMainPage-student_course">Course: CS299</h4>
            <h4 className="instructorMainPage-student_check">TA Check: Passed</h4>
            <h4 className="instructorMainPage-student_status">Status: {status}</h4>
          </>
        )
      }
      {
        status === 'waitingFinalConfirmation' && (
          <>
            <button className="instructorMainPage-all_reports" onClick = {openFrame}> Reports </button>
            <button className="instructorMainPage-criteria_mode"> Criteria Mode </button>
            <div className="instructorMainPage-display_inline">
              <h4 className="instructorMainPage-student_name">Name: Ece Ateş</h4>
            </div>
            <h4 className="instructorMainPage-student_course">Course: CS299</h4>
            <h4 className="instructorMainPage-student_check">TA Check: Passed</h4>
            <h4 className="instructorMainPage-student_status">Status: {status}</h4>
          </>
        )
      }
      {
        (status === 'gradeUnsatisfactory' || status === 'gradeSatisfactory') && (
          <>
            <button className="instructorMainPage-all_reports" onClick = {openFrame}> Reports </button>
            <button className="instructorMainPage-sign_grade_form"> Criteria Form </button>
            <button className="instructorMainPage-sign_grade_form"> Grade Form </button>
            <div className="instructorMainPage-display_inline">
              <h4 className="instructorMainPage-student_name">Name: Ece Ateş</h4>
            </div>
            <h4 className="instructorMainPage-student_course">Course: CS299</h4>
            <h4 className="instructorMainPage-student_check">TA Check: Passed</h4>
            <h4 className="instructorMainPage-student_status">Status: {status}</h4>
          </>
        )
      }
    </div>

  ); 
}

export default InstructorMainPage;