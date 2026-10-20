const API_URL = '/api/auth';

function showAlert(msg, isError = false) {
  const alertDiv = document.getElementById('alert');
  if (!alertDiv) return;
  alertDiv.style.display = 'block';
  alertDiv.className = isError ? 'alert alert-error' : 'alert alert-success';
  alertDiv.innerText = msg;
}

function toggleCategory() {
  const role = document.getElementById('role').value;
  const catGroup = document.getElementById('studentCategoryGroup');
  if (catGroup) {
    catGroup.style.display = role === 'Student' ? 'block' : 'none';
  }
}

// Handle Registration
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const studentCategory = document.getElementById('studentCategory').value;

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, role, studentCategory })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showAlert(data.message);
      registerForm.reset();
    } catch (err) {
      showAlert(err.message, true);
    }
  });
}

// Handle Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } catch (err) {
      showAlert(err.message, true);
    }
  });
}

// Auto Verify if Query String Present
window.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const email = params.get('email');

  if (window.location.pathname.includes('verify.html') && token && email) {
    try {
      const res = await fetch(`${API_URL}/verify?token=${token}&email=${email}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showAlert(data.message);
    } catch (err) {
      showAlert(err.message, true);
    }
  }
});

// Handle Resend Verification
const resendForm = document.getElementById('resendForm');
if (resendForm) {
  resendForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('resendEmail').value;
    try {
      const res = await fetch(`${API_URL}/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showAlert(data.message);
    } catch (err) {
      showAlert(err.message, true);
    }
  });
}

// Handle Forgot Password
const forgotForm = document.getElementById('forgotForm');
if (forgotForm) {
  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showAlert(data.message);
    } catch (err) {
      showAlert(err.message, true);
    }
  });
}

// Handle Reset Password
const resetForm = document.getElementById('resetForm');
if (resetForm) {
  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const email = params.get('email');
    const newPassword = document.getElementById('newPassword').value;

    try {
      const res = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showAlert(data.message);
      setTimeout(() => { window.location.href = 'login.html'; }, 2000);
    } catch (err) {
      showAlert(err.message, true);
    }
  });
}