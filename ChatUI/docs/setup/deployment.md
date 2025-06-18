# Deployment Guide

This document provides detailed instructions for deploying the Chat UI application to Azure Static Web Apps, including environment variable management and Azure Key Vault integration.

## Deployment Architecture

The Chat UI application is configured for deployment to Azure Static Web Apps, which provides a streamlined hosting service for modern web applications with built-in CI/CD through GitHub Actions.

### Key Features

- Automated deployments via GitHub Actions
- Environment variable management
- Integration with Azure Key Vault for secrets
- Managed API support (for backend functions)

## Environment Variable Management

The Chat UI application uses environment variables in two different contexts:

1. **Build-time variables**: Used during the build process and in local development, these variables are defined in `.env.local` for local development and injected via GitHub Secrets during CI/CD.

2. **Runtime variables (in Azure)**: When deployed to Azure, environment variables for the application's backend are configured through Azure App Settings rather than being baked into the build.

### Build-time Environment Variables

For local development and CI/CD builds, environment variables are managed using:

- Local development: `.env.local` file in the project root
- CI/CD: GitHub Secrets injected during the build process

Our GitHub Actions workflow handles build-time environment variables by:

1. **Generating a `.env` file**: This creates a file that Next.js uses during the build process.
2. **Passing environment variables directly**: Environment variables are also passed directly to the build process.

Here's how it's configured in our workflow file:

```yaml
- name: Generate Environment File
  run: |
    echo "NEXT_PUBLIC_APP_NAME=${{ secrets.NEXT_PUBLIC_APP_NAME }}" >> .env
    echo "NEXT_PUBLIC_STANDARD_CHAT_API_URL=${{ secrets.NEXT_PUBLIC_STANDARD_CHAT_API_URL }}" >> .env
    # Additional variables...

- name: Build and test
  run: |
    npm run build
    npm test
  env:
    NODE_ENV: production
    NEXT_PUBLIC_APP_NAME: ${{ secrets.NEXT_PUBLIC_APP_NAME }}
    # Additional variables...
```

#### Adding GitHub Secrets

To securely manage these variables, store them as secrets in your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add each variable with its corresponding value

You can also use the GitHub CLI to add secrets:

```bash
gh secret set NEXT_PUBLIC_APP_NAME --body "YourAppName"
```

### Runtime Environment Variables in Azure

For backend API functions and runtime configuration in production, environment variables should be configured directly in Azure App Settings rather than being passed at build time. This allows for:

1. Changing environment variables without rebuilding the application
2. More secure management of sensitive information
3. Integration with Azure Key Vault for managing secrets

There are two approaches to configure Azure App Settings:

#### Option 1: Azure Portal Configuration

Configure variables directly in the Azure portal:

1. Go to the Azure portal
2. Navigate to your Static Web App
3. Under Settings, click on "Configuration"
4. Add each variable in the "Application settings" section

#### Option 2: Programmatic Configuration with GitHub Actions

For a more automated approach, you can configure application settings programmatically using a GitHub workflow.

The Chat UI project includes a ready-to-use workflow in `.github/workflows/configureAppSettings.yml`:

```yaml
name: Configure Azure App Settings

on:
  workflow_dispatch:  # Manual trigger
  push:
    branches:
      - main
    paths:
      - 'api/**'  # Only run when API code changes

jobs:
  configure-app-settings:
    runs-on: ubuntu-latest
    name: Configure App Settings
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Login to Azure
        uses: azure/login@v1
        with:
          creds: '${{ secrets.AZURE_CREDENTIALS }}'
          
      - name: Configure App Settings
        uses: azure/appservice-settings@v1
        with:
          app-name: 'chat-ui'
          mask-inputs: true
          app-settings-json: |
            [
              {
                "name": "API_KEY",
                "value": "${{ secrets.API_KEY }}",
                "slotSetting": false
              },
              # Additional settings...
            ]
```

##### Setting up the workflow:

1. **Create Azure service principal**:
   ```bash
   az ad sp create-for-rbac --name "chatui-github-actions" --role contributor \
                             --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
                             --sdk-auth
   ```

