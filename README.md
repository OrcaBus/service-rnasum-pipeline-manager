Template Service
================================================================================

- [Template Service](#template-service)
  - [Service Description](#service-description)
    - [Name \& responsibility](#name--responsibility)
    - [Description](#description)
    - [API Endpoints](#api-endpoints)
    - [Consumed Events](#consumed-events)
    - [Published Events](#published-events)
    - [(Internal) Data states \& persistence model](#internal-data-states--persistence-model)
    - [Major Business Rules](#major-business-rules)
    - [Permissions \& Access Control](#permissions--access-control)
    - [Change Management](#change-management)
      - [Versioning strategy](#versioning-strategy)
      - [Release management](#release-management)
  - [Infrastructure \& Deployment](#infrastructure--deployment)
    - [Stateful](#stateful)
    - [Stateless](#stateless)
    - [CDK Commands](#cdk-commands)
    - [Stacks](#stacks)
  - [Development](#development)
    - [Project Structure](#project-structure)
    - [Setup](#setup)
      - [Requirements](#requirements)
      - [Install Dependencies](#install-dependencies)
      - [First Steps](#first-steps)
    - [Conventions](#conventions)
    - [Linting \& Formatting](#linting--formatting)
    - [Testing](#testing)
  - [Glossary \& References](#glossary--references)


Service Description
--------------------------------------------------------------------------------

### Name & responsibility

### Description

### API Endpoints

This service provides a RESTful API following OpenAPI conventions.
The Swagger documentation of the production endpoint is available here:


### Consumed Events

| Name / DetailType | Source         | Schema Link       | Description         |
|-------------------|----------------|-------------------|---------------------|
| `SomeServiceStateChange` | `orcabus.someservice` | <schema link> | Announces service state changes |

### Published Events

| Name / DetailType | Source         | Schema Link       | Description         |
|-------------------|----------------|-------------------|---------------------|
| `TemplateStateChange` | `orcabus.templatemanager` | <schema link> | Announces Template data state changes |


### (Internal) Data states & persistence model

### Major Business Rules

### Permissions & Access Control

### Change Management

#### Versioning strategy

E.g. Manual tagging of git commits following Semantic Versioning (semver) guidelines.

#### Release management

The service employs a fully automated CI/CD pipeline that automatically builds and releases all changes to the `main` code branch.

#### Making your own draft events with BASH / JQ (dev)

There may be circumstances where you wish to generate WRSC events manually, the below is a quick solution for
generating a draft for an RNASum workflow.

The draft populator step function will also pull necessary fastq files out of archive.

<details>

<summary>Click to expand</summary>

```shell
# Globals
EVENT_BUS_NAME="OrcaBusMain"
DETAIL_TYPE="WorkflowRunUpdate"
SOURCE="orcabus.manual"

WORKFLOW_NAME="rnasum"
WORKFLOW_VERSION="2.0.0"
EXECUTION_ENGINE="ICA"
CODE_VERSION="AAAAAAA"  # PLACEHOLDER - replace with actual commit hash

PAYLOAD_VERSION="2025.08.05"

# Glocals
TUMOR_DNA_LIBRARY_ID="L2300943"
NORMAL_DNA_LIBRARY_ID="L2300950"
TUMOR_RNA_LIBRARY_ID="L2500568"

# Functions
get_hostname_from_ssm(){
  aws ssm get-parameter \
    --name "/hosted_zone/umccr/name" \
    --output json | \
  jq --raw-output \
    '.Parameter.Value'
}

get_orcabus_token(){
  aws secretsmanager get-secret-value \
    --secret-id orcabus/token-service-jwt \
    --output json \
    --query SecretString | \
  jq --raw-output \
    'fromjson | .id_token'
}

get_pipeline_id_from_workflow_version(){
  local workflow_version="$1"
  aws ssm get-parameter \
    --name "/orcabus/workflows/rnasum/pipeline-ids-by-workflow-version/${workflow_version}" \
    --output json | \
  jq --raw-output \
    '.Parameter.Value'
}

get_library_obj_from_library_id(){
  local library_id="$1"
  curl --silent --fail --show-error --location \
    --header "Authorization: Bearer $(get_orcabus_token)" \
    --url "https://metadata.$(get_hostname_from_ssm)/api/v1/library?libraryId=${library_id}" | \
  jq --raw-output \
    '
      .results[0] |
      {
        "libraryId": .libraryId,
        "orcabusId": .orcabusId
      }
    '
}

generate_portal_run_id(){
  echo "$(date -u +'%Y%m%d')$(openssl rand -hex 4)"
}

get_linked_libraries(){
  local tumor_dna_library_id="$1"
  local normal_dna_library_id="$2"
  local tumor_rna_library_id="$3"

  jq --null-input --compact-output --raw-output \
    --argjson tumorDnaLibraryObj "$(get_library_obj_from_library_id "$tumor_dna_library_id")" \
    --argjson normalDnaLibraryObj "$(get_library_obj_from_library_id "$normal_dna_library_id")" \
    --argjson tumorRnaLibraryObj "$(get_library_obj_from_library_id "$tumor_rna_library_id")" \
    '
      [
          $tumorDnaLibraryObj,
          $normalDnaLibraryObj,
          $tumorRnaLibraryObj
      ] |
      # Filter out empty values, tumorLibraryId is optional
      # Then write back to JSON
      map(select(length > 0))
    '
}

get_workflow(){
  local workflow_name="$1"
  local workflow_version="$2"
  local execution_engine="$3"
  local execution_engine_pipeline_id="$4"
  local code_version="$5"
  curl --silent --fail --show-error --location \
    --request GET \
    --get \
    --header "Authorization: Bearer $(get_orcabus_token)" \
    --url "https://workflow.$(get_hostname_from_ssm)/api/v1/workflow" \
    --data "$( \
      jq \
       --null-input --compact-output --raw-output \
       --arg workflowName "$workflow_name" \
       --arg workflowVersion "$workflow_version" \
       --arg executionEngine "$execution_engine" \
       --arg executionEnginePipelineId "$execution_engine_pipeline_id" \
       --arg codeVersion "$code_version" \
       '
         {
            "name": $workflowName,
            "version": $workflowVersion,
            "executionEngine": $executionEngine,
            "executionEnginePipelineId": $executionEnginePipelineId,
            "codeVersion": $codeVersion
         } |
         to_entries |
         map(
           "\(.key)=\(.value)"
         ) |
         join("&")
       ' \
    )" | \
  jq --compact-output --raw-output \
    '
      .results[0]
    '
}

# Generate the event
event_cli_json="$( \
  jq --null-input --raw-output \
    --arg eventBusName "$EVENT_BUS_NAME" \
    --arg detailType "$DETAIL_TYPE" \
    --arg source "$SOURCE" \
    --argjson workflow "$(get_workflow \
      "${WORKFLOW_NAME}" "${WORKFLOW_VERSION}" \
      "${EXECUTION_ENGINE}" "$(get_pipeline_id_from_workflow_version "${WORKFLOW_VERSION}")" \
      "${CODE_VERSION}"
    )" \
    --arg payloadVersion "$PAYLOAD_VERSION" \
    --arg portalRunId "$(generate_portal_run_id)" \
    --argjson libraries "$(get_linked_libraries "${TUMOR_DNA_LIBRARY_ID}" "${NORMAL_DNA_LIBRARY_ID}" "${TUMOR_RNA_LIBRARY_ID}")" \
    '
      {
        # Standard fields for the event
        "EventBusName": $eventBusName,
        "DetailType": $detailType,
        "Source": $source,
        # Detail must be a JSON object in string format
        "Detail": (
          {
            "status": "DRAFT",
            "timestamp": (now | todateiso8601),
            "workflow": $workflow,
            "workflowRunName": ("umccr--automated--" + $workflow["name"] + "--" + ($workflow["version"] | gsub("\\."; "-")) + "--" + $portalRunId),
            "portalRunId": $portalRunId,
            "libraries": $libraries
          } |
          tojson
        )
      } |
      # Now wrap into an "entry" for the CLI
      {
        "Entries": [
          .
        ]
      }
    ' \
)"

aws events put-events --no-cli-pager --cli-input-json "${event_cli_json}"
```

</details>



Infrastructure & Deployment
--------------------------------------------------------------------------------

Short description with diagrams where appropriate.
Deployment settings / configuration (e.g. CodePipeline(s) / automated builds).

Infrastructure and deployment are managed via CDK. This template provides two types of CDK entry points: `cdk-stateless` and `cdk-stateful`.


### Stateful

- Queues
- Buckets
- Database
- ...

### Stateless
- Lambdas
- StepFunctions


### CDK Commands

You can access CDK commands using the `pnpm` wrapper script.

- **`cdk-stateless`**: Used to deploy stacks containing stateless resources (e.g., AWS Lambda), which can be easily redeployed without side effects.
- **`cdk-stateful`**: Used to deploy stacks containing stateful resources (e.g., AWS DynamoDB, AWS RDS), where redeployment may not be ideal due to potential side effects.

The type of stack to deploy is determined by the context set in the `./bin/deploy.ts` file. This ensures the correct stack is executed based on the provided context.

For example:

```sh
# Deploy a stateless stack
pnpm cdk-stateless <command>

# Deploy a stateful stack
pnpm cdk-stateful <command>
```

### Stacks

This CDK project manages multiple stacks. The root stack (the only one that does not include `DeploymentPipeline` in its stack ID) is deployed in the toolchain account and sets up a CodePipeline for cross-environment deployments to `beta`, `gamma`, and `prod`.

To list all available stacks, run:

```sh
pnpm cdk-stateless ls
```

Example output:

```sh
OrcaBusStatelessServiceStack
OrcaBusStatelessServiceStack/DeploymentPipeline/OrcaBusBeta/DeployStack (OrcaBusBeta-DeployStack)
OrcaBusStatelessServiceStack/DeploymentPipeline/OrcaBusGamma/DeployStack (OrcaBusGamma-DeployStack)
OrcaBusStatelessServiceStack/DeploymentPipeline/OrcaBusProd/DeployStack (OrcaBusProd-DeployStack)
```


Development
--------------------------------------------------------------------------------

### Project Structure

The root of the project is an AWS CDK project where the main application logic lives inside the `./app` folder.

The project is organized into the following key directories:

- **`./app`**: Contains the main application logic. You can open the code editor directly in this folder, and the application should run independently.

- **`./bin/deploy.ts`**: Serves as the entry point of the application. It initializes two root stacks: `stateless` and `stateful`. You can remove one of these if your service does not require it.

- **`./infrastructure`**: Contains the infrastructure code for the project:
  - **`./infrastructure/toolchain`**: Includes stacks for the stateless and stateful resources deployed in the toolchain account. These stacks primarily set up the CodePipeline for cross-environment deployments.
  - **`./infrastructure/stage`**: Defines the stage stacks for different environments:
    - **`./infrastructure/stage/config.ts`**: Contains environment-specific configuration files (e.g., `beta`, `gamma`, `prod`).
    - **`./infrastructure/stage/stack.ts`**: The CDK stack entry point for provisioning resources required by the application in `./app`.

- **`.github/workflows/pr-tests.yml`**: Configures GitHub Actions to run tests for `make check` (linting and code style), tests defined in `./test`, and `make test` for the `./app` directory. Modify this file as needed to ensure the tests are properly configured for your environment.

- **`./test`**: Contains tests for CDK code compliance against `cdk-nag`. You should modify these test files to match the resources defined in the `./infrastructure` folder.


### Setup

#### Requirements

```sh
node --version
v22.9.0

# Update Corepack (if necessary, as per pnpm documentation)
npm install --global corepack@latest

# Enable Corepack to use pnpm
corepack enable pnpm

```

#### Install Dependencies

To install all required dependencies, run:

```sh
make install
```

#### First Steps

Before using this template, search for all instances of `TODO:` comments in the codebase and update them as appropriate for your service. This includes replacing placeholder values (such as stack names).


### Conventions

### Linting & Formatting

Automated checks are enforces via pre-commit hooks, ensuring only checked code is committed. For details consult the `.pre-commit-config.yaml` file.

Manual, on-demand checking is also available via `make` targets (see below). For details consult the `Makefile` in the root of the project.


To run linting and formatting checks on the root project, use:

```sh
make check
```

To automatically fix issues with ESLint and Prettier, run:

```sh
make fix
```

### Testing


Unit tests are available for most of the business logic. Test code is hosted alongside business in `/tests/` directories.

```sh
make test
```

Glossary & References
--------------------------------------------------------------------------------

For general terms and expressions used across OrcaBus services, please see the platform [documentation](https://github.com/OrcaBus/wiki/blob/main/orcabus-platform/README.md#glossary--references).

Service specific terms:

| Term      | Description                                      |
|-----------|--------------------------------------------------|
| Foo | ... |
| Bar | ... |
