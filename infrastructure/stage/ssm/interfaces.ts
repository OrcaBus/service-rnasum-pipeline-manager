import { WorkflowVersionType } from '../interfaces';

export interface SsmParameterValues {
  // Payload defaults
  workflowName: string;
  payloadVersion: string;
  workflowVersion: string;

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
  payloadVersion: string;
  workflowVersion: string;

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
