import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { GithubActionsIdentityProvider, GithubActionsRole } from 'aws-cdk-github-oidc';
import * as iam from 'aws-cdk-lib/aws-iam';

export class LeaderboardStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const provider = new GithubActionsIdentityProvider(this, 'GithubProvider');
    const role = new GithubActionsRole(this, 'DeployRole', {
      provider: provider,
      owner: 'kter',
      repo: 'aws-cert-leaders',
      roleName: 'aws-cert-leaders-deploy-role',
      maxSessionDuration: Duration.hours(1),
    });

    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));
  }
}