2. **Add the credentials as a GitHub secret**:
   - Copy the JSON output from the command above
   - Go to your GitHub repository → Settings → Secrets → Actions
   - Add a new secret named `AZURE_CREDENTIALS` with the JSON as value

3. **Add other required secrets**:
   - Add all API keys and other runtime configuration as GitHub secrets
   - These will be referenced in the `app-settings-json` section

4. **Customize settings**:
   - Modify the `app-name` value to match your Azure Static Web App name
   - Update the `app-settings-json` to include all your required settings

5. **Trigger the workflow**:
   - Automatically: Push changes to the `api` directory
   - Manually: Go to Actions tab → Configure Azure App Settings → Run workflow

This approach is particularly useful for:
- Automating environment configuration across multiple environments
- Keeping all configuration in code rather than manual portal settings
- Setting up different configurations for different deployment slots
- Applying consistent settings across multiple deployments

## Azure Key Vault Integration

For enhanced security, sensitive information (like API keys or connection strings) should be stored in Azure Key Vault rather than directly as environment variables.

### Setting up Azure Key Vault Integration

1. **Create a Key Vault in Azure**:
   - Go to the Azure portal
   - Create a new Key Vault resource
   - Add your secrets to the Key Vault

2. **Configure Managed Identity for your Static Web App**:
   - Go to your Static Web App in the Azure portal
   - Under Settings, click on "Identity"
   - Enable the System assigned managed identity
   - Save the changes

3. **Grant Access to Key Vault**:
   - Go to your Key Vault
   - Under Settings, click on "Access policies"
   - Add a new policy for your Static Web App's managed identity
   - Grant "Get" permission for secrets
   - Save the changes

4. **Reference Key Vault Secrets in Application Settings**:
   - Go to your Static Web App
   - Under Settings, click on "Configuration"
   - Add a new application setting
   - Use the following format for the value:
     ```
     @Microsoft.KeyVault(SecretUri=https://your-vault.vault.azure.net/secrets/your-secret/)
     ```
   - Alternatively, use the shorter format:
     ```
     @Microsoft.KeyVault(VaultName=your-vault;SecretName=your-secret)
     ```

### Limitations

- Key Vault integration is only available on the Azure Static Web Apps Standard plan
- It's only supported in the production environment (not in staging environments)
- For managed functions, you'll need to implement Key Vault access in your code

## CI/CD Pipeline

The Chat UI application uses GitHub Actions for CI/CD. The workflow is defined in `.github/workflows/azure-static-web-apps.yml`.

### Workflow Steps

1. Checkout the code
2. Set up Node.js
3. Install dependencies
4. Generate environment variables file
5. Build and test the application
6. Deploy to Azure Static Web Apps

### Managing Environment Variables in Different Environments

For different environments (development, staging, production):

1. **Development**: Use `.env.local` file locally
2. **Staging**: Created automatically from pull requests, uses the same GitHub secrets
3. **Production**: Deployed from the main branch, uses GitHub secrets and Azure configuration

## Troubleshooting

### Common Issues

1. **Missing environment variables**:
   - Check GitHub secrets are properly configured
   - Verify the workflow file references the correct secret names
   - Ensure environment variables are properly formatted in the `.env` file

2. **Key Vault access issues**:
   - Verify managed identity is enabled for your Static Web App
   - Check access policies in Key Vault are correctly configured
   - Ensure the Key Vault reference syntax is correct

3. **Build errors**:
   - Review the GitHub Actions logs for detailed error messages
   - Verify all required environment variables are available during build

## Best Practices

1. **Never commit sensitive information** to source control
2. Use **GitHub secrets** for build-time variables
3. Use **Azure Key Vault** for sensitive runtime variables
4. Keep **non-sensitive configuration** in the Azure portal for easier updates
5. **Document all required environment variables** with descriptions
6. **Use prefix conventions** consistently (e.g., `NEXT_PUBLIC_` for client-side variables) 