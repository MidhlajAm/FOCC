# FOCC Bug Hunt 2026

This repository has defects planted in it on purpose. Your job is to find them, prove
them, and write them up well enough that a judge can reproduce each one without asking
you a single question.

**The prize goes to the hunter with the highest total score. Score is not "how many bugs
you found" — it is findings × severity × how well you documented them.**

---

## How it works

1. Clone the repo, run it, use it like a normal member would.
2. When something is wrong, write it up using [SUBMISSION_TEMPLATE.md](SUBMISSION_TEMPLATE.md).
3. Email your report file to `focc@club.college.ac.in` with subject `Bug Hunt submission`,
   or hand it to a judge on a pen drive at a Saturday session.
4. Judges triage every evening. Accepted findings appear on the portal leaderboard.

Submissions close **11 October 2026, 18:00 IST**.

---

## The four levels

| Level | Name | What lives here |
| --- | --- | --- |
| 1 | Surface | Wrong text, wrong count, wrong date, broken link, broken image, a control that looks wrong |
| 2 | Logic | The screen renders fine, the answer it gives you is wrong: filters, sorting, pagination, totals |
| 3 | Security | Trust boundaries: tokens, permissions, other people's data, input that becomes code |
| 4 | Deep | State that survives across pages, timing and race conditions, data that contradicts itself, design and accessibility defects, and places where the code and the documentation disagree |

Every level is worth hunting. A well documented Level 1 finding beats a vague Level 3 one.

## Scoring

| Severity | Points | Meaning |
| --- | --- | --- |
| low | 10 | Cosmetic or copy defect, no wrong data |
| medium | 25 | Wrong result shown to the user, recoverable |
| high | 40 | Data loss, broken access control, injected markup |
| critical | 60 | Full account takeover or admin escalation |

Plus **up to 20 documentation points per finding**:

| Points | What earns them |
| --- | --- |
| 0–5 | Steps that reproduce it, exact file and line |
| 6–10 | Above, plus correct root cause in your own words |
| 11–15 | Above, plus real impact: who is hurt, how badly, how reachable it is |
| 16–20 | Above, plus a minimal correct fix and a note on what else the same mistake affects |

**Ties on total points are broken by the earliest accepted submission.**

### What loses you points

- **-10** for a false positive: code you claim is broken that is not. There are a few
  things in here that look wrong and are fine. Check before you file.
- **-25** for a report you cannot explain when asked. Tools are allowed, not understanding
  is not.
- Duplicate reports of the same root cause from the same hunter count once.

---

## Rules

1. One report per defect. If one mistake causes three symptoms, that is one finding —
   say so, and list all three symptoms. You get more documentation points for that, not
   fewer.
2. Every report needs a reproduction. "This looks wrong" is not a reproduction.
3. You may use any tool, including AI assistants. You must be able to explain every
   finding you submit, in person, without your notes. Judges will ask.
4. Attack the code in the repo, not the machine it runs on and not other hunters.
5. Do not push fixes to the shared repo during the hunt. Report, do not patch.
6. Work alone or in pairs. Pairs share one score.

## Scope

| In scope | Out of scope |
| --- | --- |
| `client/` — every page, component, hook and the stylesheet | `node_modules/` and upstream CVEs |
| `server/` — routes, middleware, data handling | The lab machine, the network, the projector |
| `server/data/seed.json` — records that contradict each other are defects | Other club repositories |
| `README.md`, `HUNT.md` and on-page copy — a document that disagrees with the code is a defect | Typos in this sentence (nice try) |

---

## How to hunt something that is not obvious

The easy findings are visible on one screen. The valuable ones are not. Things worth
trying, in rough order of how many people forget them:

- **Click the same button twice, fast.** Then reload and look at the number again.
- **Compare two places that show the same fact.** A total on one page and the rows that
  make it up on another. A date in a card and the same date in a detail view.
- **Visit a page, then go back to a page you already saw.** Did something change that
  had no reason to change?
- **Filter, then filter again, then reset.** Count what you get. Count what you should get.
- **Read the documentation, then read the code that implements it.** They were written on
  different days.
- **Open the network tab** and look at what the API actually sends back, not what the page
  chooses to display.
- **Put the URL bar to work.** Ids in paths, query parameters, and routes nothing links to.
- **Unplug your mouse.** Tab through a page. Then try the same page at 320px wide.
- **Type a name that is not English.** Or one with an emoji in it.

An assistant that reads one file at a time will hand you the Level 1 and Level 2
findings. It will not tell you that the number on the leaderboard disagrees with the
number on the dashboard, because that fact does not live in any single file. That gap is
where this contest is won.

---

## Judging

Judges score every accepted finding on severity and documentation, then rank hunters by
total. The judges' decision on severity is final. If two hunters report the same defect,
the earlier timestamp keeps the points and the later one gets nothing, so file as you go
rather than saving everything for the last night.

Questions: `#focc:matrix.org` or any lead at a Saturday session.
