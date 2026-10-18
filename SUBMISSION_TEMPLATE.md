# Bug Hunt submission

Copy this file once per finding. Name it `<yourname>-<short-slug>.md`.
One defect per file. Do not bundle.

---

**Hunter:** your name (and your pair's name, if any)
**Username on the portal:**
**Date and time found:**

## Title

One line. State the defect, not the symptom.
Good: "Event capacity check allows one registration past capacity"
Bad: "Something wrong with events page"

## Classification

| Field | Your answer |
| --- | --- |
| Level | 1 Surface / 2 Logic / 3 Security / 4 Deep |
| Severity | low / medium / high / critical |
| Area | client / server / data / docs / design |

## Location

```
path/to/file.ext:line
```

List every file involved if the defect spans more than one.

## Steps to reproduce

1.
2.
3.

Start from a fresh state (`npm run reset-db`) if the defect needs one. Say so if it does.

## Expected

What a correct implementation would have shown or done.

## Actual

What it actually shows or does. Paste the exact text, number, response body or error.

## Root cause

In your own words, why the code behaves this way. Name the mechanism, not the line.
"The comparator returns a boolean instead of a number, so the sort order is
implementation defined" — that is a root cause. "The sort is broken" is not.

## Impact

Who is affected, how badly, and how easily it is reached. Is it visible to a visitor who
is not logged in? Does it corrupt stored data? Does it affect everyone or one record?

## Evidence

Screenshot, terminal output, `curl` command and response, or a short recording.
For security findings, include the exact request you sent.

## Suggested fix

The smallest change that resolves it. A diff is ideal.

```diff
- broken line
+ fixed line
```

## Anything else the same mistake affects

If the same helper, pattern or assumption is used elsewhere, say where. This is where the
documentation points are.
