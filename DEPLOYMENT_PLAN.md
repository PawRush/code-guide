---
sop_name: deploy-frontend-app
app_name: CodeGuide
app_type: Frontend Application (Jekyll Static Site)
branch: deploy-to-aws
created: 2026-01-15T00:00:00Z
last_updated: 2026-01-15T00:00:00Z
---

# Deployment Plan: Code Guide

AWS deployment using CDK infrastructure for Jekyll static site.

## Phase 1: Gather Context and Configure
- [ ] Step 0: Inform user of execution flow
- [ ] Step 1: Create deployment plan
- [ ] Step 2: Create deploy branch
- [ ] Step 3: Detect build configuration
- [ ] Step 4: Validate prerequisites
- [ ] Step 5: Revisit deployment plan

## Phase 2: Build CDK Infrastructure
- [ ] Step 6: Initialize CDK foundation
- [ ] Step 7: Generate CDK stack
- [ ] Step 8: Create deployment script
- [ ] Step 9: Validate CDK synth

## Phase 3: Deploy and Validate
- [ ] Step 10: Execute CDK deployment
- [ ] Step 11: Validate CloudFormation stack

## Phase 4: Update Documentation
- [ ] Step 12: Finalize deployment plan
- [ ] Step 13: Update README.md

## Deployment Info

- Deployment URL: [pending]
- Stack name: CodeGuideFrontend-preview-[username]
- Distribution ID: [pending]
- S3 bucket: [pending]
- Build output directory: `_site/` (Jekyll)
- Base path: `/` (root)

## Build Configuration

- **Framework**: Jekyll (Static Site Generator)
- **Package Manager**: npm (Playwright tests only)
- **Build Command**: `jekyll build`
- **Output Directory**: `_site/`
- **Base Path**: `/` (root)
- **CloudFront Config**: SPA error responses (Jekyll generates /path/index.html structure)

## Prerequisites Status

- [x] AWS CLI installed: v2.32.33
- [x] npm installed: 10.9.2
- [x] AWS credentials valid: Account 492267476755
- [ ] Jekyll installed (to verify build works)
- [ ] Build succeeds: `jekyll build`
- [ ] CDK CLI installed

## Issues Encountered

None yet.

## Session Log

### Session 1 - 2026-01-15
Agent: claude-haiku-4-5
Progress: Completed deploy-webapp routing analysis, started deploy-frontend-app SOP execution, reached Phase 1 Step 1
Next: Continue with Step 2 (Create deploy branch)
