# Build stage for React app
FROM node:20-alpine AS frontend-build

WORKDIR /app/ClientApp

# Copy package files
COPY CMA.Web/ClientApp/package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY CMA.Web/ClientApp/ ./

# Build the app
RUN npm run build

# Build stage for .NET app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build

WORKDIR /app

# Copy csproj and restore dependencies
COPY CMA.Web/*.csproj ./CMA.Web/
COPY *.sln ./
COPY Directory.Build.props ./
COPY Directory.Build.targets ./

RUN dotnet restore

# Copy everything else
COPY . ./

# Copy built frontend from previous stage
COPY --from=frontend-build /app/ClientApp/../wwwroot ./CMA.Web/wwwroot

# Build the .NET app
RUN dotnet publish CMA.Web/CMA.Web.csproj -c Release -o out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0

WORKDIR /app

# Copy published app
COPY --from=backend-build /app/out .

# Expose ports
EXPOSE 80
EXPOSE 443

# Set environment variables
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "CMA.Web.dll"]
