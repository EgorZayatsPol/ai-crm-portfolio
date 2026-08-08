"""Reusable normalization helpers for the WoodStep customer export."""

from __future__ import annotations

import re
from datetime import date
from typing import Any

import pandas as pd


def _text(value: Any) -> str | None:
    """Return a trimmed string, or None for missing/empty values."""
    if value is None or pd.isna(value):
        return None
    text = str(value).strip()
    return text or None


def _collapse_spaces(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def normalize_name(value: Any) -> str | None:
    text = _text(value)
    if text is None:
        return None
    return " ".join(part.capitalize() for part in _collapse_spaces(text).split(" "))


def normalize_email(value: Any) -> str | None:
    text = _text(value)
    return _collapse_spaces(text).replace(" ", "").lower() if text else None


def normalize_phone(value: Any) -> str | None:
    """Return Polish numbers as +48XXXXXXXXX without changing missing values."""
    text = _text(value)
    if text is None:
        return None

    digits = re.sub(r"\D", "", text)
    if digits.startswith("0048"):
        digits = digits[4:]
    elif digits.startswith("48") and len(digits) == 11:
        digits = digits[2:]
    elif len(digits) == 9:
        pass
    else:
        return f"+{digits}" if digits else None
    return f"+48{digits}"


def normalize_city(value: Any) -> str | None:
    text = _text(value)
    return " ".join(part.capitalize() for part in _collapse_spaces(text).split(" ")) if text else None


def normalize_address(value: Any) -> str | None:
    text = _text(value)
    if text is None:
        return None
    text = _collapse_spaces(text)
    text = re.sub(r"^ulica\s+", "ul. ", text, flags=re.IGNORECASE)
    text = re.sub(r"^ul\.\s*", "ul. ", text, flags=re.IGNORECASE)
    # Title casing words preserves flat and building numbers while making entries consistent.
    parts = [word.capitalize() if any(char.isalpha() for char in word) else word for word in text.split(" ")]
    if parts and parts[0].lower() == "ul.":
        parts[0] = "ul."
    return " ".join(parts)


def normalize_date(value: Any) -> str | None:
    text = _text(value)
    if text is None:
        return None
    formats = ("%Y-%m-%d", "%Y/%m/%d", "%d/%m/%Y", "%d.%m.%Y")
    for format_string in formats:
        parsed = pd.to_datetime(text, format=format_string, errors="coerce")
        if not pd.isna(parsed):
            return date.isoformat(parsed.date())
    return None
