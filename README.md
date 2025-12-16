# 🏀 CourtVision: Automated Basketball Statistics and Performance Analytics

[cite_start]CourtVision is a modern, web-based platform designed to revolutionize how amateur and collegiate basketball teams track player statistics and analyze performance[cite: 1, 14, 27]. [cite_start]By moving away from time-consuming, error-prone manual tracking methods [cite: 12, 13][cite_start], CourtVision provides coaches and managers with instant, accurate, and data-driven insights to improve player development and in-game strategy[cite: 19, 31].

---

## ✨ Features & Essential Transactions

[cite_start]CourtVision provides a comprehensive suite of tools built on a three-tier architecture [cite: 75] to deliver an integrated basketball analytics experience.

### 1. Automated Analytics Engine (Application Layer)
* [cite_start]**Instant Metric Computation:** The system automatically calculates simple and advanced basketball metrics upon data input[cite: 15, 17].
* [cite_start]**Key Advanced Metrics:** Includes Effective Field Goal Percentage ($eFG\%$), True Shooting Percentage ($TS\%$), and Player Efficiency Rating ($PER$)[cite: 15, 84].
* [cite_start]**Player Module:** Deals with player profiles, historical records, and computed performance averages[cite: 92].

### 2. Streamlined Data Entry (Presentation Layer)
* [cite_start]**Game Module:** Provides data entry for every game, including points, assists, rebounds, steals, and blocks[cite: 90].
* [cite_start]**Live Recording:** Coaches can record statistics live or post-game [cite: 91] [cite_start]using the responsive **ReactJS** frontend[cite: 80].
* [cite_start]**Physical Metrics:** Manages the calculation of physical-based metrics statistics[cite: 25].

### 3. System Management & Security
* [cite_start]**Role-Based Dashboards:** Provides specific dashboards for admins and coaches[cite: 95, 105].
* [cite_start]**Authentication Module:** Uses **JSON Web Token (JWT)** to secure user sessions[cite: 64, 94].
* [cite_start]**Centralized Data:** MySQL stores relational entities linking players, games, and statistical records[cite: 85, 109].

---

## 💻 Technology Stack

[cite_start]CourtVision utilizes a robust three-tier architecture [cite: 75][cite_start], ensuring modularity, scalability, and ease of maintenance[cite: 75].

### ⚙️ Stack Summary
| Layer | Component | Technology | Purpose |
| :---: | :---: | :---: | :--- |
| **Frontend** | Presentation Layer | [cite_start]**ReactJS** [cite: 60, 57] | [cite_start]Provides a responsive and interactive user interface[cite: 80]. |
| **Backend** | Application Layer | [cite_start]**Spring Boot (Java)** [cite: 61, 57] | [cite_start]Contains the business logic for computation and mediates between the UI and database[cite: 82, 83]. |
| **Database** | Data Layer | [cite_start]**MySQL** [cite: 62, 58] | [cite_start]Stores player profiles, game records, and computed analytics[cite: 58]. |
| **Security** | Authentication | [cite_start]**JSON Web Token (JWT)** [cite: 64, 94] | [cite_start]Implements security for user sessions[cite: 105]. |
| **Deployment** | Hosting | [cite_start]**AWS** [cite: 65] | Cloud hosting for the application server. |

---

## 🚀 Getting Started

### Prerequisites

* **Backend:** Java 17 or later, Maven, MySQL / MariaDB instance.
* **Frontend:** Node.js and npm (LTS recommended).

### Project Structure

* **`backend/CourtVision`**: Spring Boot application.
    * `src/main/java/cit/edu/capstone/CourtVision`: Contains `controller`, `entity`, `repository`, and `service` layers.
    * `src/main/resources/application.properties`: DB and application configuration.
* **`frontend`**: React Single Page Application (SPA).
    * `src/components`, `src/pages`, `src/styles`: UI components and pages for admin, coach, and player flows.
    * `src/utils/axiosConfig.js`: API base URL and Axios instance configuration.

### Running the Backend (Spring Boot)

1.  **Configure Database:** Edit the database connection and credentials in `backend/CourtVision/src/main/resources/application.properties`.
    * `spring.datasource.url`
    * `spring.datasource.username` / `spring.datasource.password`
2.  **Build and Run:** From the project root:

    ```bash
    cd backend/CourtVision
    mvn clean package -DskipTests
    mvn spring-boot:run
    ```

    The API runs on `http://localhost:8080`.

### Running the Frontend (React)

1.  **Configure API Base URL:** Edit the `baseURL` in `frontend/src/utils/axiosConfig.js` to point to your backend host (e.g., `http://localhost:8080/api` in development).
2.  **Install and Start:** From the project root:

    ```bash
    cd frontend
    npm install
    npm start
    ```

    The application will start on `http://localhost:3000`.

---

## 🔮 Future Enhancements (Recommendations)

[cite_start]Future development focuses on transforming CourtVision into a full-fledged sports intelligence platform[cite: 142].

* [cite_start]**Video Analytics Integration:** Integrate Computer Vision (e.g., OpenCV, TensorFlow) to automatically process video footage and detect actions (shots, assists, rebounds), drastically reducing manual data entry and error[cite: 149, 150].
* [cite_start]**AI-Based Predictions:** Incorporate machine learning algorithms to forecast player performance, fatigue, or contributions in upcoming matches based on historical data[cite: 145, 146].
* [cite_start]**Offline Mode and Mobile Support:** Implement local caching or PWA technology to allow coaches to record statistics on-site without continuous internet connectivity[cite: 154, 155].
* [cite_start]**Multi-Sport Expansion:** Apply the modular core architecture to support other sports like volleyball or football[cite: 151, 153].

---

## 🤝 Authors

[cite_start]CourtVision was developed by researchers at the Cebu Institute of Technology University[cite: 8].

* [cite_start]Alec Gerald C. Ricaña [cite: 3]
* [cite_start]Dymur Dame S. Maquiling [cite: 4]
* [cite_start]Joshua Y. Jamisola [cite: 5]
* [cite_start]Redgel Gregory G. Mefañia [cite: 6]
* [cite_start]Virtue M. Lazaga [cite: 7]
