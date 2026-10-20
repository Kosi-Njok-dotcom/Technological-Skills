# 🚀 Fhobs Solutions Web Platform

A full-stack web application built for **Fhobs Solutions** to manage multi-tier student tracking, role-based access control, secure email verification, password recovery, and customizable course catalogs[span_1](start_span)[span_1](end_span)[span_2](start_span)[span_2](end_span).

---

## 📋 Features

### 1. Student Classification
During registration, students choose their specific training pathway[span_3](start_span)[span_3](end_span):
* **IOTS Students:** Focused on Internet of Things, hardware, and networking[span_4](start_span)[span_4](end_span).
* **IT Students:** Focused on software engineering, web development, and data analytics[span_5](start_span)[span_5](end_span).
* **Normal Basic Computer Students:** Focused on basic operations, office suites, and computer technology[span_6](start_span)[span_6](end_span).

### 2. Role-Based Access Control (RBAC)
* **Student Dashboard:** Displays courses tailored specifically to the student's classification[span_7](start_span)[span_7](end_span).
* **Tutor Dashboard:** Grants access to view platform courses[span_8](start_span)[span_8](end_span).
* **Admin Dashboard:** Provides an administrative overview tracking registered students, active tutors, and all courses offered by Fhobs Solutions[span_9](start_span)[span_9](end_span).

### 3. Authentication & Security
* Password hashing using `bcryptjs`.
* JSON Web Token (JWT) based session protection.
* Email verification upon signup and resend functionality via `Nodemailer`[span_10](start_span)[span_10](end_span).
* Forgotten password recovery and password reset workflow[span_11](start_span)[span_11](end_span).

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** JSON Web Tokens (JWT), bcryptjs
* **Mailing:** Nodemailer (SMTP / Gmail)
* **Frontend:** HTML5, CSS3, Vanilla JavaScript

---

## 📁 Project Directory Structure

```text
fhobs-solutions/
├── .env
├── package.json
├── README.md
├── server.js
├── config/
│   └── db.js
├── models/
│   ├── User.js
│   └── Course.js
├── middleware/
│   └── auth.js
├── controllers/
│   ├── authController.js
│   └── courseController.js
├── routes/
│   ├── authRoutes.js
│   └── courseRoutes.js
└── public/
    ├── css/
    │   └── styles.css
    ├── js/
    │   ├── auth.js
    │   └── dashboard.js
    ├── index.html
    ├── login.html
    ├── register.html
    ├── verify.html
    ├── forgot-password.html
    ├── reset-password.html
    ├── dashboard.html
    └── admin.html
