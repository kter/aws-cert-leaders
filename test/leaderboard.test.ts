import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Leaderboard from '../lib/leaderboard-stack';

import { App } from 'aws-cdk-lib';
import { LeaderboardStack } from '../lib/leaderboard-stack';

test('should create a Github Actions OIDC role', () => {
  const app = new App();
  const stack = new LeaderboardStack(app, 'TestStack');
  const template = Template.fromStack(stack);

  // Expect that a GithubActionsRole resource is created with the correct properties
  template.hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRoleWithWebIdentity',
          Effect: 'Allow',
          Condition: {
            StringLike: {
                "token.actions.githubusercontent.com:sub": "repo:kter/aws-cert-leaders:*"
              },
              StringEquals: {
                "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
              }
          }
        }
      ],
      Version: '2012-10-17'
    },
    ManagedPolicyArns: [
      { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/AdministratorAccess']] }
    ],
    RoleName: 'aws-cert-leaders-deploy-role'
  });
});
