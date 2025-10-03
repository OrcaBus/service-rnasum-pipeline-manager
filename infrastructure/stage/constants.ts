import { WorkflowVersionType } from './interfaces';
import path from 'path';
import { DATA_SCHEMA_REGISTRY_NAME } from '@orcabus/platform-cdk-constructs/shared-config/event-bridge';
import { StageName } from '@orcabus/platform-cdk-constructs/shared-config/accounts';

/* App dirs */
export const APP_ROOT = path.join(__dirname, '../../app');
export const LAMBDA_DIR = path.join(APP_ROOT, 'lambdas');
export const STEP_FUNCTIONS_DIR = path.join(APP_ROOT, 'step-functions-templates');
export const EVENT_SCHEMAS_DIR = path.join(APP_ROOT, 'event-schemas');

/* Workflow constants */
export const WORKFLOW_NAME = 'rnasum';

// However, because this workflow has the same workflow name as the
// existing production workflow, we need to filter on the payload version
// to prevent the wrong service from being triggered
export const DEFAULT_WORKFLOW_VERSION: WorkflowVersionType = '2.0.0';
export const DEFAULT_PAYLOAD_VERSION = '2025.09.30';

// Add prefix placeholders
export const WORKFLOW_LOGS_PREFIX = `s3://{__CACHE_BUCKET__}/{__CACHE_PREFIX__}logs/${WORKFLOW_NAME}/`;
export const WORKFLOW_OUTPUT_PREFIX = `s3://{__CACHE_BUCKET__}/{__CACHE_PREFIX__}analysis/${WORKFLOW_NAME}/`;

/* We extend this every time we release a new version of the workflow */
/* This is added into our SSM Parameter Store to allow us to map workflow versions to pipeline IDs */
export const WORKFLOW_VERSION_TO_DEFAULT_ICAV2_PIPELINE_ID_MAP: Record<
  WorkflowVersionType,
  string
> = {
  // At the moment we are running manual deployments of the workflow
  '2.0.0': '495a9c45-ac7c-4628-9f25-467afd84c03e',
};

export const DEFAULT_WORKFLOW_INPUTS_BY_VERSION_MAP: Record<WorkflowVersionType, object> = {
  '2.0.0': {
    // Transformation method to be used when converting read counts
    transform: 'CPM', // Counts Per Million
    // Normalisation method to be used when normalising read counts
    norm: 'TMM', // Trimmed Mean of M-values
    // Scaling
    scaling: 'gene-wise',
    // Tier threshold for reporting variants reported in PCGR.
    pcgrTier: 4,
    // CN threshold value to classify genes within lost regions.
    cnLoss: 5,
    // CN Gain threshold value to classify genes within gained regions.
    cnGain: 95,
    // The number of top ranked genes to be presented.
    topGenes: 5,
    // Reference dataset selection
    dataset: 'PANCAN', // Samples from all 33 cancer types, 10 samples from each
    // Remove batch associated effects
    batchRm: true,
    // Filter out low expressed genes
    filter: true,
    // Log (base 2) transform data before normalisation
    log: true,
    // Save interactive summary tables as HTML
    saveTables: true,
    // Include non-coding splice region variants reported in PCGR.
    pcgrSpliceVars: true,
  },
};

/* SSM Parameter Paths */
export const SSM_PARAMETER_PATH_PREFIX = path.join(`/orcabus/workflows/${WORKFLOW_NAME}/`);
// Workflow Parameters
export const SSM_PARAMETER_PATH_WORKFLOW_NAME = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'workflow-name'
);
export const SSM_PARAMETER_PATH_DEFAULT_WORKFLOW_VERSION = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'default-workflow-version'
);
// Input parameters
export const SSM_PARAMETER_PATH_PREFIX_INPUTS_BY_WORKFLOW_VERSION = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'inputs-by-workflow-version'
);
// Engine Parameters
export const SSM_PARAMETER_PATH_PREFIX_PIPELINE_IDS_BY_WORKFLOW_VERSION = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'pipeline-ids-by-workflow-version'
);
export const SSM_PARAMETER_PATH_ICAV2_PROJECT_ID = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'icav2-project-id'
);
export const SSM_PARAMETER_PATH_PAYLOAD_VERSION = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'payload-version'
);
export const SSM_PARAMETER_PATH_LOGS_PREFIX = path.join(SSM_PARAMETER_PATH_PREFIX, 'logs-prefix');
export const SSM_PARAMETER_PATH_OUTPUT_PREFIX = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'output-prefix'
);

/* Event Constants */
export const EVENT_BUS_NAME = 'OrcaBusMain';
export const EVENT_SOURCE = 'orcabus.rnasum';
export const WORKFLOW_RUN_STATE_CHANGE_DETAIL_TYPE = 'WorkflowRunStateChange';
export const WORKFLOW_RUN_UPDATE_DETAIL_TYPE = 'WorkflowRunUpdate';
export const ICAV2_WES_REQUEST_DETAIL_TYPE = 'Icav2WesRequest';
export const ICAV2_WES_STATE_CHANGE_DETAIL_TYPE = 'Icav2WesAnalysisStateChange';
export const WORKFLOW_MANAGER_EVENT_SOURCE = 'orcabus.workflowmanager';
export const ICAV2_WES_EVENT_SOURCE = 'orcabus.icav2wesmanager';

/* Event rule constants */
export const DRAFT_STATUS = 'DRAFT';
export const READY_STATUS = 'READY';
export const SUCCEEDED_STATUS = 'SUCCEEDED';
export const SASH_WORKFLOW_NAME = 'sash';
export const DRAGEN_WGTS_RNA_WORKFLOW_NAME = 'dragen-wgts-rna';
export const ARRIBA_WGTS_RNA_WORKFLOW_NAME = 'arriba-wgts-rna';

/* Schema constants */
export const SCHEMA_REGISTRY_NAME = DATA_SCHEMA_REGISTRY_NAME;
export const SSM_SCHEMA_ROOT = path.join(SSM_PARAMETER_PATH_PREFIX, 'schemas');

/* Future proofing */
export const NEW_WORKFLOW_MANAGER_IS_DEPLOYED: Record<StageName, boolean> = {
  BETA: true,
  GAMMA: false,
  PROD: false,
};

// Used to group event rules and step functions
export const STACK_PREFIX = 'orca-rnasum';
