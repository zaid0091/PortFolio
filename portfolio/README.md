# Modern Neo-Brutalist Portfolio & Admin Panel

A high-performance, visually striking portfolio website built with **React**, **Vite**, and **Supabase**. Featuring a "Neo-Brutalist" design language with bold shadows, stark borders, and vibrant accents.

## 🚀 Features

- **Neo-Brutalist UI**: Unique aesthetic with a custom design system built using Vanilla CSS.
- **Dynamic Projects**: Manage your portfolio projects via an authenticated admin dashboard.
- **Blog Engine**: Full Markdown support for blog posts.
- **Supabase Integration**: Real-time database and secure authentication.
- **Mobile-First**: Fully responsive across all devices including a specialized admin layout.
- **AI Chat**: Integrated Mistral AI for interactive queries.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router
- **Styling**: Vanilla CSS (Design System)
- **Backend/DB**: Supabase (PostgreSQL)
- **Icons**: Lucide React, FontAwesome
- **AI**: Mistral AI API

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Mistral AI
VITE_MISTRAL_API_KEY=your_mistral_key

# EmailJS (Optional/If used)
VITE_EMAILJS_SERVICE_ID=your_id
VITE_EMAILJS_TEMPLATE_ID=your_id
VITE_EMAILJS_PUBLIC_KEY=your_key
```

## 📦 Getting Started

1. **Clone and Install**:
   ```bash
   npm install
   ```

2. **Run Locally**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 🏗️ Admin Panel

The admin panel is accessible at `/admin`. It allows you to:
- **Manage Projects**: Add, Edit, and Delete projects with live previews.
- **Manage Blogs**: Create and publish Markdown blog posts.
- **Authentication**: Secure logging via Supabase Auth.

---
Built with ❤️ by [Your Name]
