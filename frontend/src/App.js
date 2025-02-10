import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    NAME: "",
    PHONE: "",
    EMAIL: "",
    LINKEDIN: "",
    GITHUB: "",
    education: [],
    experience: [],
    projects: [],
    techSkills: {
      languages: [],
      frameworks: [],
      tools: [],
      libraries: [],
    },
  });

  const addSection = (key) => {
    const defaultValues = {
      education: { institution: "", degree: "", location: "", startDate: "", endDate: "" },
      experience: { company: "", title: "", location: "", startDate: "", endDate: "", bullets: [] },
      projects: { name: "", startDate: "", endDate: "", bullets: [], techStack: [] },
    };
    setFormData({ ...formData, [key]: [...formData[key], defaultValues[key]] });
  };

  const removeSection = (key, index) => {
    const updatedSections = formData[key].filter((_, idx) => idx !== index);
    setFormData({ ...formData, [key]: updatedSections });
  };

  const handleInputChange = (key, index, field, value) => {
    const updatedSections = [...formData[key]];
    updatedSections[index][field] = value;
    setFormData({ ...formData, [key]: updatedSections });
  };

  const formatDateRange = (startDate, endDate) => {
    return startDate && endDate ? `${startDate} – ${endDate}` : startDate || endDate || "";
  };

  
  const handleSkillAdd = (category, value) => {
    if (value && !formData.techSkills[category].includes(value)) {
      setFormData({
        ...formData,
        techSkills: {
          ...formData.techSkills,
          [category]: [...formData.techSkills[category], value],
        },
      });
    }
  };

  const handleSkillRemove = (category, value) => {
    setFormData({
      ...formData,
      techSkills: {
        ...formData.techSkills,
        [category]: formData.techSkills[category].filter((skill) => skill !== value),
      },
    });
  };

  // Add a tech stack item to a specific project
  const handleTechStackAdd = (projectIndex, value) => {
    if (value && !formData.projects[projectIndex].techStack?.includes(value)) {
      const updatedProjects = [...formData.projects];
      updatedProjects[projectIndex].techStack = [
        ...(updatedProjects[projectIndex].techStack || []),
        value,
      ];
      setFormData({ ...formData, projects: updatedProjects });
    }
  };

  // Remove a tech stack item from a specific project
  const handleTechStackRemove = (projectIndex, value) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[projectIndex].techStack = updatedProjects[projectIndex].techStack.filter(
      (tech) => tech !== value
    );
    setFormData({ ...formData, projects: updatedProjects });
  };

  const addBullet = (key, index, bullet) => {
    const updatedSections = [...formData[key]];
    updatedSections[index].bullets.push(bullet);
    setFormData({ ...formData, [key]: updatedSections });
  };

  const removeBullet = (key, index, bulletIndex) => {
    const updatedSections = [...formData[key]];
    updatedSections[index].bullets.splice(bulletIndex, 1);
    setFormData({ ...formData, [key]: updatedSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format data with combined date ranges for submission
    const formattedData = {
      ...formData,
      education: formData.education.map((edu) => ({
        ...edu,
        date: formatDateRange(edu.startDate, edu.endDate),
      })),
      experience: formData.experience.map((exp) => ({
        ...exp,
        dates: formatDateRange(exp.startDate, exp.endDate),
      })),
      projects: formData.projects.map((proj) => ({
        ...proj,
        date: formatDateRange(proj.startDate, proj.endDate),
      })),
    };

    try {
      const response = await axios.post("http://localhost:5000/generate-resume", formattedData, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error generating resume:", error);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Resume Generator</h1>
        <p>Fill in the form below to generate your professional resume</p>
      </header>

      <form onSubmit={handleSubmit} className="resume-form">
        {/* Personal Information */}
        <section className="form-section">
          <h2>Personal Information</h2>
          <div className="input-group">
            <input type="text" placeholder="Full Name" value={formData.NAME} onChange={(e) => setFormData({ ...formData, NAME: e.target.value })} required />
            <input type="text" placeholder="Phone Number" value={formData.PHONE} onChange={(e) => setFormData({ ...formData, PHONE: e.target.value })} required />
            <input type="email" placeholder="Email Address" value={formData.EMAIL} onChange={(e) => setFormData({ ...formData, EMAIL: e.target.value })} required />
            <input type="text" placeholder="LinkedIn URL" value={formData.LINKEDIN} onChange={(e) => setFormData({ ...formData, LINKEDIN: e.target.value })} />
            <input type="text" placeholder="GitHub URL" value={formData.GITHUB} onChange={(e) => setFormData({ ...formData, GITHUB: e.target.value })} />
          </div>
        </section>

        {/* Education Section */}
        <section className="form-section">
          <h2>Education</h2>
          {formData.education.map((edu, index) => (
            <div key={index} className="input-group">
              <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => handleInputChange("education", index, "institution", e.target.value)} />
              <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => handleInputChange("education", index, "degree", e.target.value)} />
              <input type="text" placeholder="Location" value={edu.location} onChange={(e) => handleInputChange("education", index, "location", e.target.value)} />
              <input type="text" placeholder="Start Date (e.g., Aug 2022)" value={edu.startDate} onChange={(e) => handleInputChange("education", index, "startDate", e.target.value)} />
              <input type="text" placeholder="End Date (e.g., May 2025)" value={edu.endDate} onChange={(e) => handleInputChange("education", index, "endDate", e.target.value)} />
              <button type="button" className="remove-btn" onClick={() => removeSection("education", index)}>Remove Education</button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={() => addSection("education")}>Add Education</button>
        </section>

        {/* Experience Section */}
        <section className="form-section">
          <h2>Experience</h2>
          {formData.experience.map((exp, index) => (
            <div key={index} className="input-group">
              <input type="text" placeholder="Company" value={exp.company} onChange={(e) => handleInputChange("experience", index, "company", e.target.value)} />
              <input type="text" placeholder="Title" value={exp.title} onChange={(e) => handleInputChange("experience", index, "title", e.target.value)} />
              <input type="text" placeholder="Location" value={exp.location} onChange={(e) => handleInputChange("experience", index, "location", e.target.value)} />
              <input type="text" placeholder="Start Date (e.g., May 2022)" value={exp.startDate} onChange={(e) => handleInputChange("experience", index, "startDate", e.target.value)} />
              <input type="text" placeholder="End Date (e.g., Present)" value={exp.endDate} onChange={(e) => handleInputChange("experience", index, "endDate", e.target.value)} />
              <div className="bullets">
                <div className="bullet-input-group">
                  <input type="text" placeholder="Describe experience in short sentences (e.g., Improved performance by 30%)" onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      addBullet("experience", index, e.target.value.trim());
                      e.target.value = "";
                    }
                  }} />
                  <button type="button" className="add-btn" onClick={() => {
                    const inputField = document.querySelector(`.bullets input`);
                    if (inputField && inputField.value.trim()) {
                      addBullet("experience", index, inputField.value.trim());
                      inputField.value = "";
                    }
                  }}>+</button>
                </div>
                <ul className="bullet-list">
                  {exp.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>
                      {bullet}
                      <button type="button" className="remove-btn" onClick={() => removeBullet("experience", index, bulletIndex)}>×</button>
                    </li>
                  ))}
                </ul>
              </div>
              <button type="button" className="remove-btn" onClick={() => removeSection("experience", index)}>Remove Experience</button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={() => addSection("experience")}>Add Experience</button>
        </section>

        {/* Projects Section */}
        <section className="form-section">
          <h2>Projects</h2>
          {formData.projects.map((proj, index) => (
            <div key={index} className="input-group">
              <input type="text" placeholder="Project Name" value={proj.name} onChange={(e) => handleInputChange("projects", index, "name", e.target.value)} />
              <input type="text" placeholder="Start Date (e.g., May 2022)" value={proj.startDate} onChange={(e) => handleInputChange("projects", index, "startDate", e.target.value)} />
              <input type="text" placeholder="End Date (e.g., Present)" value={proj.endDate} onChange={(e) => handleInputChange("projects", index, "endDate", e.target.value)} />
              <div className="bullets">
                <div className="bullet-input-group">
                  <input type="text" placeholder="Add bullet point (e.g., Developed a real-time dashboard)" onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      addBullet("projects", index, e.target.value.trim());
                      e.target.value = "";
                    }
                  }} />
                  <button type="button" className="add-btn" onClick={(e) => {
                    const inputField = e.target.previousElementSibling;
                    if (inputField && inputField.value.trim()) {
                      addBullet("projects", index, inputField.value.trim());
                      inputField.value = "";
                    }
                  }}>+</button>
                </div>
                <ul className="bullet-list">
                  {proj.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>
                      {bullet}
                      <button type="button" className="remove-btn" onClick={() => removeBullet("projects", index, bulletIndex)}>×</button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="tech-stack">
                <h3>Tech Stack</h3>
                <div className="skills-tags">
                  {proj.techStack &&
                    proj.techStack.map((tech, techIndex) => (
                      <span key={techIndex} className="skill-tag">
                        {tech}
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => handleTechStackRemove(index, tech)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                </div>
                <input
                  type="text"
                  placeholder="Add tech stack (e.g., React, Node.js)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      e.preventDefault();
                      handleTechStackAdd(index, e.target.value.trim());
                      e.target.value = "";
                    }
                  }}
                />
              </div>

              <button type="button" className="remove-btn" onClick={() => removeSection("projects", index)}>Remove Project</button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={() => addSection("projects")}>Add Project</button>
        </section>

        {/* Technical Skills */}
        <section className="form-section">
          <h2>Technical Skills</h2>
          {Object.keys(formData.techSkills).map((category) => (
            <div key={category} className="skills-section">
              <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
              <div className="skills-tags">
                {formData.techSkills[category].map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}{" "}
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => handleSkillRemove(category, skill)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder={`Add ${category}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value) {
                    e.preventDefault();
                    handleSkillAdd(category, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          ))}
        </section>

        <button type="submit" className="generate-button">Generate Resume</button>
      </form>
    </div>
  );
}

export default App;
