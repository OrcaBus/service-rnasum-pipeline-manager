#!/usr/bin/env python3

"""
Given inputs from a Ready Event, convert them to the format expected by the ICAV2 WES Event Inputs.

Workflow inputs:

"""

# Standard imports
from typing import Dict, List, Union, Any


INPUT_FILE_KEYS = [
    # Sash
    "svTsv",
    "purpleGeneTsv",
    "pcgrTiersTsv",
    # Dragen
    "salmon",
    "dragenFusions",
    "dragenMappingMetrics",
    # Arriba
    "arribaPdf",
    "arribaTsv",
]


def to_snake_case(s: str) -> str:
    """
    Convert a string to snake_case.
    :param s: The input string.
    :return: The snake_case version of the input string.
    """
    return ''.join(['_' + c.lower() if c.isupper() else c for c in s]).lstrip('_')


def recursive_snake_case(d: Union[Dict[str, Any] | List[Any] | str]) -> Any:
    """
    Convert all keys in a dictionary to snake_case recursively.
    If the value is a list, we also need to convert each item in the list if it is a dictionary.
    :param d:
    :return:
    """
    if not isinstance(d, dict) and not isinstance(d, list):
        return d

    if isinstance(d, dict):
        return {to_snake_case(k): recursive_snake_case(v) for k, v in d.items()}

    return [recursive_snake_case(item) for item in d]


def cwlify_file(file_uri: str) -> Dict[str, str]:
    return {
        "class": "File",
        "location": file_uri
    }

def handler(event, context):
    """
    Convert the ready event inputs to ICAv2 WES event inputs.
    :param event:
    :param context:
    :return:
    """
    inputs = event['inputs']

    # cwl-ify the reference data
    for key in INPUT_FILE_KEYS:
        if key not in inputs:
            continue
        inputs[key] = cwlify_file(inputs[key])

    inputs = recursive_snake_case(inputs)

    # Return the inputs
    return {
        "inputs": inputs
    }
