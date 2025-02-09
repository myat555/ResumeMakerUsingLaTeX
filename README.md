
# Resume Maker Using LaTeX

Web application that generates professional resumes using Jake's Resume LaTeX template. The application provides:
- **A REST API** for PDF generation
- **A React-based frontend** for form-based resume creation

## Prerequisites
To run this application locally, you need the following installed on your system:
- **Node.js** (version 18 or higher) and **npm** (version 9 or higher)
- **Docker** (version 24 or higher, for containerized deployment)
- **LaTeX Distribution** (e.g., MiKTeX, TeX Live, or MacTeX)
  - Required to compile LaTeX templates to PDF
  - See the [LaTeX Installation Guide](#latex-installation-guide) for setup instructions.

## Features
1. **REST API**: Backend handles LaTeX template population and PDF generation via HTTP POST requests.
2. **Frontend Application**: A React-based UI for creating resumes with form inputs.
3. **Docker Deployment**: Easily deployable using Docker and Docker Compose.
4. **Customizable LaTeX Templates**: Edit the `resume_template.tex` to adjust resume formats.

---

## Installation
### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ResumeMakerUsingLaTeX.git
cd ResumeMakerUsingLaTeX
```

### 2. Install Dependencies
#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

---

## Running the Application Locally
### 1. Start the Backend
Navigate to the `backend` directory:
```bash
cd backend
node server.js
```
The backend server will be running at `http://localhost:3000`.

### 2. Start the Frontend
Navigate to the `frontend` directory:
```bash
cd ../frontend
npm start
```
The frontend will be accessible at `http://localhost:8080`.

---

## Docker Deployment
You can also deploy the application using Docker for an isolated, production-ready setup.

### Build and Start Containers
```bash
docker-compose up --build
```

### Access Services:
- **Backend**: `http://localhost:3000`
- **Frontend**: `http://localhost:8080`

---

## API Usage
### Test the API with Sample Data
Use the provided shell script to test API functionality with sample JSON files:
```bash
cd backend/test_api
./test_resume_api.sh
```

### Test Manually with `curl`:
```bash
curl -X POST -H "Content-Type: application/json"      -d @resume1.json      http://localhost:3000/generate-pdf
```

- The output PDFs are generated in `backend/output/`.

---

## Frontend Application
1. Open your browser and go to `http://localhost:8080`.
2. Fill out the form with your resume details.
3. Use the **Preview JSON** option to review the payload sent to the backend.
4. Click **Generate Resume** to create and download your professional PDF.

---

## LaTeX Installation Guide
To use this application, you must have a LaTeX distribution installed. Here’s how to set it up for your operating system:

### Windows
1. Download and install **MiKTeX**: [https://miktex.org/download](https://miktex.org/download)
2. During installation, enable the "Install missing packages on the fly" option.
3. Add `pdflatex` to your system PATH (usually done automatically).

### macOS
1. Download and install **MacTeX**: [https://tug.org/mactex/](https://tug.org/mactex/)
2. After installation, verify by running `pdflatex --version` in the terminal.

### Linux
1. Install **TeX Live** using your package manager:
   ```bash
   sudo apt update
   sudo apt install texlive-full
   ```
2. Verify the installation by running:
   ```bash
   pdflatex --version
   ```

---

## How the Backend Works
1. Receives a POST request with JSON payload to `/generate-pdf`.
2. Populates the LaTeX template (`backend/templates/resume_template.tex`) using the provided data.
3. Compiles the template to PDF using `pdflatex`.
4. Sends the generated PDF as the response and cleans up temporary files.

---


### Additional Notes
- For any LaTeX compilation issues, ensure your LaTeX distribution is fully installed and functional.
- Modify `resume_template.tex` to customize the resume's format and styling.
- Clean up temporary files and output files in the backend's `output` directory after processing.


