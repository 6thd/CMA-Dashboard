# CMA Admin Dashboard - .NET Framework Integration Setup

This document provides instructions for setting up the complete .NET Framework with React TypeScript application.

## Current Project Structure

The project has been restructured to integrate React TypeScript with .NET Framework:

```
CMA/
├── CMA.Web/
│   ├── ClientApp/           # React TypeScript frontend
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   ├── index.html
│   │   ├── index.tsx
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── ...
│   ├── Controllers/         # .NET MVC Controllers
│   ├── Views/               # .NET MVC Views
│   ├── wwwroot/             # Static files (built React app)
│   ├── App_Start/           # Application startup configuration
│   ├── Properties/          # Assembly information
│   ├── Global.asax          # Application entry point
│   ├── Global.asax.cs       # Application code
│   ├── Web.config           # Web configuration
│   ├── CMA.Web.csproj       # .NET Project file
│   ├── packages.config      # NuGet packages
│   ├── build-react.bat      # Build script for React
│   └── build-react.ps1      # PowerShell build script
├── CMA.sln                 # Solution file
├── README.md               # Project documentation
└── SETUP_INSTRUCTIONS.md   # This file
```

## Prerequisites for Complete Setup

To fully build and run this application, you need:

1. **.NET Framework 4.8 Developer Pack**
   - Download from: https://dotnet.microsoft.com/download/dotnet-framework/net48
   - This is required to compile .NET Framework 4.8 applications

2. **Node.js** (v14 or later)
   - Download from: https://nodejs.org/
   - Required for building the React frontend

3. **Visual Studio** (optional but recommended)
   - Visual Studio Community 2019 or later
   - Include the ".NET desktop development" workload

## Installation Steps

### 1. Install .NET Framework 4.8 Developer Pack

Download and install the .NET Framework 4.8 Developer Pack from Microsoft's website.

### 2. Install Node.js Dependencies

```bash
cd CMA.Web/ClientApp
npm install
```

### 3. Restore NuGet Packages

If using Visual Studio:
- Right-click on the solution in Solution Explorer
- Select "Restore NuGet Packages"

If using command line:
```bash
nuget restore CMA.sln
```

### 4. Build the Application

#### Build React Frontend
```bash
cd CMA.Web/ClientApp
npm run build
```

This will:
- Compile TypeScript to JavaScript
- Bundle all assets
- Output files to `CMA.Web/wwwroot/`

#### Build .NET Backend
Using Visual Studio:
- Build the solution (Ctrl+Shift+B)

Using command line (after installing .NET Framework Developer Pack):
```bash
msbuild CMA.sln
```

## Running the Application

### Development Mode

1. Start the React development server:
   ```bash
   cd CMA.Web/ClientApp
   npm run dev
   ```
   This starts Vite development server at `http://localhost:3000`

2. Run the .NET application:
   - Using Visual Studio: Press F5
   - Using command line:
     ```bash
     cd CMA.Web/bin/Debug
     CMA.Web.exe
     ```

### Production Mode

1. Build both frontend and backend:
   ```bash
   cd CMA.Web/ClientApp
   npm run build
   ```
   
   Then build the .NET project using Visual Studio or MSBuild.

2. Run the application:
   The built application will serve the React app from the `wwwroot` folder.

## Project Configuration Details

### React Build Configuration

The `vite.config.ts` is configured to output built files to the `wwwroot` directory:

```javascript
build: {
  outDir: '../wwwroot',
  emptyOutDir: true,
}
```

### .NET Integration

The .NET application is configured to:
1. Serve static files from the `wwwroot` directory
2. Route all requests to the React app (for SPA functionality)
3. Automatically build the React app during .NET build process

### Pre-build Event

The `.csproj` file includes a pre-build event that automatically builds the React app:

```xml
<PropertyGroup>
  <PreBuildEvent>cd $(ProjectDir)
powershell -ExecutionPolicy Bypass -File "$(ProjectDir)build-react.ps1"</PreBuildEvent>
</PropertyGroup>
```

## Troubleshooting

### "The reference assemblies for .NETFramework,Version=v4.8 were not found"

This error occurs when the .NET Framework 4.8 Developer Pack is not installed. Install it from Microsoft's website.

### "msbuild is not recognized as an internal or external command"

MSBuild is part of Visual Studio. Either:
1. Install Visual Studio, or
2. Add MSBuild to your PATH environment variable

### Node.js Version Issues

If you encounter issues with Node.js versions:
1. Check your Node.js version: `node --version`
2. Consider using Node Version Manager (NVM) to manage versions
3. The project requires Node.js v14 or later

## Alternative Approach: Using ASP.NET Core

If you encounter issues with .NET Framework, consider using ASP.NET Core instead, which has better tooling support and doesn't require separate SDK installation:

1. Create a new ASP.NET Core project
2. Add the React frontend to the `ClientApp` folder
3. Configure the project to serve static files
4. Use the same build process for the React app

This approach would require fewer dependencies and easier setup.