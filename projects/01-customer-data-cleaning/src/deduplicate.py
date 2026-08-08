"""Candidate duplicate detection using exact and fuzzy matching signals."""

from __future__ import annotations

import re
from collections import defaultdict
from itertools import combinations

import pandas as pd
from rapidfuzz import fuzz


HIGH_CONFIDENCE_THRESHOLD = 0.90
FUZZY_NAME_THRESHOLD = 88
FUZZY_ADDRESS_THRESHOLD = 80


def _safe_text(value: object) -> str:
    return value if isinstance(value, str) else ""


def _pairs_for_shared_value(frame: pd.DataFrame, column: str):
    for _, group in frame.dropna(subset=[column]).groupby(column):
        if len(group) > 1:
            yield from combinations(group.index.tolist(), 2)


def find_duplicate_candidates(frame: pd.DataFrame) -> pd.DataFrame:
    """Return candidate duplicate pairs. Records remain untouched for human review.

    Exact email, phone, or name/address matches start as high-confidence signals.
    Fuzzy candidates require both a name similarity of at least 88 and an address
    similarity of at least 80. Scores are conservative and capped at 0.99.
    """
    evidence: dict[tuple[int, int], set[str]] = defaultdict(set)

    for column, reason in (
        ("email", "same_email"),
        ("phone", "same_phone"),
        ("name_address_key", "same_name_address"),
    ):
        for left, right in _pairs_for_shared_value(frame, column):
            evidence[tuple(sorted((left, right)))].add(reason)

    records = frame[["name", "address", "city"]].fillna("").to_dict("index")
    indices = list(records)
    for position, left in enumerate(indices):
        left_name, left_address, left_city = records[left]["name"], records[left]["address"], records[left]["city"]
        if not left_name or not left_address:
            continue
        for right in indices[position + 1 :]:
            right_name, right_address, right_city = records[right]["name"], records[right]["address"], records[right]["city"]
            shared_numbers = set(re.findall(r"\d+", left_address)) & set(re.findall(r"\d+", right_address))
            if not right_name or not right_address or left_city != right_city or not shared_numbers:
                continue
            name_score = fuzz.ratio(left_name, right_name)
            address_score = fuzz.ratio(left_address, right_address)
            if name_score >= FUZZY_NAME_THRESHOLD and address_score >= FUZZY_ADDRESS_THRESHOLD:
                pair = (left, right)
                evidence[pair].update(("similar_name", "similar_address"))

    output: list[dict[str, object]] = []
    for (left, right), reasons in evidence.items():
        left_record, right_record = frame.loc[left], frame.loc[right]
        exact_reason_count = len(reasons & {"same_email", "same_phone", "same_name_address"})
        name_score = fuzz.ratio(_safe_text(left_record["name"]), _safe_text(right_record["name"])) / 100
        address_score = fuzz.ratio(_safe_text(left_record["address"]), _safe_text(right_record["address"])) / 100
        fuzzy_score = (name_score + address_score) / 2
        confidence = min(0.99, 0.80 + exact_reason_count * 0.10) if exact_reason_count else fuzzy_score
        match_type = "high_confidence" if exact_reason_count else "possible"
        output.append(
            {
                "record_a": left_record["customer_id"],
                "record_b": right_record["customer_id"],
                "confidence_score": round(confidence, 2),
                "match_type": match_type,
                "reasons": ";".join(sorted(reasons)),
                "name_similarity": round(name_score, 2),
                "address_similarity": round(address_score, 2),
            }
        )

    columns = ["record_a", "record_b", "confidence_score", "match_type", "reasons", "name_similarity", "address_similarity"]
    return pd.DataFrame(output, columns=columns).sort_values(
        ["confidence_score", "record_a", "record_b"], ascending=[False, True, True]
    )
