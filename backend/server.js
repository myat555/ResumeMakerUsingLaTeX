const express = require("express");
const fs = require("fs-extra");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Directory paths
const TEMPLATE_PATH = path.join(__dirname, "templates", "resume_template.tex");
const OUTPUT_DIR = path.join(__dirname, "output");

// Ensure output directory exists
fs.ensureDirSync(OUTPUT_DIR);

// Function to sanitize URLs
const sanitizeURL = (url) => url.replace(/https?:\/\/(www\.)?/g, "");

// Function to escape LaTeX special characters
const escapeLatex = (str) => {
    if (!str) return "";
    return str
        .replace(/\\/g, "\\textbackslash{}")  // Handle backslashes first
        .replace(/&/g, "\\&")  // Handle ampersand
        .replace(/%/g, "\\%")  // Handle percentage
        .replace(/\$/g, "\\$")  // Handle dollar sign
        .replace(/#/g, "\\#")  // Handle hash
        .replace(/_/g, "\\_")  // Handle underscore
        .replace(/{/g, "\\{")  // Handle curly braces
        .replace(/}/g, "\\}")  // Handle curly braces
        .replace(/\^/g, "\\textasciicircum{}")  // Handle caret
        .replace(/~/g, "\\textasciitilde{}");  // Handle tilde
};

// Function to generate LaTeX content dynamically
const generateLatexFile = (userData) => {
    let latexTemplate = fs.readFileSync(TEMPLATE_PATH, "utf8");

    // Replace personal information placeholders
    const personalInfo = {
        "NAME": userData.NAME || "",
        "PHONE": userData.PHONE || "",
        "EMAIL": userData.EMAIL || "",
        "LINKEDIN": sanitizeURL(userData.LINKEDIN || ""),
        "GITHUB": sanitizeURL(userData.GITHUB || "")
    };
        
    Object.keys(personalInfo).forEach((key) => {
            latexTemplate = latexTemplate.replace(new RegExp(`{{${key}}}`, "g"), personalInfo[key]);
    });
    

    // Replace education placeholders
    const formatEducation = (edu) => `
        \\resumeSubheading
        {${escapeLatex(edu.institution)}}{\\textnormal{${escapeLatex(edu.location)}}}
        {${escapeLatex(edu.degree)}}{${escapeLatex(edu.date)}}
    `;
    latexTemplate = latexTemplate.replace("{{EDUCATION}}", userData.education.map(formatEducation).join("\n"));

    // Replace experience placeholders
    const formatExperience = (exp) => `
        \\resumeSubheading
        {${escapeLatex(exp.title)}}{\\textnormal{${escapeLatex(exp.dates)}}}
        {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
        \\resumeItemListStart
            ${exp.bullets.map(bullet => `\\resumeItem{${escapeLatex(bullet)}}`).join("\n")}
        \\resumeItemListEnd
    `;
    latexTemplate = latexTemplate.replace("{{EXPERIENCE}}", userData.experience.map(formatExperience).join("\n"));

    // Replace projects placeholders with tech stack
    const formatProject = (proj) => `
        \\resumeProjectHeading
        {${escapeLatex(proj.name)} $|$ \\emph{\\textnormal{\\textit{${proj.techStack.map(escapeLatex).join(", ")}}}}}{\\textnormal{${escapeLatex(proj.date)}}}
        \\resumeItemListStart
            ${proj.bullets.map(bullet => `\\resumeItem{${escapeLatex(bullet)}}`).join("\n")}
        \\resumeItemListEnd
    `;
    latexTemplate = latexTemplate.replace("{{PROJECTS}}", userData.projects ? userData.projects.map(formatProject).join("\n") : "\\vspace{-10pt}");

    // Replace technical skills
    const technicalSkillsContent = `
        \\textbf{Languages}{: ${userData.techSkills.languages.join(", ") || "None"}} \\\\
        \\textbf{Frameworks}{: ${userData.techSkills.frameworks.join(", ") || "None"}} \\\\
        \\textbf{Developer Tools}{: ${userData.techSkills.tools.join(", ") || "None"}} \\\\
        \\textbf{Libraries}{: ${userData.techSkills.libraries.join(", ") || "None"}}
    `;
    latexTemplate = latexTemplate.replace("{{TECHNICAL_SKILLS}}", technicalSkillsContent);

    

    // Generate unique file name
    const fileName = `resume_${Date.now()}.tex`;
    const filePath = path.join(OUTPUT_DIR, fileName);

    // Write modified LaTeX content to file
    fs.writeFileSync(filePath, latexTemplate);
    return filePath;
};

// Route to handle resume generation
app.post("/generate-resume", async (req, res) => {
    try {
        const userData = req.body;

        // Generate the LaTeX file with user data
        const texFilePath = generateLatexFile(userData);
        const pdfFilePath = texFilePath.replace(".tex", ".pdf");

        // Run pdflatex to compile LaTeX into PDF
        exec(`pdflatex -interaction=nonstopmode -output-directory=${OUTPUT_DIR} ${texFilePath}`, (error, stdout, stderr) => {
            if (error) {
                console.warn("LaTeX Compilation Warning/Error:", stderr);
                if (!fs.existsSync(pdfFilePath)) {
                    return res.status(500).json({
                        error: "Critical LaTeX compilation error. PDF could not be generated.",
                        details: stderr,
                    });
                }
            }

            console.log("PDF Generated Successfully:", pdfFilePath);
            res.download(pdfFilePath, "resume.pdf", () => {
                // Cleanup generated files after sending the response
                fs.removeSync(texFilePath);
                fs.removeSync(pdfFilePath);
            });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
