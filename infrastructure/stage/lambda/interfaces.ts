import { PythonUvFunction } from '@orcabus/platform-cdk-constructs/lambda';

export type LambdaName =
  // Shared pre-ready lambdas
  | 'getArribaWgtsRnaOutputsFromPortalRunId'
  | 'getDragenWgtsRnaOutputsFromPortalRunId'
  | 'getSashOutputsFromPortalRunId'
  | 'generateWruEventObjectWithMergedData'
  | 'comparePayload'
  | 'getWorkflowRunObject'
  | 'findLatestWorkflow'
  | 'getDraftPayload'
  // Glue upstream
  // Draft to ready
  | 'getLibraries'
  | 'getFastqRgidsFromLibraryId'
  | 'getMetadataTags'
  | 'getFastqIdListFromRgidList'
  // Validation
  | 'postSchemaValidation'
  | 'validateDraftDataCompleteSchema'
  // Ready to ICAv2 WES lambdas
  | 'convertReadyEventInputsToIcav2WesEventInputs'
  // ICAv2 WES to WRSC Event lambdas
  | 'convertIcav2WesEventToWrscEvent';

export const lambdaNameList: LambdaName[] = [
  // Shared pre-ready lambdas
  'getArribaWgtsRnaOutputsFromPortalRunId',
  'getDragenWgtsRnaOutputsFromPortalRunId',
  'getSashOutputsFromPortalRunId',
  'generateWruEventObjectWithMergedData',
  'comparePayload',
  'getWorkflowRunObject',
  'findLatestWorkflow',
  'getDraftPayload',
  // Glue upstream
  // Draft to ready
  'getLibraries',
  'getFastqRgidsFromLibraryId',
  'getMetadataTags',
  'getFastqIdListFromRgidList',
  // Validation
  'postSchemaValidation',
  'validateDraftDataCompleteSchema',
  // Ready to ICAv2 WES lambdas
  'convertReadyEventInputsToIcav2WesEventInputs',
  // ICAv2 WES to WRSC Event lambdas
  'convertIcav2WesEventToWrscEvent',
];

// Requirements interface for Lambda functions
export interface LambdaRequirements {
  needsOrcabusApiTools?: boolean;
  needsIcav2Tools?: boolean;
  needsSsmParametersAccess?: boolean;
  needsSchemaRegistryAccess?: boolean;
  needsWorkflowEnvVars?: boolean;
  needsBucketEnvVars?: boolean;
  needsHigherMemory?: boolean;
}

// Lambda requirements mapping
export const lambdaRequirementsMap: Record<LambdaName, LambdaRequirements> = {
  // Shared pre-ready lambdas
  getArribaWgtsRnaOutputsFromPortalRunId: {
    needsOrcabusApiTools: true,
  },
  getDragenWgtsRnaOutputsFromPortalRunId: {
    needsOrcabusApiTools: true,
  },
  getSashOutputsFromPortalRunId: {
    needsOrcabusApiTools: true,
  },
  generateWruEventObjectWithMergedData: {
    needsOrcabusApiTools: true,
  },
  comparePayload: {},
  getWorkflowRunObject: {
    needsOrcabusApiTools: true,
  },
  findLatestWorkflow: {
    needsOrcabusApiTools: true,
  },
  getDraftPayload: {
    needsOrcabusApiTools: true,
  },
  // Glue upstream
  // Draft to ready
  getLibraries: {
    needsOrcabusApiTools: true,
  },
  getFastqRgidsFromLibraryId: {
    needsOrcabusApiTools: true,
  },
  getMetadataTags: {
    needsOrcabusApiTools: true,
  },
  getFastqIdListFromRgidList: {
    needsOrcabusApiTools: true,
  },
  // Validate Draft Complete schema
  postSchemaValidation: {
    needsOrcabusApiTools: true,
    needsWorkflowEnvVars: true,
    needsBucketEnvVars: true,
    needsIcav2Tools: true,
    needsHigherMemory: true,
  },
  validateDraftDataCompleteSchema: {
    needsOrcabusApiTools: true,
    needsSchemaRegistryAccess: true,
    needsSsmParametersAccess: true,
    needsWorkflowEnvVars: true,
  },
  // Convert ready to ICAv2 WES Event - no requirements
  convertReadyEventInputsToIcav2WesEventInputs: {},
  // Needs OrcaBus toolkit to get the wrsc event
  convertIcav2WesEventToWrscEvent: {
    needsOrcabusApiTools: true,
  },
};

export interface BuildAllLambdasProps {
  refDataBucketName: string;
  testDataBucketName: string;
}

export interface BuildLambdaProps extends BuildAllLambdasProps {
  lambdaName: LambdaName;
}

export interface LambdaObject {
  lambdaName: LambdaName;
  lambdaFunction: PythonUvFunction;
}
