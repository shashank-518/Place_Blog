# Place Blog – Share & Discover Places 🌍

**[https://place-blog-h4ur.vercel.app/]()**  
**GitHub Repo:** https://github.com/shashank-518/Place_Blog.git

---

## 📌 Project Overview  
Place Blog is a responsive web application that enables users to **share travel destinations or memorable places**, upload images and descriptions, and explore posts from other users. Built with the **MERN stack** (MongoDB, Express, React, Node.js) and styled using Tailwind CSS, it emphasises clean UI, smooth user experience, and meaningful content sharing.

---

## ✨ Key Features  
- User registration & login (JWT authentication)  
- Create posts for places: upload images, add descriptions & location  
- Interactive map view of shared places  
- Dashboard showing user’s posts and stats  
- Image storage via Cloudinary (or your preferred service)  
- Clean, modern UI with React + Tailwind CSS  
- Server-side REST API (Node.js / Express) with MongoDB (Mongoose) for database interactions  
- Well-structured code for scalability and maintainability  

---

## 🧰 Tech Stack  
| Layer       | Technologies                                 |
|-------------|---------------------------------------------|
| Frontend    | React, Tailwind CSS, Map API (Google/Leaflet) |
| Backend     | Node.js, Express                             |
| Database    | MongoDB with Mongoose                        |
| Storage     | Cloudinary (image uploads)                   |
| Auth        | JWT (JSON Web Tokens)                        |

---

## 🚀 Setup & Installation  
1. Clone the repo  
   ```bash
   git clone https://github.com/shashank-518/Place_Blog.git
   cd Place_Blog

MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret

# backend
cd backend
npm install

# frontend
cd ../frontend
npm install


