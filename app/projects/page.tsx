import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Shafeeq Sadiq's Projects",
};

// Featured Projects
const featuredProjects = [
  {
    title: "Patient Monitoring Dashboard",
    description:
      "A real-time patient monitoring system designed to track vital signs and predict potential health emergencies in elderly patients living alone.",
    url: "https://github.com/shafeeqsadiq/Patient-Monitoring-Dashboard", // Replace with the actual URL of your project if available
  },
  {
    title: "Microplastic Detection",
    description:
      "A deep learning project to detect microplastics in images using the YOLOv5 object detection model.",
    url: "https://github.com/shafeeqsadiq/Microplastic-Detection", // Replace with the actual URL of your project if available
  },
];

// Side Projects
const sideProjects = [
  {
    title: "Grocery Shopping List App",
    description:
      "A Kotlin-based Android application that helps users manage their grocery shopping list with features to add, delete, and track items along with their quantities and prices.",
    url: "https://github.com/shafeeqsadiq/grocery-app", // Replace with the actual URL of your project if available
  },
  {
    title: "Student Reporting System",
    description:
      "This Java project implements a Student Reporting System that manages student records, their marks across different subjects and semesters, and provides various analytical functionalities.",
    url: "https://github.com/shafeeqsadiq/StudentsReportingSystem", // Replace with the actual URL of your project if available
  },
  {
    title: "React Native Todo App",
    description:
      "A Todo list application built with React Native that offers a clean user interface and persistent storage functionality.",
    url: "https://github.com/shafeeqsadiq/Todo-reactapp", // Replace with the actual URL of your project if available
  },
  {
    title: "Custom Python Datetime Library",
    description:
      "A Python library that provides an enhanced datetime handling system with additional utility methods and a user-friendly interface.",
    url: "https://github.com/shafeeqsadiq/Python-Datetime-custom-library", // Replace with the actual URL of your project if available
  },
  {
    title: "Flask Twitter API Simulator",
    description:
      "A simple Flask-based RESTful API that simulates basic Twitter functionality. This API provides endpoints for retrieving, filtering, and creating tweets using a JSON file as data storage.",
    url: "https://github.com/shafeeqsadiq/Flask-Twitter-API", // Replace with the actual URL of your project if available
  },
  {
    title: "Airbnb Listings API",
    description:
      "A Flask-based RESTful API that manages Airbnb listings. This API provides comprehensive endpoints for creating, reading, updating, and deleting (CRUD) Airbnb listing data, with data persistence using JSON file storage.",
    url: "https://github.com/shafeeqsadiq/Airbnb-Listings-API", // Replace with the actual URL of your project if available
  },
];

export default function Projects() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tight">Projects</h1>

      {/* Featured Projects Section */}
      <div className="mb-12">
        <h2 className="mb-6 text-xl font-semibold tracking-tight">
          Featured Projects
        </h2>
        <div>
          {featuredProjects.map((project, index) => (
            <Link
              key={index}
              href={project.url}
              className="flex flex-col space-y-1 mb-5 transition-opacity duration-200 hover:opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <h3 className="text-black dark:text-white">{project.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 tracking-tight">
                  {project.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Side Projects Section */}
      <div>
        <h2 className="mb-6 text-xl font-semibold tracking-tight">
          Side Projects
        </h2>
        <div>
          {sideProjects.map((project, index) => (
            <Link
              key={index}
              href={project.url}
              className="flex flex-col space-y-1 mb-5 transition-opacity duration-200 hover:opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <h3 className="text-black dark:text-white">{project.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 tracking-tight">
                  {project.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
