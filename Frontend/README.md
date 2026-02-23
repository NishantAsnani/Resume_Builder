# Resume Builder

**Resume Builder** is a full‑stack web application that helps users quickly generate professional PDF resumes through a simple, intuitive interface. The project is divided into `Backend` and `Frontend` folders and demonstrates a typical React + Node/Express architecture with Tailwind CSS for styling and PDF generation via `pdfkit`.

---

## 🧱 Project Structure

```
Resume_Builder/
├── Backend/        # Express server that handles resume data and PDF creation
│   ├── app.js
│   ├── package.json
│   └── public/     # static assets served by the backend
├── Frontend/       # React application powered by Vite
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── readme.md       # this file
```

---

## 🚀 Features

- Enter personal details (name, contact info, address)
- Write an objective/summary statement
- Dynamically add and remove multiple skills
- Preview form data before submission
- Generate and download a PDF resume instantly

---

## 🛠️ Technologies Used

| Layer     | Technologies                             |
|-----------|------------------------------------------|
| Frontend  | React, Vite, Tailwind CSS, Axios         |
| Backend   | Node.js, Express, pdfkit                 |
| Build/Dev | npm / yarn, ESLint, Prettier             |

---

## 🏁 Getting Started

These instructions assume you have [Node.js](https://nodejs.org/) installed.

### 1. Clone the repository

```bash
git clone https://github.com/NishantAsnani/Resume_Builder.git
cd Resume_Builder
```

### 2. Install dependencies

#### Backend
```bash
cd Backend
npm install        # or yarn
```

#### Frontend
```bash
cd ../Frontend
npm install        # or yarn
```

### 3. Run the application

Open two terminal windows/tabs.

- **Backend server:**
  ```bash
  cd Backend
  npm start        # or node app.js (depending on package.json script)
  ```
  By default, the server listens on `http://localhost:5000` (adjust if configured).

- **Frontend development:**
  ```bash
  cd Frontend
  npm run dev      # starts Vite dev server on http://localhost:3000
  ```

Then visit `http://localhost:3000` in your browser and start building a resume!

> 🔁 The frontend proxies API requests to the backend (check `vite.config.js`).

---

## 🧪 Testing

_No automated tests are included yet._

Feel free to add Jest/React Testing Library for frontend or Mocha/Chai for backend.

---

## 🤝 Contributing

Contributions are very welcome. To propose a change:
1. Fork the repository
2. Create a branch (`git checkout -b feature/xyz`)
3. Commit your changes
4. Open a pull request describing your work

Please make sure any new code is well-documented and tested (where applicable).

---

## 📄 License

This project is offered under the [MIT License](LICENSE) – feel free to use and adapt it freely.

---

> Happy building! 🎉

