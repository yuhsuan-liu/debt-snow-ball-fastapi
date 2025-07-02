# 📄 Debt Snowball Planner (FastAPI + React)

**Description**  
Debt Snowball Planner is a full-stack personal finance app that helps users plan and accelerate their debt repayment using the debt snowball method. Users can enter multiple debts, specify their monthly payment budget, and view a step-by-step payoff plan.

The app is built with:
- **Backend:** Python (FastAPI) — for API endpoints, debt calculations, and future AI integrations. Deployed on Render
- **Frontend:** React (TypeScript)— for interactive user experience, deployed on GitHub Pages.
- **Database:** PostgreSQL — planned for future login, record saving, and data persistence.

---

## 🚀 Features

✅ **Current Features (MVP)**
- Input multiple debts (name, balance, minimum payment, interest rate).
- Enter monthly payment budget.
- Generate a detailed month-by-month debt snowball repayment plan.
- Display results in JSON (ready for integration into charts/tables).

✅ **Planned Features**
- User authentication (Google login) to save records.
- PostgreSQL database for persistent user data.
- Email reminders for payments.
- AI chatbot integration (OpenAI) for personalized debt advice.
- Expose the algorithm as a dedicated API endpoint that other LLMs can interact with (via structured JSON API, not strictly MCV but similar concept).
- Mobile-responsive UI.
- Export plan as CSV or PDF.

---

## 💻 Tech Stack

| Layer      | Technology                |
|------------|---------------------------|
| Frontend   | React (TypeScript)        |
| Backend    | Python, FastAPI, Pydantic |
| Database   | PostgreSQL.               |
| Hosting    | Frontend: GitHub Pages, Backend: Render |
| AI/LLM Integration | OpenAI API (future) |

---

## 📐 Project Structure

```
snowball_fastapi/
├── frontend/                      # React app (TypeScript)
│   ├── src/
│   │   ├── components/           # React components
│   │   │   └── DebtList.tsx
│   │   ├── services/             # API service layer
│   │   │   └── api.ts
│   │   ├── types/                # TypeScript types
│   │   │   └── debt.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── backend/                      # FastAPI app (Python)
│   ├── main.py                   # FastAPI entrypoint
│   ├── database.py               # Database connection
│   ├── init_db.py                # DB initialization script
│   ├── routers/                  # API endpoints
│   │   ├── calculate.py          # Snowball calculation endpoint
│   │   ├── payment_plan.py
│   │   └── user.py
│   ├── crud/                     # CRUD operations
│   │   ├── payment_plan.py
│   │   └── user.py
│   ├── models/                   # Database models
│   │   ├── debt.py
│   │   ├── payment_plan.py
│   │   └── user.py
│   ├── schemas/                  # Pydantic schemas
│   │   ├── debt.py
│   │   ├── payment_plan.py
│   │   └── user.py
│   ├── utils/                    # Utility functions
│   │   └── snowball.py           # Debt snowball algorithm
│   └── start_server.sh           # Backend start script

```


---

## 📊 Algorithm Overview

The app uses the **Debt Snowball Method** to help users pay off debts faster:
- Debts are sorted by balance (lowest to highest).
- Each month, payments are applied in order:
  - Interest is added to each debt.
  - Remaining payment budget is applied to pay off debts.
- The algorithm generates a month-by-month plan showing payments and remaining balances.

**Key Concepts:**
- `monthly_payment`: total budget for all debts each month.
- `remaining_payment`: tracks how much is left to distribute each month as debts are paid down.
- Plan is returned in JSON format for easy rendering on the frontend.

---

## 🛠️ Installation & Setup

### Backend (FastAPI)
1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/debt-snowball-planner.git
   cd debt-snowball-planner/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install fastapi uvicorn pydantic
   ```

4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend (React)
1. Navigate to the frontend:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the app:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

- **Frontend**: GitHub Pages
- **Backend**: Render

## 🤖 AI & LLM Integration (Planned)

- Package the debt snowball algorithm as a dedicated API endpoint
- Expose it via JSON API for LLMs to consume (structured function-calling style)
- Add an AI chatbot (OpenAI) to provide personalized debt advice

## 📩 Contact

Questions or suggestions? Open an issue or contact me at yuhsuan.career@gmail.com
