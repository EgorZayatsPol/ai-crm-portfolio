# WoodStep — Customer Database Cleaning & Structuring

## Business scenario

WoodStep is a fictional Polish manufacturer of made-to-measure wooden staircases. Over several years, customer enquiries and sales leads have been entered into a legacy database through manual processes. The resulting export contains customer contact details alongside staircase preferences and indicative budgets.

All records in this project are synthetic. The names, email addresses (using the reserved example.test domain), phone numbers and addresses are fictional and are not derived from real people.

## Why the raw database is problematic

The source file emulates the kind of inconsistent data a growing small business may accumulate when several people enter data without one agreed format. A reliable customer view is difficult to build until values have been standardized, incomplete records identified and possible duplicates reviewed.

## Intentional data-quality issues

data/raw_customers.csv contains 500 records, including 50 intentionally created duplicate or near-duplicate records. More than 20% of rows contain one or more formatting or completeness issues, including:

- inconsistent casing and stray whitespace in names, emails and cities;
- Polish phone numbers represented with +48, 0048, local spacing, hyphens and missing values;
- email capitalization/whitespace variations and missing email values;
- inconsistent city and address formatting, including selected unaccented spellings;
- mixed date formats;
- inconsistent casing/formatting in selected staircase, material and budget values;
- exact duplicates and near duplicates that share a phone, an email, a name/address combination, or very similar names and addresses.

## Cleaning pipeline

Run the pipeline from this project directory:

```bash
python src/clean_data.py
```

It loads the raw export without altering it, validates the expected structure, normalizes contact and location fields, flags questionable values, and writes a cleaned copy plus review reports. No records are deleted or automatically merged.

Duplicate candidates are identified through exact normalized email, phone, and name/address matches. The pipeline also adds fuzzy candidates when the normalized city and at least one address number agree, name similarity is at least 88%, and address similarity is at least 80%. A candidate is high confidence only when it has an exact signal (confidence at least 0.90); qualifying fuzzy-only matches are marked possible for human review.

## Structure

- data/raw_customers.csv — intentionally messy synthetic legacy export
- src/ — normalization, validation, and duplicate-detection code
- reports/ — generated data-quality and duplicate-review reports
- requirements.txt — Python dependencies for the future implementation
