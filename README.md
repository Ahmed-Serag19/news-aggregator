# 📰 News Aggregator

A **React.js** & **TypeScript** based news aggregator that fetches articles from multiple sources and allows users to **search, filter, and customize** their news feed. The project is **fully containerized** with Docker for easy deployment.

---

## 🚀 Features

- ✅ **Fetch articles from multiple APIs** (e.g., NewsAPI, The Guardian, NYT)
- ✅ **Article search & filtering** (by keyword, date, category, source)
- ✅ **Personalized news feed** (users can customize sources & categories)
- ✅ **Mobile-responsive design** (optimized for different devices)
- ✅ **Debounced API requests** (to avoid excessive calls & improve performance)
- ✅ **Optimized React performance** (using React Query & efficient state management)
- ✅ **Follows best practices** (DRY, KISS, SOLID principles)
- ✅ **Containerized with Docker** (for easy deployment)

---

## 📦 Technologies Used

- **Frontend:** React.js (with TypeScript)
- **Styling:** Tailwind CSS
- **State Management:** React Query (`@tanstack/react-query`)
- **Routing:** React Router
- **API Requests:** Axios
- **Icons & UI Components:** Radix UI, Lucide React
- **Notifications:** React Toastify
- **Date Handling:** Date-fns
- **Utility Libraries:** clsx, uuid
- **Linting & Formatting:** ESLint, TypeScript
- **Build & Dev Server:** Vite
- **Containerization:** Docker

---

## 📂 Project Structure

📦 news-agg ├── 📁 src │ ├── 📁 components # Reusable UI components │ ├── 📁 pages # Page components │ ├── 📁 context # Context API for global state │ ├── 📁 api # API calls (Axios) │ ├── 📁 hooks # Custom hooks │ ├── 📁 utils # Helper functions │ ├── 📁 styles # Tailwind CSS setup │ ├── main.tsx # Entry point │ ├── App.tsx # Main App component │ ├── router.tsx # App routing ├── 📄 Dockerfile # Docker setup ├── 📄 docker-compose.yml # Docker Compose setup ├── 📄 package.json # Dependencies & scripts ├── 📄 tsconfig.json # TypeScript configuration └── 📄 README.md # Project documentation

yaml
Copy
Edit

---

## 🔧 Getting Started

### 1️⃣ Prerequisites

Ensure you have the following installed:

- **Node.js** (LTS recommended)
- **Yarn or npm**
- **Docker** (if running with containers)

### 2️⃣ Installation

Clone the repository:

```sh
git clone https://github.com/your-repo/news-aggregator.git
cd news-aggregator
Install dependencies:

sh
Copy
Edit
npm install
3️⃣ Running the Application
Start the development server:

sh
Copy
Edit
npm run dev
The application will be available at:

sh
Copy
Edit
http://localhost:3000
🐳 Running with Docker
If you prefer to run the app in a Docker container, follow these steps:

1️⃣ Build the Docker Image
sh
Copy
Edit
docker build -t news-aggregator .
2️⃣ Run the Container
sh
Copy
Edit
docker run -d -p 3000:80 news-aggregator
Now, open:

sh
Copy
Edit
http://localhost:3000
3️⃣ Stopping the Container
sh
Copy
Edit
docker ps  # Find container ID
docker stop <container_id>
4️⃣ Using Docker Compose
If you use Docker Compose, simply run:

sh
Copy
Edit
docker-compose up -d
To stop:

sh
Copy
Edit
docker-compose down
🛠️ Best Practices Followed
✅ Code Quality
DRY (Don't Repeat Yourself) - Reusable components & utility functions
KISS (Keep It Simple, Stupid) - Simple, readable code
SOLID Principles (Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion)
Performance Optimizations (Debounce API requests, Lazy loading components)
✅ API Handling
Uses React Query for caching & state management
Debounced API calls (1.5s delay) to prevent excessive requests
Error handling for failed API calls
Supports multiple API sources (NewsAPI, The Guardian, NYT)
✅ UI/UX
Radix UI for accessibility-friendly components
Tailwind CSS for responsive design
Dark mode support (optional)
🔍 Search & Filtering
How Search Works?
Users type a keyword, triggering a debounced API call (1.5s delay).
The app fetches articles from multiple APIs.
Users can filter results by:
Date range (using a calendar picker)
Category (e.g., Sports, Tech, Business)
Source (e.g., The Guardian, NYT)
Personalized News Feed
Users can customize their news preferences (by source, category, and authors).
This data is stored in React Context for a seamless experience.
📜 License
This project is licensed under the MIT License.

💡 Contributing
Want to contribute? Feel free to fork the repo and submit a pull request! 🚀

🛠️ Troubleshooting
Port Already in Use?
Try running on a different port:

sh
Copy
Edit
docker run -d -p 5000:80 news-aggregator
Application Not Loading?
Check logs:

sh
Copy
Edit
docker logs <container_id>
Docker Command Not Found?
Ensure Docker is installed and added to your system's PATH.

🙌 Support
For any issues or questions, open an issue on GitHub or contact the maintainers.

```
