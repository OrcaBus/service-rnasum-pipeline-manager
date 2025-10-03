import { IEventBus } from 'aws-cdk-lib/aws-events';
import { StateMachine } from 'aws-cdk-lib/aws-stepfunctions';

import { LambdaName, LambdaObject } from '../lambda/interfaces';
import { SsmParameterPaths } from '../ssm/interfaces';

/**
 * Step Function Interfaces
 */
export type StateMachineName =
  // Glue code
  | 'glueSucceededEventsToDraftUpdate'
  // Draft populator
  | 'populateDraftData'
  // Validate draft to ready
  | 'validateDraftToReady'
  // Ready-to-Submitted
  | 'readyEventToIcav2WesRequestEvent'
  // Post-submission event conversion
  | 'icav2WesAscEventToWorkflowRscEvent';

export const stateMachineNameList: StateMachineName[] = [
  // Glue code
  'glueSucceededEventsToDraftUpdate',
  // Draft populator
  'populateDraftData',
  // Validate draft to ready
  'validateDraftToReady',
  // Ready-to-Submitted
  'readyEventToIcav2WesRequestEvent',
  // Post-submission event conversion
  'icav2WesAscEventToWorkflowRscEvent',
];

// Requirements interface for Step Functions
export interface StepFunctionRequirements {
  // Event stuff
  needsEventPutPermission?: boolean;
  // SSM Stuff
  needsSsmParameterStoreAccess?: boolean;
}

export interface StepFunctionInput {
  stateMachineName: StateMachineName;
}

export interface BuildStepFunctionProps extends StepFunctionInput {
  lambdaObjects: LambdaObject[];
  eventBus: IEventBus;
  isNewWorkflowManagerDeployed: boolean;
  ssmParameterPaths: SsmParameterPaths;
}

export interface StepFunctionObject extends StepFunctionInput {
  sfnObject: StateMachine;
}

export type WireUpPermissionsProps = BuildStepFunctionProps & StepFunctionObject;

export type BuildStepFunctionsProps = Omit<BuildStepFunctionProps, 'stateMachineName'>;

export const stepFunctionsRequirementsMap: Record<StateMachineName, StepFunctionRequirements> = {
  // Glue code
  glueSucceededEventsToDraftUpdate: {
    needsEventPutPermission: true,
  },
  // Draft populator
  populateDraftData: {
    needsEventPutPermission: true,
    needsSsmParameterStoreAccess: true,
  },
  // Validate draft to ready
  validateDraftToReady: {
    needsEventPutPermission: true,
  },
  // Ready-to-Submitted
  readyEventToIcav2WesRequestEvent: {
    needsEventPutPermission: true,
  },
  // Post-submission event conversion
  icav2WesAscEventToWorkflowRscEvent: {
    needsEventPutPermission: true,
  },
};

export const stepFunctionToLambdasMap: Record<StateMachineName, LambdaName[]> = {
  glueSucceededEventsToDraftUpdate: [
    // Shared pre-ready lambdas
    'getDragenWgtsRnaOutputsFromPortalRunId',
    'getArribaWgtsRnaOutputsFromPortalRunId',
    'getSashOutputsFromPortalRunId',
    'generateWruEventObjectWithMergedData',
    'comparePayload',
    'getWorkflowRunObject',
    'findLatestWorkflow',
    'getDraftPayload',
  ],
  populateDraftData: [
    // Shared pre-ready lambdas
    'getDragenWgtsRnaOutputsFromPortalRunId',
    'getArribaWgtsRnaOutputsFromPortalRunId',
    'getSashOutputsFromPortalRunId',
    'generateWruEventObjectWithMergedData',
    'comparePayload',
    'getWorkflowRunObject',
    'findLatestWorkflow',
    'getDraftPayload',
    // Draft to ready
    'getLibraries',
    'getFastqRgidsFromLibraryId',
    'getMetadataTags',
    'getFastqIdListFromRgidList',
    // Validation
    'validateDraftDataCompleteSchema',
  ],
  validateDraftToReady: [
    // Validation
    'validateDraftDataCompleteSchema',
  ],
  readyEventToIcav2WesRequestEvent: [
    // Ready to ICAv2 WES lambdas
    'convertReadyEventInputsToIcav2WesEventInputs',
  ],
  icav2WesAscEventToWorkflowRscEvent: [
    // ICAv2 WES to WRSC Event lambdas
    'convertIcav2WesEventToWrscEvent',
  ],
};
