#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { execSync } from "child_process";
import { FrontendStack } from "../lib/stacks/frontend-stack";
import { PipelineStack } from "../lib/stacks/pipeline-stack";

const app = new cdk.App();

const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION || "us-east-1";

const codeConnectionArn = app.node.tryGetContext("codeConnectionArn");
const repositoryName = app.node.tryGetContext("repositoryName") || "PawRush/code-guide";
const branchName = app.node.tryGetContext("branchName") || "deploy-to-aws";

if (!codeConnectionArn) {
  // Standalone frontend deployment
  const getDefaultEnvironment = (): string => {
    try {
      const username = process.env.USER || execSync("whoami").toString().trim();
      return `preview-${username}`;
    } catch {
      return "preview-local";
    }
  };

  const environment = app.node.tryGetContext("environment") || getDefaultEnvironment();
  const buildOutputPath = app.node.tryGetContext("buildPath") || "../_site";

  new FrontendStack(app, `CodeGuideFrontend-${environment}`, {
    env: { account, region },
    environment,
    buildOutputPath,
    description: `Code Guide static website - ${environment}`,
    terminationProtection: environment === "prod",
  });

  cdk.Tags.of(app).add("Project", "CodeGuide");
  cdk.Tags.of(app).add("ManagedBy", "CDK");
  cdk.Tags.of(app).add("Environment", environment);
} else {
  // Pipeline deployment mode
  new PipelineStack(app, "CodeGuidePipelineStack", {
    env: { account, region },
    description: "CI/CD Pipeline for Code Guide",
    codeConnectionArn,
    repositoryName,
    branchName,
    terminationProtection: true,
  });

  cdk.Tags.of(app).add("Project", "CodeGuide");
  cdk.Tags.of(app).add("ManagedBy", "CDK");
  cdk.Tags.of(app).add("Pipeline", "true");
}
