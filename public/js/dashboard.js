document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('userName').innerText = user.fullName || 'User';
  document.getElementById('userRole').innerText = user.role || 'N/A';
  document.getElementById('userCategory').innerText = user.studentCategory || 'N/A';

  try {
    const res = await fetch('/api/courses', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    const container = document.getElementById('courseContainer');
    
    // If user is Admin, they can see students, tutors, and courses[span_5](start_span)[span_5](end_span)
    if (user.role === 'Admin') {
      let html = `<h3>System Overview (Admin)</h3>`;
      
      html += `<h4>Registered Students (${data.students.length})</h4><ul>`;
      data.students.forEach(s => { html += `<li>${s.fullName} (${s.email}) - ${s.studentCategory}</li>`; });
      html += `</ul>`;

      html += `<h4 style="margin-top:15px;">Registered Tutors (${data.tutors.length})</h4><ul>`;
      data.tutors.forEach(t => { html += `<li>${t.fullName} (${t.email})</li>`; });
      html += `</ul>`;

      html += `<h4 style="margin-top:15px;">Courses Offered</h4><div class="course-grid">`;
      data.courses.forEach(c => {
        html += `<div class="course-card"><h3>${c.title}</h3><p>${c.description}</p><p><strong>Tutor:</strong> ${c.tutor}</p></div>`;
      });
      html += `</div>`;
      
      container.innerHTML = html;
      return;
    }

    // For Tutors and Students (seeing courses)
    const courses = data.courses;
    if (!courses || courses.length === 0) {
      container.innerHTML = '<p>No courses found.</p>';
      return;
    }

    container.innerHTML = courses
      .map(
        (c) => `
      <div class="course-card">
        <h3>${c.title}</h3>
        <p style="margin: 10px 0; color: #555;">${c.description}</p>
        <p><strong>Category:</strong> ${c.category}</p>
        <p><strong>Tutor:</strong> ${c.tutor}</p>
      </div>
    `
      )
      .join('');
  } catch (err) {
    alert('Session expired or error loading data. Please login again.');
    logout();
  }
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}