import { PayloadVersionType, WorkflowVersionType } from '../interfaces';

export interface SsmParameterValues {
  // Payload defaults
  workflowName: string;
  payloadVersionByWorkflowVersionMap: Record<WorkflowVersionType, PayloadVersionType>;

  // Input defaults
  inputsByWorkflowVersionMap: Record<WorkflowVersionType, object>;

  // Engine Parameter defaults
  pipelineIdsByWorkflowVersionMap: Record<WorkflowVersionType, string>;
  icav2ProjectId: string;
  logsPrefix: string;
  outputPrefix: string;
}

export interface SsmParameterPaths {
  // Top level prefix
  ssmRootPrefix: string;

  // Payload defaults
  workflowName: string;
  prefixPayloadVersionsByWorkflowVersion: string;

  // Input defaults
  prefixDefaultInputsByWorkflowVersion: string;

  // Engine Parameter defaults
  prefixPipelineIdsByWorkflowVersion: string;
  icav2ProjectId: string;
  logsPrefix: string;
  outputPrefix: string;
}

export interface BuildSsmParameterProps {
  ssmParameterValues: SsmParameterValues;
  ssmParameterPaths: SsmParameterPaths;
}
