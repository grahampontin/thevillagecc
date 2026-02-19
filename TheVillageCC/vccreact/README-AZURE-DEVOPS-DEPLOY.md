# Deploying to Azure Static Web Apps from Azure DevOps

This repo contains a React (CRA) app in `vccreact/`.

## What was added

- `azure-pipelines.yml` (Azure DevOps pipeline)
- `public/staticwebapp.config.json` (SPA routing for React Router)

## Required Azure DevOps setup

### 1) Add the deployment token as a secret variable

In your Azure DevOps pipeline (or a Variable Group), add a **secret** variable named:

- `AZURE_STATIC_WEB_APPS_API_TOKEN`

Set its value to the **deployment token** for the Azure Static Web App **thevillagecc**.

You can find the token in Azure Portal:
Static Web Apps → `thevillagecc` → **Manage deployment token**.

### 2) (Production) Configure the backend API URL

When deployed to Azure Static Web Apps, the CRA dev proxy **does not run**.
So the frontend must call the backend API at an absolute URL.

Add an Azure DevOps variable (or Variable Group) for the build named:

- `REACT_APP_API_BASE_URL`

Example value:
- `https://<your-backend-hostname>`

Notes:
- Don’t include a trailing slash.
- The app will call endpoints like: `REACT_APP_API_BASE_URL + /api/Players`

#### CORS
Because the API is on a different host, your backend must allow CORS from the Static Web App origin, e.g.:
- `https://thevillagecc.azurestaticapps.net` (and your custom domain if you have one)

### 3) Create the pipeline

Create a new pipeline that uses the YAML from this repo:

- `vccreact/azure-pipelines.yml`

The pipeline triggers on `master` only and deploys only from `master`.

## Notes

- Because this is a token-based deploy, you typically **don’t need** an Azure service connection.
- `staticwebapp.config.json` ensures deep links like `/player/123` work (rewrite to `index.html`).
