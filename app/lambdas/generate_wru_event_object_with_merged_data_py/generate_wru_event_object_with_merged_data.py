#!/usr/bin/env python3

"""
Generate a WRU event object with merged data
"""
# Layer imports
from orcabus_api_tools.workflow import (
    get_workflow_run_from_portal_run_id
)


def handler(event, context):
    """
    Generate WRU event object with merged data
    :param event:
    :param context:
    :return:
    """

    # Get the event inputs
    # Get the event inputs
    portal_run_id = event.get("portalRunId", None)
    libraries = event.get("libraries", None)
    payload = event.get("payload", None)
    upstream_data = event.get("upstreamData", {})

    # Get the upstream data
    # From arriba
    arriba_pdf = upstream_data.get("arribaPdf", None)
    arriba_tsv = upstream_data.get("arribaTsv", None)
    # From dragen
    dragen_fusions = upstream_data.get("dragenFusions", None)
    dragen_mapping_metrics = upstream_data.get("dragenMappingMetrics", None)
    salmon = upstream_data.get("salmon", None)
    # From sash
    pcgr_tiers_tsv = upstream_data.get("pcgrTiersTsv", None)
    purple_gene_tsv = upstream_data.get("purpleGeneTsv", None)
    sv_tsv = upstream_data.get("svTsv", None)

    # Get the upstream data


    # Create a copy of the oncoanalyser draft workflow run object to update
    draft_workflow_run = get_workflow_run_from_portal_run_id(
        portal_run_id=portal_run_id
    )

    # Make a copy
    draft_workflow_update = draft_workflow_run.copy()

    # Remove 'currentState' and replace with 'status'
    draft_workflow_update['status'] = draft_workflow_update.pop('currentState')['status']

    # Add in the libraries if provided
    if libraries is not None:
        draft_workflow_update["libraries"] = list(map(
            lambda library_iter: {
                "libraryId": library_iter['libraryId'],
                "orcabusId": library_iter['orcabusId'],
                "readsets": library_iter.get('readsets', [])
            },
            libraries
        ))

    # First check if the oncoanalyser draft workflow object has the fields we would update with the

    # Generate a workflow run update object with the merged data
    if (
            (
                    payload['data'].get("inputs", {}).get("arribaPdf", None) is not None or
                    payload['data'].get("inputs", {}).get("arribaTsv", None) is not None
            ) and (
                    payload['data'].get("inputs", {}).get("dragenMappingMetrics", None) is not None or
                    payload['data'].get("inputs", {}).get("dragenFusions", None) is not None or
                    payload['data'].get("inputs", {}).get("salmon", None) is not None
            ) and (
                    payload['data'].get("inputs", {}).get("pcgrTiersTsv", None) is not None or
                    payload['data'].get("inputs", {}).get("purpleGeneTsv", None) is not None or
                    payload['data'].get("inputs", {}).get("svTsv", None) is not None
            )
    ):
        # Return the OG, we dont want to overwrite existing data
        draft_workflow_update["payload"] = {
            "version": payload['version'],
            "data": payload['data']
        }
        return {
            "workflowRunUpdate": draft_workflow_update
        }

    # Initialise inputs
    if payload['data'].get("inputs", {}) is None:
        payload['data']['inputs'] = {}

    if (
            (
                    payload['data'].get("inputs", {}).get("arribaPdf", None) is None and
                    payload['data'].get("inputs", {}).get("arribaTsv", None) is None
            ) and (
                arriba_pdf is not None and
                arriba_tsv is not None
            )
    ):
        # Get the arriba outputs to add to the rnasum payload
        payload['data']['inputs']['arribaPdf'] = arriba_pdf
        payload['data']['inputs']['arribaTsv'] = arriba_tsv

    if (
            (
                    payload['data'].get("inputs", {}).get("dragenMappingMetrics", None) is None and
                    payload['data'].get("inputs", {}).get("dragenFusions", None) is None and
                    payload['data'].get("inputs", {}).get("salmon", None) is None
            ) and (
                dragen_mapping_metrics is not None and
                dragen_fusions is not None and
                salmon is not None
            )
    ):
        # Get the arriba outputs to add to the rnasum payload
        payload['data']['inputs']['dragenMappingMetrics'] = dragen_mapping_metrics
        payload['data']['inputs']['dragenFusions'] = dragen_fusions
        payload['data']['inputs']['salmon'] = salmon

    if (
            (
                payload['data'].get("inputs", {}).get("pcgrTiersTsv", None) is None and
                payload['data'].get("inputs", {}).get("purpleGeneTsv", None) is None and
                payload['data'].get("inputs", {}).get("svTsv", None) is None
            ) and (
                pcgr_tiers_tsv is not None and
                purple_gene_tsv is not None and
                sv_tsv is not None
            )
    ):
        # Get the arriba outputs to add to the rnasum payload
        payload['data']['inputs']['pcgrTiersTsv'] = pcgr_tiers_tsv
        payload['data']['inputs']['purpleGeneTsv'] = purple_gene_tsv
        payload['data']['inputs']['svTsv'] = sv_tsv

    # Merge the data from the dragen draft payload into the draft payload
    new_data_object = payload['data'].copy()
    if new_data_object.get("inputs", None) is None:
        new_data_object["inputs"] = {}

    # Update the inputs with the dragen draft payload data
    draft_workflow_update["payload"] = {
        "version": payload['version'],
        "data": new_data_object
    }

    return {
        "workflowRunUpdate": draft_workflow_update
    }
