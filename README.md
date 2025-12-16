# 🏀 CourtVision: Automated Basketball Statistics and Performance Analytics

CourtVision is a modern, web-based platform designed to revolutionize how amateur and collegiate basketball teams track player statistics and analyze performance. By moving away from time-consuming, error-prone manual tracking methods , CourtVision provides coaches and managers with instant, accurate, and data-driven insights to improve player development and in-game strategy.

---

## ✨ Features & Essential Transactions

CourtVision provides a comprehensive suite of tools built on a three-tier architecture to deliver an integrated basketball analytics experience.

### 1. Automated Analytics Engine (Application Layer)
* The system automatically calculates simple and advanced basketball metrics upon data input.
- **Key Advanced Metrics:** Includes Effective Field Goal Percentage ($eFG\%$), True Shooting Percentage ($TS\%$), and Player Efficiency Rating ($PER$).
- **Player Module:** Deals with player profiles, historical records, and computed performance averages.

### 2. Streamlined Data Entry (Presentation Layer)
- **Game Module:** Provides data entry for every game, including points, assists, rebounds, steals, and blocks.
- **Live Recording:** Coaches can record statistics live or post-game using the responsive **ReactJS** frontend.
- **Physical Metrics:** Manages the calculation of physical-based metrics statistics.

### 3. System Management & Security
- **Role-Based Dashboards:** Provides specific dashboards for admins and coaches.
- **Authentication Module:** Uses **JSON Web Token (JWT)** to secure user sessions.
- **Centralized Data:** MySQL stores relational entities linking players, games, and statistical records.

---

## 💻 Technology Stack

CourtVision utilizes a robust three-tier architecture, ensuring modularity, scalability, and ease of maintenance.

### ⚙️ Stack Summary
| Layer | Component | Technology | Purpose |
| :---: | :---: | :---: | :--- |
| **Frontend** | Presentation Layer | **ReactJS** | Provides a responsive and interactive user interface. |
| **Backend** | Application Layer | **Spring Boot (Java)** | Contains the business logic and mediates between the UI and database. |
| **Database** | Data Layer | **MySQL** | Stores player profiles, game records, and computed analytics. |
| **Security** | Authentication | **JSON Web Token (JWT)** | Implements security for user sessions. |
| **Deployment** | Hosting | **AWS** | Cloud hosting for the application server. |

---

## 🚀 Getting Started

### Prerequisites

- **Backend:** Java 17 or later, Maven, MySQL / MariaDB instance.
- **Frontend:** Node.js and npm (LTS recommended).

### Project Structure

- **`backend/CourtVision`**: Spring Boot application.
* `src/main/java/cit/edu/capstone/CourtVision`: Contains `controller`, `entity`, `repository`, and `service` layers.
* `src/main/resources/application.properties`: DB and application configuration.
- **`frontend`**: React Single Page Application (SPA).
* `src/components`, `src/pages`, `src/styles`: UI components and pages for admin, coach, and player flows.
* `src/utils/axiosConfig.js`: API base URL and Axios instance configuration.

### Running the Backend (Spring Boot)

1. **Configure Database:** Edit the database connection and credentials in `backend/CourtVision/src/main/resources/application.properties`.
* `spring.datasource.url`
* `spring.datasource.username` / `spring.datasource.password`
2. **Build and Run:** From the project root:

```bash
cd backend/CourtVision
mvn clean package -DskipTests
mvn spring-boot:run
```

The API runs on `http://localhost:8080`.

### Running the Frontend (React)

1. **Configure API Base URL:** Edit the `baseURL` in `frontend/src/utils/axiosConfig.js` to point to your backend host (e.g., `http://localhost:8080/api` in development).
2. **Install and Start:** From the project root:

```bash
cd frontend
npm install
npm start
```

The application will start on `http://localhost:3000`.

---

## 🔮 Future Enhancements (Recommendations)

Future development focuses on transforming CourtVision into a full-fledged sports intelligence platform.

- **Video Analytics Integration:** Introduce computer vision techniques (e.g., OpenCV, TensorFlow) to automatically process game footage and detect actions, drastically reducing manual entry and error.
- **AI-Based Predictions:** Integrate machine learning algorithms to forecast player performance, fatigue, or contributions in upcoming matches based on historical data.
- **Offline Mode and Mobile Support:** Implement local caching or PWA technology to allow coaches to record statistics in locations without internet access, with automatic data synchronization upon reconnection.
- **Multi-Sport Expansion:** Apply the modular core architecture to support other sports, such as volleyball or football.

---

## 🤝 Authors

CourtVision was developed by students at the Cebu Institute of Technology University.

* Alec Gerald C. Ricaña
* Dymur Dame S. Maquiling
* Joshua Y. Jamisola
* Redgel Gregory G. Mefañia
* Virtue M. Lazaga
