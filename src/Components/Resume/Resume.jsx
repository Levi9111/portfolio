import SectionTitle from "../../Utils/SectionTitle/SectionTitle";
import Table from "../Table/Table";
import "./Resume.css";

const Resume = () => {
  return (
    <section id="resume">
      <SectionTitle heading="Summary" subHeading="Resume" />
      {/* education */}
      <div className="education">
        <h4>My Education</h4>
        <div className="">
          <span className="year">2020</span>
          <p>Chittagong College, Chattogram, Bangladesh</p>
        </div>
      </div>

      {/* courses */}
      <div className="courses">
        <h4>My Courses</h4>
        <div className="w-full">
          <Table />
        </div>
      </div>
    </section>
  );
};

export default Resume;
