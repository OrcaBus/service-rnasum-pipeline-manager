import { StageName } from '@orcabus/platform-cdk-constructs/shared-config/accounts';
import { ICAV2_PROJECT_ID } from '@orcabus/platform-cdk-constructs/shared-config/icav2';
import { StatefulApplicationStackConfig, StatelessApplicationStackConfig } from './interfaces';
import {
  DEFAULT_WORKFLOW_INPUTS_BY_VERSION_MAP,
  EVENT_BUS_NAME,
  SSM_PARAMETER_PATH_ICAV2_PROJECT_ID,
  SSM_PARAMETER_PATH_LOGS_PREFIX,
  SSM_PARAMETER_PATH_OUTPUT_PREFIX,
  SSM_PARAMETER_PATH_PAYLOAD_VERSION_BY_WORKFLOW_VERSION,
  SSM_PARAMETER_PATH_PREFIX,
  SSM_PARAMETER_PATH_PREFIX_INPUTS_BY_WORKFLOW_VERSION,
  SSM_PARAMETER_PATH_PREFIX_PIPELINE_IDS_BY_WORKFLOW_VERSION,
  SSM_PARAMETER_PATH_WORKFLOW_NAME,
  REF_DATA_BUCKET_NAME,
  TEST_DATA_BUCKET_NAME,
  WORKFLOW_LOGS_PREFIX,
  WORKFLOW_NAME,
  WORKFLOW_OUTPUT_PREFIX,
  WORKFLOW_VERSION_TO_DEFAULT_ICAV2_PIPELINE_ID_MAP,
  WORKFLOW_VERSION_TO_DEFAULT_PAYLOAD_VERSION_MAP,
} from './constants';
import { substituteBucketConstants } from './utils';
import { SsmParameterPaths, SsmParameterValues } from './ssm/interfaces';

export const getSsmParameterValues = (stage: StageName): SsmParameterValues => {
  return {
    // Values
    // Detail
    workflowName: WORKFLOW_NAME,

    // Payload by workflow version
    payloadVersionByWorkflowVersionMap: WORKFLOW_VERSION_TO_DEFAULT_PAYLOAD_VERSION_MAP,

    // Inputs
    inputsByWorkflowVersionMap: DEFAULT_WORKFLOW_INPUTS_BY_VERSION_MAP,

    // Engine Parameters
    pipelineIdsByWorkflowVersionMap: WORKFLOW_VERSION_TO_DEFAULT_ICAV2_PIPELINE_ID_MAP,
    icav2ProjectId: ICAV2_PROJECT_ID[stage],
    logsPrefix: substituteBucketConstants(WORKFLOW_LOGS_PREFIX, stage),
    outputPrefix: substituteBucketConstants(WORKFLOW_OUTPUT_PREFIX, stage),
  };
};

export const getSsmParameterPaths = (): SsmParameterPaths => {
  return {
    // Top level prefix
    ssmRootPrefix: SSM_PARAMETER_PATH_PREFIX,

    // Detail
    workflowName: SSM_PARAMETER_PATH_WORKFLOW_NAME,

    // Inputs
    prefixDefaultInputsByWorkflowVersion: SSM_PARAMETER_PATH_PREFIX_INPUTS_BY_WORKFLOW_VERSION,

    // Payload
    prefixPayloadVersionsByWorkflowVersion: SSM_PARAMETER_PATH_PAYLOAD_VERSION_BY_WORKFLOW_VERSION,

    // Engine Parameters
    prefixPipelineIdsByWorkflowVersion: SSM_PARAMETER_PATH_PREFIX_PIPELINE_IDS_BY_WORKFLOW_VERSION,
    icav2ProjectId: SSM_PARAMETER_PATH_ICAV2_PROJECT_ID,
    logsPrefix: SSM_PARAMETER_PATH_LOGS_PREFIX,
    outputPrefix: SSM_PARAMETER_PATH_OUTPUT_PREFIX,
  };
};

export const getStatefulStackProps = (stage: StageName): StatefulApplicationStackConfig => {
  return {
    ssmParameterValues: getSsmParameterValues(stage),
    ssmParameterPaths: getSsmParameterPaths(),
  };
};

export const getStatelessStackProps = (stage: StageName): StatelessApplicationStackConfig => {
  // Get stateless application stack props
  return {
    // Event bus object
    eventBusName: EVENT_BUS_NAME,
    ssmParameterPaths: getSsmParameterPaths(),

    // TestData and RefData bucket names
    testDataBucketName: TEST_DATA_BUCKET_NAME,
    refDataBucketName: REF_DATA_BUCKET_NAME,

    // StageName
    stageName: stage,
  };
};
