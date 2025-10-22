# CMA Admin Dashboard

A comprehensive admin dashboard for CMA (Certified Management Accountant) exam preparation system with AI-powered knowledge base capabilities.

## Features

- **Admin Dashboard**: Full-featured administration panel for managing students, exams, questions, and results
- **AI Knowledge Base**: Intelligent system for processing and querying CMA curriculum content
- **PDF Processing**: Upload and parse CMA curriculum PDFs for AI context
- **Exam Management**: Create, edit, and manage CMA exams and questions
- **Student Tracking**: Monitor student progress, achievements, and performance analytics
- **Audit Logging**: Comprehensive audit trail of all administrative actions
- **Responsive Design**: Mobile-friendly interface built with React and TypeScript

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **AI Integration**: Perplexity API for intelligent assistance
- **State Management**: Redux
- **Routing**: React Router v7
- **Data Visualization**: Recharts
- **PDF Processing**: PDF.js

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Build for production: `npm run build`

## Project Structure

```
ClientApp/
├── components/          # Reusable UI components
├── contexts/            # React contexts
├── data/                # Static data files
├── pages/               # Page components
├── services/            # Business logic and API services
├── src/                 # CSS and other source files
└── vite.config.ts       # Vite configuration
```

## Key Components

- **SettingsPage**: Configure AI knowledge base with PDF upload capability
- **AIAssistant**: Chat interface for querying the knowledge base
- **Dashboard**: Overview of system metrics and analytics
- **Exam Management**: Tools for creating and managing exams
- **Student Management**: Track and manage student accounts

## PDF Processing

The system can process CMA curriculum PDFs and extract text content for use with the AI assistant. If PDF processing fails, fallback options are available including pre-loaded curriculum data.

## License

This project is proprietary and intended for educational purposes.
