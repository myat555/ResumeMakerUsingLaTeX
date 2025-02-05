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

// Function to replace placeholders in the LaTeX template
const generateLatexFile = (userData) => {
    let latexTemplate = fs.readFileSync(TEMPLATE_PATH, "utf8");

    // Replace placeholders with user-provided values
    Object.keys(userData).forEach((key) => {
        const placeholder = `{{${key}}}`;
        latexTemplate = latexTemplate.replace(new RegExp(placeholder, "g"), userData[key] || "");
    });

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

        // Run pdflatex (or xelatex for better font support) to compile LaTeX into PDF
        exec(`pdflatex -output-directory=${OUTPUT_DIR} ${texFilePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error("LaTeX Compilation Error:", stderr);
                return res.status(500).json({ error: "Failed to generate PDF" });
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
