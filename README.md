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

## ⚙️ Project Structure

car-marketplace/
├── configs/ # Configuration files
├── dataconnect/ # Data connectors
├── dataconnect-generated/ # Auto-generated DB connectors
├── drizzle/ # Drizzle ORM migrations/schemas
├── public/ # Static assets
├── src/ # Main application source
│ ├── components/ # UI Components
│ ├── assets/ # Images & Icons
│ ├── shared/ # Shared types or configs
│ ├── utils/ # Utility functions
│ ├── add-listing/ # Add car listings
│ ├── listing-details/ # View listing
│ ├── profile/ # User profiles
│ ├── search/ # Search page
│ ├── contact.tsx # Contact page
│ ├── home.tsx # Homepage
│ ├── main.tsx # App Entry
│ └── index.css # Global styles
├── drizzle.config.ts # Drizzle ORM config
├── firebase.json # Firebase hosting config
├── storage.rules # Firebase storage rules
├── tailwind.config.ts # Tailwind setup
├── vite.config.ts # Vite bundler config
├── package.json # Project metadata & scripts
└── README.md # You're reading this


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

##🤝 Contributing
###🧩 Steps to Contribute
Fork the repository

Clone your fork:
git clone https://github.com/yourname/car-marketplace.git

Create a branch:
git checkout -b feat/your-feature-name

Make your changes

Commit: git commit -m "feat: add dark mode toggle"
Push:
git push origin feat/your-feature-name

Create a Pull Request on GitHub

 Contribution Rules
✅ Use conventional commits (feat:, fix:, docs:)
✅ Use eslint and prettier (auto-run via pre-commit hooks)
✅ Link issues in your PR description
❌ Don't commit node_modules, .env, or build files



📜 License
This project is licensed under the MIT License.

🤝 Maintainers
@yourusername
@contributors

🔐 Security
Please report security issues via security.md.
We take privacy and security very seriously.

💬 Discussions
Join the conversation in the GitHub Discussions.

🙌 Acknowledgements
Inspired by open source projects like:

AutoTrader
Carvana

