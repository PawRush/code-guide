# Agent Integration Guide

This document describes how to work with AI coding agents on this project.

## Deployment

Your Code Guide application is deployed to AWS with CloudFront and S3.

See [`./DEPLOYMENT.md`](./DEPLOYMENT.md) for:
- Live deployment URL
- Deployment details and stack information
- How to redeploy
- Troubleshooting and production readiness tips
- Quick commands for managing your deployment

### Redeploy

To redeploy after making changes:

```bash
./scripts/deploy.sh
```

### Environments

Deploy to different environments:

```bash
./scripts/deploy.sh                   # Deploy to preview-$(whoami)
./scripts/deploy.sh dev               # Deploy to dev
./scripts/deploy.sh prod              # Deploy to production
```

## Testing

Run Playwright tests:

```bash
npm test                    # Run tests
npm run test:headed         # Run with browser visible
npm run test:ui             # Run with interactive UI
npm run test:report         # View test report
```

Note: Tests require a running Jekyll server.

## Making Changes

When you make changes to the Code Guide:

1. Edit markdown files or SCSS in the project
2. Run `jekyll build` locally to verify
3. Commit changes to Git
4. Run `./scripts/deploy.sh` to deploy to AWS

The Jekyll build outputs to `_site/` directory, which CloudFront serves via S3.

## Infrastructure

CDK infrastructure is in the `infra/` directory:

- `bin/infra.ts` - CDK app entry point
- `lib/stacks/frontend-stack.ts` - Frontend CloudFormation stack definition
- `package.json` - CDK dependencies and build scripts

### CDK Commands

```bash
cd infra
npm run synth      # Generate CloudFormation template
npm run diff       # Compare current vs deployed
npm run deploy     # Deploy stacks
npm run destroy    # Destroy stacks (delete from AWS)
```

## Questions for Your Agent

Ask your coding agent to help you with:
- "Update the deployment to use a custom domain"
- "Add WAF protection to the CloudFront distribution"
- "Setup a CodePipeline for automatic deployments"
- "Add monitoring and alarms for the deployment"
- "Configure CSP headers for security"

---

Last updated: 2026-01-15
