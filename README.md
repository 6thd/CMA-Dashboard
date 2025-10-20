# CMA Admin Dashboard

A modern, full-stack web application built with .NET 8 and React TypeScript for managing CMA exam preparation and administration.

[![CI/CD Pipeline](https://github.com/6thd/CMA-Dashboard/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/6thd/CMA-Dashboard/actions/workflows/ci-cd.yml)

## ?? Features

- **Modern React Frontend**: Built with React 18, TypeScript, and Vite
- **Responsive UI**: Tailwind CSS for responsive, mobile-first design
- **Internationalization**: Multi-language support (English/Arabic) with i18next
- **PDF Processing**: Handle and display PDF documents with pdf.js
- **AI Integration**: Google Generative AI integration for advanced features
- **Data Visualization**: Rich charts and analytics with Recharts
- **.NET 8 Backend**: Modern ASP.NET Core backend with minimal APIs
- **Type-Safe**: Full TypeScript support with strict mode enabled

## ?? Prerequisites

- **Node.js** v20 or later ([Download](https://nodejs.org/))
- **.NET 8 SDK** ([Download](https://dotnet.microsoft.com/download/dotnet/8.0))
- **Visual Studio 2022** (recommended) or VS Code
- **Git** for version control

## ??? Installation

### 1. Clone the Repository

```bash
git clone https://github.com/6thd/CMA-Dashboard.git
cd CMA-Dashboard
```

### 2. Setup Frontend

```bash
cd CMA.Web/ClientApp
npm install
```

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:

```env
API_KEY=your-gemini-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here
VITE_API_URL=https://localhost:5001
```

### 3. Setup Backend

```bash
cd ../..
dotnet restore
```

## ?? Running the Application

### Development Mode

**Option 1: Run Both Together (Recommended)**

Open the solution in Visual Studio 2022 and press `F5`. This will:
- Start the .NET backend
- Automatically build the React frontend
- Open your browser to the application

**Option 2: Run Separately**

Terminal 1 (Backend):
```bash
cd CMA.Web
dotnet run
```

Terminal 2 (Frontend):
```bash
cd CMA.Web/ClientApp
npm run dev
```

The application will be available at:
- Backend: https://localhost:5001
- Frontend Dev Server: http://localhost:3001

### Production Build

```bash
# Build frontend
cd CMA.Web/ClientApp
npm run build

# Build and run backend
cd ..
dotnet build --configuration Release
dotnet run --configuration Release
```

## ?? Development Workflow

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run type-check
```

### Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run quality checks: `npm run lint && npm run type-check`
4. Commit: `git commit -m "Description of changes"`
5. Push: `git push origin feature/your-feature`
6. Create a Pull Request

## ?? Docker Deployment

### Build Docker Image

```bash
docker build -t cma-dashboard .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

The application will be available at `http://localhost:5000`

## ?? Project Structure

```
CMA-Dashboard/
??? .github/workflows/       # CI/CD pipelines
??? CMA.Web/                 # Backend .NET project
?   ??? ClientApp/           # React TypeScript frontend
?   ?   ??? components/      # Reusable React components
?   ?   ??? pages/           # Page components
?   ?   ??? contexts/        # React contexts
?   ?   ??? services/        # API service layer
?   ?   ??? utils/           # Utility functions
?   ?   ??? config/          # Configuration files
?   ?   ??? public/          # Static assets
?   ??? Controllers/         # API controllers
?   ??? Middleware/          # Custom middleware
?   ??? Models/              # Data models
?   ??? wwwroot/             # Built frontend (generated)
??? Resources/               # Localization resources
??? SimpleTest/              # Test projects
```

## ?? Configuration

### Frontend Configuration

- **Vite Config**: `CMA.Web/ClientApp/vite.config.ts`
- **TypeScript Config**: `CMA.Web/ClientApp/tsconfig.json`
- **Tailwind Config**: `CMA.Web/ClientApp/tailwind.config.ts`
- **ESLint Config**: `CMA.Web/ClientApp/.eslintrc.json`

### Backend Configuration

- **App Settings**: `CMA.Web/appsettings.json`
- **Launch Settings**: `CMA.Web/Properties/launchSettings.json`
- **Project File**: `CMA.Web/CMA.Web.csproj`

## ?? Key Dependencies

### Frontend
- **React** 18.2.0 - UI library
- **TypeScript** 5.8.2 - Type safety
- **Vite** 7.1.9 - Build tool
- **Tailwind CSS** 3.4.1 - Styling
- **React Router** 6.22.0 - Routing
- **i18next** 25.6.0 - Internationalization
- **Recharts** 3.2.1 - Data visualization
- **pdf.js** 4.0.269 - PDF rendering

### Backend
- **.NET** 8.0 - Runtime
- **ASP.NET Core** 8.0 - Web framework
- **iText7** 8.0.4 - PDF generation

## ?? Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and quality checks
5. Submit a pull request

## ?? License

This project is private and proprietary.

## ?? Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team

## ?? Additional Documentation

- [Setup Instructions](SETUP_INSTRUCTIONS.md)
- [SDK Conversion Notes](SDK_CONVERSION.md)
- [Project Summary](PROJECT_SUMMARY.md)

---

Built with ?? using .NET 8 and React