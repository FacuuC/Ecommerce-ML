# 🛒 E-commerce with Real-Time Purchase Intent Prediction

Full-stack e-commerce application enhanced with a real-time Machine Learning system that predicts user purchase intent based on behavioral events.
This project demonstrates the end-to-end integration of ML into a production-like environment, including data generation, feature engineering, model training, and real-time inference.

---

## 🎯 Project Goal

The goal of this project is to simulate a real-world scenario where machine learning is integrated into a web application to support decision-making.

It focuses on:
- Applying ML in a real system (not just offline notebooks)
- Designing meaningful behavioral features
- Building a full pipeline from data → model → production

---

## 🧱 System Architecture

Frontend (React) → Backend (Spring Boot) → ML Service (FastAPI)

- **Frontend**: User interaction (product views, cart actions, search)
- **Backend**: Event tracking, session management, ML communication
- **ML Service**: Real-time inference using trained model

---

## 🔄 Real-Time Prediction Flow

1. User performs action (e.g. VIEW_RPODUCT)
2. Backend updates session state
3. Features are dynamically built
4. Features are sent to ML service
5. Model returns purchase probability
6. Prediction is logged and can be visualized

---

## 🧠 Machine Learning Pipeline

### 1. Synthetic Data Generation

- Simulates realistic user behavior:
    - browsing
    - cart interactions
    - search patterns
- Includes temporal dynamics and session-based logic

### 2. Feature Engineering

Features are built at session level:

- Behavioral:
  - `cart_view_ratio`
  - `view_to_cart_transition_rate`
  - `cart_cycles`

- Temporal:
  - `session_duration_seconds`
  - `time_to_first_cart`

- Engagement:
  - `events_count`
  - `repeat_views`

### 3. Model Training

Two models were evaluated:

- Random Forest
- XGBoost

#### Final Decision:

Random Forest was selected due to its robustness and lower risk of overfitting on synthetic behavioral data.

| Model        | AUC   |
|--------------|------|
| RandomForest | 0.889 |
| XGBoost      | 0.897 |

Although XGBoost performed slightly better, the improvement was not significant.

---

## 📊 Model Performance

- AUC: ~0.89
- Recall (buyers): ~0.80
- Real-time predictions per event

The model prioritizes detecting potential buyers early in the session.

---

## ⚙️ Tech Stack

- Frontend: React.js
- Backend: Java + Spring Boot
- ML: Python + FastAPI + scikit-learn
- Database: PostgreSQL

---

## 📁 Project Structure

```
ecommerce-ml-system/
│
├── frontend/
├── backend/
├── ml-service/
│
└── README.md
```
---

##🧠 Key Learnings

- Real-time ML integration in production systems
- Feature engineering from event streams
- Microservices architecture
- Handling session-based data
- End-to-end system design

---

##🔮 Future Improvements
Use real user data instead of synthetic
Evaluate deep learning models
Improve probability calibration
Add real-time UI visualization

--

#👨‍💻 Author

Facundo Costamagna
LinkedIn: www.linkedin.com/in/facucostamagna
