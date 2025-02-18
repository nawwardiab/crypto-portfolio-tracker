During the SPA Module, I embarked upon learning new technologies while building this Crypto Portfolio Tracker to familiarize myself with Next.js, Firebase, Redux, responsive and modular design, clean code and clean architecture best practices.

---

# 📊 Crypto Portfolio Tracker

A **Next.js**-powered cryptocurrency portfolio tracking system that enables users to **manage their digital assets**, **track real-time prices**, **view historical trends**, and **analyze portfolio performance**. The app integrates **CoinGecko API** for real-time price updates and **Firebase Firestore** for persistent portfolio storage.

## 🚀 Features

### 🏦 User Features

- **Add & Manage Crypto Assets** – Users can add their cryptocurrency holdings.
- **Real-time Price Updates** – Fetches live price data from CoinGecko.
- **Track Portfolio Value** – View total portfolio value in USD and EUR.
- **View Historical Price Trends** – Interactive charts for asset trends.
- **Secure Authentication** – Firebase authentication for user accounts.
- **Dark/Light Mode** – Theme toggling for a better UX.

### 📊 Analytical Features

- **Portfolio Summary** – Overview of total value, gains/losses, and top-performing assets.
- **Interactive Charts** – Displaying portfolio distribution and asset trends.
- **Asset Allocation Visualization** – Pie chart representation of portfolio distribution.

### 🛠 Technical Features

- **Next.js 15** – Server-side rendering and optimized frontend.
- **Redux Toolkit** – Global state management for authentication and portfolio data.
- **Firebase Firestore** – Secure, cloud-based portfolio storage.
- **CoinGecko API** – Fetches real-time and historical crypto price data.
- **Material UI** – Modern and responsive UI components.
- **Chart.js** – Data visualization for asset trends and portfolio value.

---

## 📂 Project Structure

```
/crypto-portfolio-tracker
│── /app
│   ├── /portfolio
│   │   ├── page.js
│   ├── page.js
│   ├── layout.js
│── /components
│   ├── /portfolio
│   │   ├── PortfolioManager.js
│   │   ├── PortfolioDetails.js
│   │   ├── PortfolioChart.js
│   │   ├── AssetTrendChart.js
│   │   ├── AddAssetForm.js
│   │   ├── DeleteConfirmationDialog.js
|   │── /theme
│   |   ├── ThemeContext.jsx
│   |   ├── theme.js
│   ├── Navbar.js
│   ├── ClientProvider.js
│── /features
│   ├── authSlice.js
│   ├── portfolioSlice.js
│   ├── store.js
│── /services
│   ├── firestoreService.js
│   ├── coingeckoService.js
│   ├── useFirebaseAuth.js
│── /styles
│   ├── globals.css
│── /public
│── package.json
│── README.md
```

---

## 🏗️ Tech Stack

| **Technology**         | **Purpose**                      |
| ---------------------- | -------------------------------- |
| **Next.js 15**         | Frontend framework               |
| **React.js**           | UI components                    |
| **Redux Toolkit**      | Global state management          |
| **Firebase Firestore** | Cloud-based portfolio storage    |
| **CoinGecko API**      | Fetching real-time crypto prices |
| **Chart.js**           | Data visualization               |
| **Material UI**        | UI components                    |

---

## 🔧 Installation & Setup

### 📥 Clone the Repository

```sh
git clone https://github.com/nawwardiab/crypto-portfolio-tracker.git
cd crypto-portfolio-tracker
```

### 📦 Install Dependencies

```sh
npm install
```

### ▶️ Run the Development Server

```sh
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📌 Key Components Overview

### 🔑 **Authentication System** (`useFirebaseAuth.js`)

- Uses Firebase Authentication to handle **user sign-up, login, and state management**.
- Listens to auth state changes and updates the Redux store.

### 📊 **Portfolio Manager** (`PortfolioManager.js`)

- Handles adding, editing, and deleting assets.
- Fetches and updates **portfolio data** from Firestore.

### 📉 **Asset Trend Chart** (`AssetTrendChart.js`)

- Fetches **historical price data** from CoinGecko.
- Displays an interactive **line chart** for asset price trends.

### 📈 **Portfolio Summary & Charts** (`PortfolioChart.js`)

- **Bar chart visualization** of portfolio value in **USD and EUR**.
- **Pie chart representation** of asset allocation.

### 🔍 **CoinGecko Service** (`coingeckoService.js`)

- Fetches **real-time price data**.
- Retrieves **historical price trends**.
- Implements **debounced search** for cryptocurrencies.

---

## 🔄 API Endpoints (To Be Implemented)

| Method | Endpoint         | Description                |
| ------ | ---------------- | -------------------------- |
| GET    | `/api/prices`    | Fetch crypto prices        |
| GET    | `/api/portfolio` | Fetch user portfolio       |
| POST   | `/api/portfolio` | Save/update portfolio data |

---

## 🛣 Roadmap

✅ **MVP Completed**

- User authentication
- Add/edit/delete crypto assets
- Real-time portfolio tracking
- Historical price trends

🔜 **Upcoming Features**

- Portfolio performance history
- Advanced filters for asset management
- Secure user authentication (OAuth integration)

---

## 🤝 Contributing

Want to improve this project? Contributions are welcome!

1. **Fork** the repository
2. **Create a new branch** (`git checkout -b feature-branch`)
3. **Commit changes** (`git commit -m 'Add new feature'`)
4. **Push to GitHub** (`git push origin feature-branch`)
5. **Create a Pull Request**

---

## 📩 Contact

For any questions, feel free to reach out!

📧 **LinkedIn:** [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://linkedin.com/in/nawwar-diab/)  
🔗 **GitHub:** [Nawwar Diab](https://github.com/nawwardiab)
