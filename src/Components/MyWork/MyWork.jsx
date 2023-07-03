import SectionTitle from "../../Utils/SectionTitle/SectionTitle";
import "./MyWork.css";
import express from "../../assets/tech/express.png";
import figma from "../../assets/tech/figma.png";
import firebase from "../../assets/tech/firebase.png";
import git from "../../assets/tech/git.png";
import javascript from "../../assets/tech/javascript.png";
import mongodb from "../../assets/tech/mongodb.png";
import nodejs from "../../assets/tech/nodejs.png";
import reactjs from "../../assets/tech/reactjs.png";
import tailwind from "../../assets/tech/tailwind.png";
import vscode from "../../assets/tech/vscode.png";
import ScrollFadeIn from "../../Utils/ScrollFadeIn/ScrollFadeIn";

const MyWork = () => {
  return (
    <section id="my-work">
      <SectionTitle heading="technologies" subHeading="What I Use" />
      <h3 className="mb-6">
        I work with <span>Technologies</span> like:
      </h3>
      <ScrollFadeIn>
        <div className="work-container space-y-3 grid md:grid-cols-2">
          <div className="flex items-center">
            <span className="bg-black p-2 mr-3 rounded-md bg-opacity-20">
              <img src={express} alt="" className="w-16" />
            </span>
            <p className="text-xl text-white font-semibold">Express Js</p>
          </div>

          <div className="flex items-center">
            <span className="bg-black p-2 mr-3 rounded-md bg-opacity-50">
              <img src={figma} alt="" className="w-16" />
            </span>
            <p className="text-xl text-white font-semibold">Figma</p>
          </div>

          <div className="flex items-center">
            <span className="bg-black p-2 mr-3 rounded-md bg-opacity-50">
              <img src={firebase} alt="" className="w-16" />
            </span>
            <p className="text-xl text-white font-semibold">Firebase</p>
          </div>

          <div className="flex items-center">
            <span className="bg-black p-2 mr-3 rounded-md bg-opacity-50">
              <img src={git} alt="" className="w-16" />
            </span>
            <p className="text-xl text-white font-semibold">Git</p>
          </div>

          <div className="flex items-center">
            <span className="bg-black p-2 mr-3 rounded-md bg-opacity-50">
              <img src={javascript} alt="" className="w-16" />
            </span>
            <p className="text-xl text-white font-semibold">JavaScript</p>
          </div>

          <div className="flex items-center">
            <span className="bg-black p-2 mr-3 rounded-md bg-opacity-50">
              <img src={mongodb} alt="" className="w-16" />
            </span>
            <p className="text-xl text-white font-semibold">MongoDB</p>
          </div>

          <div className="flex items-center">
            <span className="bg-black p-2 mr-3 rounded-md bg-opacity-50">
              <img src={nodejs} alt="" className="w-16" />
            </span>
            <p className="text-xl text-white font-semibold">Node Js</p>
          </div>

          <div className="flex items-center">
            <span className="bg-black p-2 mr-3 rounded-md bg-opacity-50">
              <img src={reactjs} alt="" className="w-16" />
            </span>
            <p className="text-xl text-white font-semibold">React JS</p>
          </div>

          <div className="flex items-center">
            <span className="bg-black p-2 mr-3 rounded-md bg-opacity-50">
              <img src={tailwind} alt="" className="w-16" />
            </span>
            <p className="text-xl text-white font-semibold">Tailwind CSS</p>
          </div>

          <div className="flex items-center">
            <span className="bg-black p-2 mr-3 rounded-md bg-opacity-50">
              <img src={vscode} alt="" className="w-16" />
            </span>
            <p className="text-xl text-white font-semibold">VS Code</p>
          </div>
        </div>
      </ScrollFadeIn>
    </section>
  );
};

export default MyWork;
