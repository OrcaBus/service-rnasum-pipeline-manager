/*

Interfaces for the application

 */

import { SsmParameterPaths, SsmParameterValues } from './ssm/interfaces';
import { StageName } from '@orcabus/platform-cdk-constructs/shared-config/accounts';

/**
 * Stateful application stack interface.
 */

export interface StatefulApplicationStackConfig {
  // Values
  // Detail
  ssmParameterValues: SsmParameterValues;

  // Keys
  ssmParameterPaths: SsmParameterPaths;
}

/**
 * Stateless application stack interface.
 */
export interface StatelessApplicationStackConfig {
  // Event Stuff
  eventBusName: string;

  // SSM Parameter paths
  ssmParameterPaths: SsmParameterPaths;

  // Bucket Names
  testDataBucketName: string;
  refDataBucketName: string;

  // Stage Name
  stageName: StageName;
}

/* Set versions */
export type WorkflowVersionType = '2.0.0' | '2.0.3';
export type PayloadVersionType = '2025.09.30' | '2026.04.28';

export const payloadVersionList: PayloadVersionType[] = ['2025.09.30', '2026.04.28'];
