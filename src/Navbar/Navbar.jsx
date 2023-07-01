import "./Navbar.css";
import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

const Navbar = () => {
  const [active, setActive] = useState(false);

  const handleActive = () => {
    setActive(!active);
  };

  return (
    <section className="navbar flex justify-between items-center px-3 py-4">
      <div className="flex items-center">
        <img src={logo} alt="" className="h-6 w-6" />
        <h1 className="ml-2 font-bold text-xl">Shanjid Ahmad</h1>
      </div>

      <div className="text-lg space-x-3 hidden md:block">
        <NavLink className="link" to="/">
          Home
        </NavLink>
        <NavLink className="link" to="/about">
          About Me
        </NavLink>
        <NavLink className="link" to="/services">
          What I Do
        </NavLink>
        <NavLink className="link" to="/resume">
          Resume
        </NavLink>
        <NavLink className="link" to="/portfolio">
          Portfolio
        </NavLink>
        <NavLink className="link" to="/contact">
          Contact
        </NavLink>
      </div>

      {/* Responsive */}
      <div className="block md:hidden relative">
        <button onClick={handleActive}>
          <FaBars />
        </button>
        <div
          className={`flex flex-col absolute -right-3 ${
            active ? "mt-3" : "-mt-96"
          }    space-y-3 px-4 py-3 bg-[#232323] w-screen`}
        >
          <NavLink className="link active-link" to="/">
            Home
          </NavLink>
          <NavLink className="link active-link" to="/about">
            About Me
          </NavLink>
          <NavLink className="link active-link" to="/services">
            What I Do
          </NavLink>
          <NavLink className="link active-link" to="/resume">
            Resume
          </NavLink>
          <NavLink className="link active-link" to="/portfolio">
            Portfolio
          </NavLink>
          <NavLink className="link active-link" to="/contact">
            Contact
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default Navbar;
