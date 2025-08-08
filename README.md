# React + TypeScript + Vite

https://car-marketplace-web-app-seven.vercel.app/

# 🚗 Car Marketplace

A modern full-stack car listing marketplace built using **React**, **TypeScript**, **Tailwind CSS**, and **PostgreSQL** with **Drizzle ORM**.

---

## 📁 Tech Stack

### 🔹 Core Technologies
- **React 19** + **TypeScript**
- **Tailwind CSS** + **ShadCN UI**
- **React Router DOM v7**
- **Node.js** + **Express 5**
- **PostgreSQL** + **Drizzle ORM**
- **Cloudinary** (for image upload/preview)
- **Vite** (for build & dev)

---


## 🚀 Features

- ✅ Add / Edit / Delete car listings
- ✅ Upload and manage car images with Cloudinary
- ✅ Feature selection using checkboxes (stored as JSONB)
- ✅ Form validation and toast notifications
- ✅ Firebase Storage Rules ready
- ✅ Dark mode planned (WIP)
- ✅ Modern component styling (ShadCN + Tailwind)

---

## 📦 Getting Started

### 📌 Prerequisites

- Node.js `v18+`
- PostgreSQL `v14+`
- Cloudinary Account

### 🔧 Install Dependencies

`bash`

npm install

🔑 Environment Setup
Create a .env file in the root with:

DATABASE_URL=postgres://user:password@localhost:5432/car_marketplace
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret  

`bash`
npm run dev         # Start Vite dev server
npm run build       # Production build
npm run preview     # Preview build
npm run lint        # Lint project


| Command       | Description               |
| ------------- | ------------------------- |
| `db:push`     | Push schema to database   |
| `db:studio`   | Visual Studio (DB viewer) |
| `db:generate` | Generate types            |
| `db:check`    | Validate schema vs DB     |
| `db:migrate`  | Apply migrations          |

`bash`
npm run db:push
npm run db:studio


