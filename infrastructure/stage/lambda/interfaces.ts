import { PythonUvFunction } from '@orcabus/platform-cdk-constructs/lambda';

export type LambdaName =
  // Shared pre-ready lambdas
  | 'getArribaWgtsRnaOutputsFromPortalRunId'
  | 'getDragenWgtsRnaOutputsFromPortalRunId'
  | 'getSashOutputsFromPortalRunId'
  | 'generateWruEventObjectWithMergedData'
  | 'comparePayload'
  | 'getMissingSchemaFields'
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
  // Commentary Functions
  | 'addPopulateDraftComment'
  | 'addWesFailureComment'
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
  'getMissingSchemaFields',
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
  // Commentary Functions
  'addPopulateDraftComment',
  'addWesFailureComment',
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
  needsHigherMemory?: boolean;
  needsExternalBucketInfo?: boolean;
  needsWorkflowInfo?: boolean;
  needsRepoUrl?: boolean;
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
  getMissingSchemaFields: {
    needsSchemaRegistryAccess: true,
    needsSsmParametersAccess: true,
  },
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
    needsHigherMemory: true,
    needsIcav2Tools: true,
    needsOrcabusApiTools: true,
    needsWorkflowInfo: true,
    needsExternalBucketInfo: true,
  },
  validateDraftDataCompleteSchema: {
    needsSchemaRegistryAccess: true,
    needsSsmParametersAccess: true,
    needsWorkflowInfo: true,
    needsOrcabusApiTools: true,
  },
  // Commentary Functions
  addPopulateDraftComment: {
    needsOrcabusApiTools: true,
    needsWorkflowInfo: true,
    needsRepoUrl: true,
  },
  addWesFailureComment: {
    needsOrcabusApiTools: true,
    needsWorkflowInfo: true,
  },
  // Convert ready to ICAv2 WES Event - no requirements
  convertReadyEventInputsToIcav2WesEventInputs: {},
  // Needs OrcaBus toolkit to get the wrsc event
  convertIcav2WesEventToWrscEvent: {
    needsOrcabusApiTools: true,
  },
};

export interface LambdaInput {
  lambdaName: LambdaName;
}

export interface LambdaObject extends LambdaInput {
  lambdaFunction: PythonUvFunction;
}
