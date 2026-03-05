# Professional AI-Powered Portfolio

A modern, high-performance personal portfolio built with **React 19**, **Vite**, and **Tailwind CSS**, featuring an interactive AI assistant powered by **Mistral AI**.

## 🚀 Key Features

-   **🤖 Mistral AI Chat**: An embedded AI assistant that can answer questions about my skills, experience, and projects in real-time.
-   **✨ Modern UI/UX**: Sleek Glassmorphism design with professional micro-animations (Vanilla Tilt).
-   **📱 Fully Responsive**: Optimized for all devices, from mobile to ultra-wide monitors.
-   **⚡ Performance First**: Powered by Vite for near-instant load times and HMR.
-   **📩 Contact Integration**: Functional contact form powered by EmailJS.

## 🛠️ Tech Stack

-   **Frontend**: React 19, JavaScript (ES6+), Tailwind CSS 4.
-   **AI Integration**: Mistral AI API (`mistral-small-latest`).
-   **Build Tool**: Vite.
-   **Animations**: Vanilla-tilt.js.
-   **Email**: EmailJS.

## 📦 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18+) or [Bun](https://bun.sh/)
-   Mistral AI API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/zaid0091/PortFolio.git
    cd PortFolio/portfolio
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    # or
    npm install
    ```

3.  **Setup Environment Variables:**
    Create a `.env` file in the `portfolio` root and add your keys:
    ```env
    VITE_MISTRAL_API_KEY=your_mistral_api_key_here
    VITE_EMAILJS_SERVICE_ID=your_service_id
    VITE_EMAILJS_TEMPLATE_ID=your_template_id
    VITE_EMAILJS_PUBLIC_KEY=your_public_key
    ```

4.  **Run Development Server:**
    ```bash
    bun run dev
    # or
    npm run dev
    ```

## 📂 Project Structure

-   `src/components/`: Modular UI components (Chat, Hero, Projects, etc.).
-   `src/services/`: API integration for Mistral AI and external services.
-   `src/data/`: Centralized resume data for easy updates.
-   `src/hooks/`: Custom React hooks for shared logic.

## 👤 Author

**Zaid Liaqat**
-   **Title**: Full-Stack Software Engineer
-   **LinkedIn**: [linkedin.com/in/zaid-liaqat-075b8b25b](https://linkedin.com/in/zaid-liaqat-075b8b25b)
-   **GitHub**: [@zaid0091](https://github.com/zaid0091)
-   **Email**: [zaidliaqat999@gmail.com](mailto:zaidliaqat999@gmail.com)

---
Built with ❤️ and Mistral AI.
