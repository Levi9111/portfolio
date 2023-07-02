import SectionTitle from "../../Utils/SectionTitle/SectionTitle";
import "./Resume.css";
import ProgressBar from "@ramonak/react-progress-bar";

const Resume = () => {
  return (
    <section id="resume">
      <SectionTitle heading="Summary" subHeading="Resume" />
      {/* education */}
      <div className="px-6 md:max-w-6xl mx-auto ">
        <div className="education">
          <h4 className="text-2xl font-semibold text-white mb-3">
            My Education
          </h4>
          <div className="education-container bg-black bg-opacity-30">
            <span className="year">2020</span>
            <h3 className="text-2xl text-white font-semibold mt-2">HSC</h3>
            <p className="resume-text">
              Chittagong College, <span>Chattogram, Bangladesh</span>
            </p>
          </div>
        </div>

        {/* courses */}
        <div className="courses">
          <h4 className="text-2xl font-semibold text-white my-3">My Courses</h4>
          <div className="courses-container">
            <table className="courses-table">
              <tr>
                <td>Advance CSS and SASS</td>
                <td>Jonas Schmedtmann</td>
                <td>Udemy</td>
              </tr>
              <tr>
                <td>Complete JavaScript Course</td>
                <td>Jonas Schmedtmann</td>
                <td>Udemy</td>
              </tr>
              <tr>
                <td>Complete Web Development Dootcamp</td>
                <td>Angela Yu</td>
                <td>Udemy</td>
              </tr>
              <tr>
                <td>
                  Complete Web Development <br /> with Jhankar Mahbub
                </td>
                <td>Jhankar Mahbub</td>
                <td>Programming Hero</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
