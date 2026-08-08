"""Create normalized WoodStep customer data and review reports without altering raw input."""

from __future__ import annotations

import json
import re
from pathlib import Path

import pandas as pd

from deduplicate import find_duplicate_candidates
from normalize import normalize_address, normalize_city, normalize_date, normalize_email, normalize_name, normalize_phone


PROJECT_DIR = Path(__file__).resolve().parents[1]
RAW_PATH = PROJECT_DIR / "data" / "raw_customers.csv"
CLEANED_PATH = PROJECT_DIR / "data" / "cleaned_customers.csv"
DUPLICATE_REPORT_PATH = PROJECT_DIR / "reports" / "duplicate_report.csv"
CLEANING_REPORT_PATH = PROJECT_DIR / "reports" / "cleaning_report.json"
REQUIRED_COLUMNS = {
    "customer_id", "name", "email", "phone", "city", "address", "created_at", "staircase_type", "material", "budget_pln"
}
IMPORTANT_FIELDS = ("name", "email", "phone", "city", "address")
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def validate_required_columns(frame: pd.DataFrame) -> None:
    missing = REQUIRED_COLUMNS - set(frame.columns)
    if missing:
        raise ValueError(f"Raw data is missing required columns: {', '.join(sorted(missing))}")


def normalize_frame(raw: pd.DataFrame) -> tuple[pd.DataFrame, dict[str, int]]:
    cleaned = raw.copy()
    normalizers = {
        "name": normalize_name,
        "email": normalize_email,
        "phone": normalize_phone,
        "city": normalize_city,
        "address": normalize_address,
        "created_at": normalize_date,
    }
    changes: dict[str, int] = {}
    for column, normalizer in normalizers.items():
        original = cleaned[column]
        cleaned[column] = original.map(normalizer)
        changes[column] = int((original.fillna("").astype(str) != cleaned[column].fillna("").astype(str)).sum())

    cleaned["staircase_type"] = cleaned["staircase_type"].map(normalize_name)
    cleaned["material"] = cleaned["material"].map(normalize_name)
    changes["staircase_type"] = int((raw["staircase_type"].fillna("").astype(str) != cleaned["staircase_type"].fillna("").astype(str)).sum())
    changes["material"] = int((raw["material"].fillna("").astype(str) != cleaned["material"].fillna("").astype(str)).sum())

    cleaned["name_address_key"] = (cleaned["name"].fillna("") + "|" + cleaned["address"].fillna("")).where(
        cleaned["name"].notna() & cleaned["address"].notna()
    )
    return cleaned, changes


def validation_flags(frame: pd.DataFrame) -> tuple[pd.Series, dict[str, int]]:
    flags: list[list[str]] = [[] for _ in range(len(frame))]
    for row_position, (_, row) in enumerate(frame.iterrows()):
        for column in IMPORTANT_FIELDS:
            if pd.isna(row[column]) or not str(row[column]).strip():
                flags[row_position].append(f"missing_{column}")
        if pd.notna(row["email"]) and not EMAIL_PATTERN.fullmatch(str(row["email"])):
            flags[row_position].append("malformed_email")
        if pd.notna(row["phone"]) and not re.fullmatch(r"\+48\d{9}", str(row["phone"])):
            flags[row_position].append("suspicious_phone")
        if pd.isna(row["created_at"]):
            flags[row_position].append("invalid_date")

    duplicate_ids = frame["customer_id"].duplicated(keep=False)
    for row_position, is_duplicate in enumerate(duplicate_ids):
        if is_duplicate:
            flags[row_position].append("duplicate_customer_id")
    flattened = [flag for row_flags in flags for flag in row_flags]
    return pd.Series([";".join(row_flags) for row_flags in flags], index=frame.index), {
        flag: flattened.count(flag) for flag in sorted(set(flattened))
    }


def main() -> None:
    if not RAW_PATH.exists():
        raise FileNotFoundError(f"Raw input not found: {RAW_PATH}")
    raw = pd.read_csv(RAW_PATH, dtype=str, keep_default_na=False)
    validate_required_columns(raw)

    cleaned, changes = normalize_frame(raw)
    flags, invalid_by_reason = validation_flags(cleaned)
    cleaned["validation_flags"] = flags
    duplicates = find_duplicate_candidates(cleaned)
    duplicates.to_csv(DUPLICATE_REPORT_PATH, index=False)

    output = cleaned.drop(columns=["name_address_key"])
    output.to_csv(CLEANED_PATH, index=False)
    high_confidence = int((duplicates["match_type"] == "high_confidence").sum())
    possible = int((duplicates["match_type"] == "possible").sum())
    involved_records = set(duplicates["record_a"]) | set(duplicates["record_b"])
    report = {
        "input_records": len(raw),
        "output_records": len(output),
        "high_confidence_duplicates": high_confidence,
        "possible_duplicates": possible,
        "unique_records": len(output) - len(involved_records),
        "missing_values_before": {column: int((raw[column] == "").sum()) for column in raw.columns},
        "missing_values_after": {column: int(output[column].isna().sum()) for column in raw.columns},
        "normalization_changes": changes,
        "invalid_records": {"count": int((flags != "").sum()), "by_reason": invalid_by_reason},
    }
    CLEANING_REPORT_PATH.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"Input records: {report['input_records']}")
    print(f"Records with changes: {int((output.drop(columns=['validation_flags']) != raw).any(axis=1).sum())}")
    print(f"High-confidence duplicates: {high_confidence}")
    print(f"Possible duplicates: {possible}")
    print(f"Unique records: {report['unique_records']}")


if __name__ == "__main__":
    main()
