---
sop_name: setup-codepipeline
app_name: CodeGuide
app_type: CI/CD Pipeline
branch: deploy-to-aws
created: 2026-01-15T00:00:00Z
last_updated: 2026-01-15T00:00:00Z
code_connection_arn: arn:aws:codeconnections:us-east-1:492267476755:connection/b723259a-c57f-4245-9416-a59676b72429
---

# Pipeline Deployment Plan: Code Guide

AWS CodePipeline setup for automated deployments from GitHub.

## Phase 1: Gather Context and Configure
- [x] Step 0: Inform user of execution flow
- [ ] Step 1: Create deployment plan
- [ ] Step 2: Detect existing infrastructure
  - [ ] 2.1: Detect stacks and frontend
  - [ ] 2.2: App name and git repository
  - [ ] 2.3: Determine quality checks
  - [ ] 2.4: User confirmation
  - [x] 2.5: Use existing CodeConnection

## Phase 2: Build and Deploy Pipeline
- [ ] Step 3: Create CDK Pipeline Stack
- [ ] Step 4: CDK Bootstrap
- [ ] Step 5: Deploy Pipeline
  - [ ] 5.1: Push to remote
  - [ ] 5.2: Authorize CodeConnection
  - [ ] 5.3: Deploy pipeline stack
  - [ ] 5.4: Trigger pipeline
- [ ] Step 6: Monitor Pipeline

## Phase 3: Documentation
- [ ] Step 7: Finalize deployment plan
- [ ] Step 8: Update README.md

## Infrastructure Detection

- **App Name**: CodeGuide
- **Framework**: Jekyll (Static Site Generator)
- **Package Manager**: npm
- **Existing Frontend Stack**: CodeGuideFrontend-preview-jairosp
- **Build Output Directory**: `_site/`
- **Git Repository**: PawRush/code-guide
- **Branch**: deploy-to-aws
- **CodeConnection ARN**: arn:aws:codeconnections:us-east-1:492267476755:connection/b723259a-c57f-4245-9416-a59676b72429
- **CodeConnection Status**: Using existing (pre-authorized)

## Quality Checks

- **Lint**: Not detected
- **Unit Tests**: Not detected
- **E2E Tests**: playwright (NOT included in pipeline)

## Issues Encountered

None yet.

## Session Log

### Session 1 - 2026-01-15
Agent: claude-haiku-4-5
Progress: Starting Phase 1 of setup-codepipeline SOP with existing CodeConnection
Next: Complete infrastructure detection and begin CDK Pipeline stack creation
