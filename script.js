const studentForm = document.getElementById("studentForm");
const successMessage = document.getElementById("successMessage");
const dismissMessage = document.getElementById("dismissMessage");
const studentTableBody = document.getElementById("studentTableBody");
const totalStudents = document.getElementById("totalStudents");
const successfulSubmissions = document.getElementById("successfulSubmissions");
const departmentCount = document.getElementById("departmentCount");
const entryCount = document.getElementById("entryCount");

let students = [];
let submissionCount = 0;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

function updateDashboard() {
  totalStudents.textContent = students.length;
  successfulSubmissions.textContent = submissionCount;
  departmentCount.textContent = new Set(students.map((student) => student.department)).size;
  entryCount.textContent = `${students.length} ${students.length === 1 ? "entry" : "entries"}`;
}

function renderStudents() {
  if (students.length === 0) {
    studentTableBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="5">
          <div class="empty-state">
            <span>♙</span><strong>No student entries yet</strong>
            <p>Submit the registration form to see a demo entry here.</p>
          </div>
        </td>
      </tr>`;
    updateDashboard();
    return;
  }

  studentTableBody.innerHTML = students.map((student) => `
    <tr>
      <td><span class="student-name">${escapeHTML(student.name)}</span>
          <span class="student-email">${escapeHTML(student.email)}</span></td>
      <td>${escapeHTML(student.rollNumber)}</td>
      <td>${escapeHTML(student.department)}</td>
      <td>${escapeHTML(student.year)}</td>
      <td><span class="status-badge">Submitted</span></td>
    </tr>`).join("");

  updateDashboard();
}

studentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Browser validation runs before this handler for required fields and email format.
  if (!studentForm.checkValidity()) {
    studentForm.reportValidity();
    return;
  }

  const formData = new FormData(studentForm);
  const student = {
    name: formData.get("studentName").trim(),
    rollNumber: formData.get("rollNumber").trim(),
    email: formData.get("email").trim(),
    department: formData.get("department"),
    year: formData.get("year")
  };

  students.unshift(student);
  submissionCount += 1;
  renderStudents();

  successMessage.hidden = false;
  successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
  studentForm.reset();
});

dismissMessage.addEventListener("click", () => {
  successMessage.hidden = true;
});

studentForm.addEventListener("reset", () => {
  // Hide the old confirmation when the user clears the form.
  window.setTimeout(() => {
    successMessage.hidden = true;
  }, 0);
});

renderStudents();
