# B5A7 - Portfolio Website

🌐 **Portfolio Website** built with NextJS, TypeScript, Tailwind CSS, and a Node.js/Express backend with MongoDB/Mongoose.  
This project allows a portfolio owner to manage blogs, projects, and personal content via a secure private dashboard while serving public pages for visitors.

---

## Project Overview

The portfolio website consists of:

- **Public Pages:** Accessible to all visitors (no login required)  
  - Blog listing and individual blog pages  
  - About Me section  
  - Project showcase

- **Private Pages:** Owner-only access  
  - Login and authentication  
  - Dashboard to manage blogs, projects, and other content  

---

## Tech Stack

- **Frontend:** NextJS + TypeScript + Tailwind CSS  
- **Backend:** Node.js + Express.js + JWT + bcrypt  
- **Database:** PostgreSQL + Prisma OR MongoDB + Mongoose  
- **Notifications:** react-hot-toast  
- **Optional Rich Text Editor:** React Quill or similar  

---

## Features

### Public Pages (Accessible to All Visitors)

1. **Blog Management**
   - View all blogs and individual blog pages.
   - **ISR (Incremental Static Regeneration)** for blog listing (`getStaticProps`) and individual blog pages (`getStaticPaths + revalidate`) to fetch updated content dynamically.

2. **About Me Section**
   - Static personal details (name, bio, contact info, skills, work experience).
   - Uses **SSG** for fast performance.

3. **Project Showcase**
   - Display projects with thumbnail, live link, description, and features.
   - Supports dynamic updates using **ISR**.

### Private Pages (Owner Only)

1. **Authentication & Authorization**
   - JWT-based authentication.
   - Owner access only.
   - Admin user seeded during backend setup.
   - Passwords hashed using bcrypt.

2. **Dashboard**
   - Manage blogs, projects, and other content dynamically.
   - Owner-only access with secure login.


### Backend Setup

1. **Install Dependencies**

```bash
cd backend
npm install
