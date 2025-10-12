# CMA Admin Dashboard

This is a .NET Framework 4.8 application with a React TypeScript frontend.

## Project Structure

- `CMA.Web` - .NET Framework 4.8 web application (SDK-style project)
  - `ClientApp` - React TypeScript frontend application
  - `Controllers` - MVC controllers
  - `Views` - MVC views
  - `wwwroot` - Static files (built React app)
  - `App_Start` - Application startup configuration

## Current Status

The React TypeScript frontend has been successfully integrated with the .NET Framework project structure. The integration includes:

1. **Project Reorganization**: The React app has been moved to `CMA.Web/ClientApp` and the .NET structure has been set up
2. **Build Process Integration**: Vite is configured to output built files to the .NET [wwwroot](file:///C:/Users/mojah/Downloads/CMA/CMA.Web/wwwroot) directory
3. **Automated Build Scripts**: Pre-build events and scripts are configured to automatically build the React app
4. **SDK-Style Project Format**: The project has been converted to the new SDK-style format for compatibility with modern Visual Studio tooling

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- .NET Framework 4.8 Developer Pack
- Visual Studio 2019 or later (recommended)

## Setup

1. Install Node.js dependencies:
   ```
   cd CMA.Web/ClientApp
   npm install
   ```

## Building the Application

1. Build the React frontend:
   ```
   cd CMA.Web/ClientApp
   npm run build
   ```

This will build the React application and place the output files in the `CMA.Web/wwwroot` directory, ready to be served by the .NET application.

## Development

For development, you can run the React frontend separately:
```
cd CMA.Web/ClientApp
npm run dev
```

This will start the Vite development server at `http://localhost:3000`.

## Running the Application

To run the complete application:
1. Open the solution in Visual Studio
2. Build the solution (this will automatically build the React app)
3. Run the application using IIS Express (F5 in Visual Studio)

## Next Steps

To complete the full .NET Framework integration, you will need to:

1. Install the .NET Framework 4.8 Developer Pack
2. Install Visual Studio with the ".NET desktop development" workload
3. Build and run the solution

See `SETUP_INSTRUCTIONS.md` for detailed setup instructions and `PROJECT_SUMMARY.md` for a complete overview of the integration work.