---
sop_name: deploy-frontend-app
app_name: CodeGuide
app_type: Frontend Application (Jekyll Static Site)
deployment_date: 2026-01-15
---

# Deployment Summary

Your app is deployed to AWS with a 'preview' URL that doesn't change when you update GitHub. Share this link with others.

To connect deployments to GitHub changes, ask your coding agent to `setup a AWS CodePipeline`.

Services used: CloudFront, S3, CloudFormation, IAM

**Deployment URL**: https://d32i42jy8p3t7z.cloudfront.net

---

## Deployment Details

- **Stack Name**: CodeGuideFrontend-preview-jairosp
- **CloudFront Distribution ID**: EFNR5QN2X76AP
- **S3 Bucket**: codeguidefrontend-preview-j-cftos3s3bucketcae9f2be-2xs8hl0szt0c
- **Region**: us-east-1
- **Environment**: preview-jairosp

### S3 Logging Bucket
- **Name**: codeguidefrontend-preview-cftos3s3loggingbucket64b-2dz9xgx2nyzo

### CloudFront Logging Bucket
- **Name**: codeguidefrontend-preview-cftos3cloudfrontloggingb-kexrltmynex9

---

## Quick Commands

```bash
# View deployment status
aws cloudformation describe-stacks --stack-name CodeGuideFrontend-preview-jairosp --query 'Stacks[0].StackStatus' --output text --no-cli-pager

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id EFNR5QN2X76AP --paths "/*" --no-cli-pager

# View CloudFront access logs (last hour)
aws s3 ls s3://codeguidefrontend-preview-cftos3cloudfrontloggingb-kexrltmynex9/ --recursive | tail -20

# Redeploy
./scripts/deploy.sh

# Redeploy to different environment
./scripts/deploy.sh dev
./scripts/deploy.sh prod
```

---

## Build Configuration

- **Framework**: Jekyll (Static Site Generator)
- **Build Output**: `_site/` directory
- **Base Path**: `/` (root)
- **Build Command**: `jekyll build`
- **CloudFront Configuration**: URL rewrite for `/path/index.html` structure

---

## Production Readiness

For production deployments, consider:

- **WAF Protection**: Add AWS WAF with managed rules (Core Rule Set, Known Bad Inputs) and rate limiting
- **CSP Headers**: Configure Content Security Policy in CloudFront response headers (`script-src 'self'`, `frame-ancestors 'none'`)
- **Custom Domain**: Set up Route 53 and ACM certificate with `route53-cloudfront-routing` SOP
- **Monitoring**: CloudWatch alarms for 4xx/5xx errors and CloudFront metrics
- **Auth Redirect URLs**: If using an auth provider (Auth0, Supabase, Firebase, Lovable, etc.), add your CloudFront URL to allowed redirect URLs

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| Build output not found | Build failed or wrong path | Verify build command succeeds: `jekyll build` |
| CloudFront 403 | OAC misconfigured or bucket policy issue | Verify `CloudFrontToS3` construct created OAC. Ensure bucket is private and CloudFormation stack shows no errors |
| Stale content after deploy | Cache not invalidated | Run cache invalidation: `aws cloudfront create-invalidation --distribution-id EFNR5QN2X76AP --paths "/*" --no-cli-pager` |
| 404 on routes | Missing URL rewrite function | Verify CloudFront Function "UrlRewriteFunction" is attached to distribution |

---

## Rollback

To destroy the deployment and remove all AWS resources:

```bash
cd infra
npm run destroy
```

This will delete:
- CloudFront distribution
- S3 buckets (with auto-delete enabled for non-prod)
- All associated IAM roles and policies
- CloudFormation stack

---

## Session Log

### Session 1 - 2026-01-15
- **Agent**: claude-haiku-4-5
- **Progress**:
  - Completed Phase 1: Analyzed codebase, detected Jekyll framework
  - Completed Phase 2: Generated CDK infrastructure (Frontend Stack, CloudFront + S3)
  - Completed Phase 3: Deployed to AWS (creation took ~11 minutes)
  - Website is live and accessible: https://d32i42jy8p3t7z.cloudfront.net
- **Deployment Status**: ✅ CREATE_COMPLETE

---

## References

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [CloudFront Solutions Constructs](https://docs.aws.amazon.com/solutions/latest/constructs/aws-cloudfront-s3.html)
- [Jekyll Documentation](https://jekyllrb.com/)
