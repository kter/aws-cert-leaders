import '@aws-cdk/assert/jest'
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Leaderboard from '../lib/leaderboard-stack';

import { App } from 'aws-cdk-lib';
import { LeaderboardStack } from '../lib/leaderboard-stack';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';
import { ResourcePart } from '@aws-cdk/assert';

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

test('website bucket is created with correct configuration', () => {
  const app = new App();
  // arrange
  const stack = new LeaderboardStack(app, 'TestStack');  // create an instance of our stack

  // expected the bucket to be created with the correct properties
  expect(stack).toHaveResource('AWS::S3::Bucket', {
    "DeletionPolicy": "Delete"
  }, ResourcePart.CompleteDefinition);

});

test('origin access identity is created with correct configuration', () => {
  const app = new App();
  const stack = new LeaderboardStack(app, 'TestStack');  // create an instance of our stack
  expect(stack).toHaveResource('AWS::CloudFront::CloudFrontOriginAccessIdentity', {}, ResourcePart.CompleteDefinition);
});

test('origin access identity is created with correct configuration', () => {
  const app = new App();
  const stack = new LeaderboardStack(app, 'TestStack');  // create an instance of our stack
  expect(stack).toHaveResource('AWS::CloudFront::CloudFrontOriginAccessIdentity', {}, ResourcePart.CompleteDefinition);
});

test('s3 bucket policy is created with correct configuration', () => {
  const app = new App();
  const stack = new LeaderboardStack(app, 'TestStack');  // create an instance of our stack
  expect(stack).toHaveResourceLike('AWS::S3::BucketPolicy', {
    "Bucket": {
      "Ref": "WebsiteBucket75C24D94"
    },
    "PolicyDocument": {
      "Statement": [
        {
          "Action": "s3:GetObject",
          "Effect": "Allow",
          "Principal": {
            "CanonicalUser": {
              "Fn::GetAtt": [
                "OriginAccessIdentityDF1E3CAC",
                "S3CanonicalUserId"
              ]
            }
          },
          "Resource": {
            "Fn::Join": [
              "",
              [
                {
                  "Fn::GetAtt": [
                    "WebsiteBucket75C24D94",
                    "Arn"
                  ]
                },
                "/*"
              ]
            ]
          }
        }
      ],
    }
  });
});


/* 
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::DynamoDB::Table', {
    SSESpecification: {
      SSEEnabled: true
    }
  });
*/