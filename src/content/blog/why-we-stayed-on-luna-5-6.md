---
title: 'Why We Stayed on Luna 5.6'
subtitle: 'Choosing the model behind an agent with evals built from our own Slack traffic'
description: "The newer, cheaper model lost on our real-traffic evals. How we pick the model behind Hawkeye, our Slack PM agent, and the setting that beat switching."
date: '2026-10-09'
tags: ['ai', 'llm', 'evaluation', 'agents']
---

gpt-6-luna is the newer model and costs about half as much as gpt-5.6-luna. On our real-traffic evals it was less accurate, returned unusable answers more often, and had far worse latency spikes. We kept gpt-5.6-luna. The biggest gain came from somewhere else entirely: raising its reasoning effort from `none` to `low` took our classifier from 91.6% to 98.3% on the same 79 cases.

This is how we got there, and what the agent in question actually does.

## Meet Hawkeye

At [Oogway Labs](https://oogwaylabs.com/) we run several client engagements at once, and most of the work gets agreed in Slack. Someone asks for a fix in a client channel, a teammate says "on it", a deadline is mentioned in passing, and two days later nobody remembers who owned it. A project manager can catch some of that. Nobody catches all of it across every channel, every day.

Hawkeye is the agent we built to catch it. It sits in our Slack and does what a careful PM would do:

- **Listens.** It reads every message in the channels it is in and decides whether it creates, updates or closes a piece of work. Most messages it leaves alone; quiet tracking gets a single 👀.
- **Files work in Linear.** Each client channel maps to a Linear project. New work lands in Triage with an owner, a due date and a link to the thread, and Slack and Linear stay in sync after that.
- **Chases, politely.** One morning digest per channel, at most three questions, each addressed to the one person who can answer it. Stale items get raised once and then muted.
- **Keeps private things private.** Personal todos and reminders stay in DMs and never reach a channel, a digest or Linear.

When a client asks "where are we on this?", the answer is already in Linear with a link to the conversation where it was agreed.

## Why a Slack bot, and not another app

We could have built Hawkeye as a dashboard. We chose not to, because the work does not happen in dashboards. Requests, decisions, deadlines and "I'll take it" all happen in Slack threads, with clients and teammates, all day. A tool that lives somewhere else starts out behind the conversation and stays there.

Most AI tooling adds another place to go: an inbox to check, a board to update, a system someone has to feed and keep honest. The tool becomes a job of its own, and when nobody owns that job, it goes stale. We wanted the opposite. Hawkeye should feel like a teammate who sits in every channel, not software someone has to run.

<figure class="diagram">
<svg viewBox="0 0 440 300" role="img" aria-label="Before Hawkeye, a person reads every channel, copies work into the tracker and chases status by hand. With Hawkeye in the channel, it reads every message, files work into Linear Triage, and status syncs back while the team keeps talking in Slack.">
<defs><marker id="a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head" d="M0 0 L10 5 L0 10 z"/></marker><marker id="a-aa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head-a" d="M0 0 L10 5 L0 10 z"/></marker></defs>
<text class="h" x="10" y="18">Before: a person is the integration</text>
<rect class="bx" x="10" y="50" width="100" height="40" rx="6"/><text class="t" x="60" y="74" text-anchor="middle">Slack thread</text>
<rect class="bx" x="170" y="50" width="100" height="40" rx="6"/><text class="t" x="220" y="74" text-anchor="middle">Someone</text>
<rect class="bx" x="330" y="50" width="100" height="40" rx="6"/><text class="t" x="380" y="74" text-anchor="middle">Tracker</text>
<line class="ln" x1="110" y1="70" x2="168" y2="70" marker-end="url(#a-ar)"/>
<text class="lbl" x="140" y="42" text-anchor="middle">reads</text>
<line class="ln" x1="270" y1="70" x2="328" y2="70" marker-end="url(#a-ar)"/>
<text class="lbl" x="300" y="42" text-anchor="middle">copies</text>
<path class="ln" d="M220 90 V126 H60 V93" marker-end="url(#a-ar)"/>
<text class="lbl" x="140" y="142" text-anchor="middle">chases status</text>
<line class="rule" x1="10" y1="166" x2="430" y2="166"/>
<text class="h" x="10" y="192">With Hawkeye: a teammate in the thread</text>
<rect class="bx" x="10" y="222" width="100" height="40" rx="6"/><text class="t" x="60" y="246" text-anchor="middle">Slack thread</text>
<rect class="bx-a" x="170" y="222" width="100" height="40" rx="6"/><text class="t" x="220" y="246" text-anchor="middle">Hawkeye</text>
<rect class="bx" x="330" y="222" width="100" height="40" rx="6"/><text class="t" x="380" y="246" text-anchor="middle">Linear</text>
<line class="ln-a" x1="110" y1="234" x2="168" y2="234" marker-end="url(#a-aa)"/>
<text class="lbl" x="140" y="214" text-anchor="middle">every message</text>
<line class="ln-a" x1="270" y1="234" x2="328" y2="234" marker-end="url(#a-aa)"/>
<text class="lbl" x="300" y="214" text-anchor="middle">files to Triage</text>
<line class="ln-a" x1="170" y1="251" x2="112" y2="251" marker-end="url(#a-aa)"/>
<text class="lbl" x="140" y="282" text-anchor="middle">👀 · replies · digest</text>
<line class="ln" x1="330" y1="251" x2="272" y2="251" marker-end="url(#a-ar)"/>
<text class="lbl" x="300" y="282" text-anchor="middle">status syncs back</text>
</svg>
<figcaption>The person in the middle disappears. The team keeps talking in Slack, and the record keeps itself.</figcaption>
</figure>

That one decision drives most of the design:

- **Nobody has to update it.** People keep talking the way they already do. Hawkeye reads the conversation and keeps the record.
- **Talking to it is the interface.** You mention it like a colleague: "track this for @teammate by Friday", "this is done", "assign this to @teammate instead". Correcting it takes one sentence in the thread.

A teammate in every channel also has to be trusted, so a few rules sit on top:

- **An unowned item beats a wrong owner.** If Hawkeye cannot tell who owns something, it leaves the owner blank instead of guessing. A wrong guess lands in a stranger's digest.
- **Every Linear write has a person behind it.** Either someone asked for that change, or the sync is repeating a change a person already made on the other side.
- **Hawkeye never fails silently.** If a schedule dies, the classifier fails, or credit runs low, one operator gets a DM. A message addressed to Hawkeye always gets either an answer or a visible warning.

## The stack

| Layer | Choice | Why |
| --- | --- | --- |
| Agent framework | eve on Vercel | Durable sessions, tools, schedules, Slack channel handling and evals in one project. |
| Models | Vercel AI Gateway | gpt-5.6-luna as the primary, with a DeepSeek fallback pinned to two specific providers. One credential, no provider API keys. |
| Data | Supabase Postgres | Todos, routing rules, an audit log of every decision, and row-level security on every table. |
| Integrations | Slack + Linear via Vercel Connect | Scoped OAuth tokens per app, with Linear writes gated by explicit rules. |

Three parts of this setup matter for the rest of this post. Every model call goes through the AI Gateway, so comparing models is a change of model string on the same credential, with no new provider accounts or keys. Session evals run on eve's own eval runner (`eve eval session`) against the same agent that runs in production. And deploys are plain: a push to main deploys to production through Vercel's Git integration, while CI runs the typecheck, the deterministic checks and the build on every push.

### The life of a message

<figure class="diagram">
<svg viewBox="0 0 440 446" role="img" aria-label="A Slack message passes a prefilter, then the classifier, which chooses to ignore, track or reply. Tracked work becomes a todo and a Linear Triage issue. Every outcome is written to the decision log.">
<defs><marker id="b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head" d="M0 0 L10 5 L0 10 z"/></marker></defs>
<rect class="bx" x="90" y="10" width="260" height="46" rx="6"/><text class="t" x="220" y="30" text-anchor="middle">Slack message</text><text class="s" x="220" y="45" text-anchor="middle">any channel Hawkeye is in</text>
<line class="ln" x1="220" y1="56" x2="220" y2="84" marker-end="url(#b-ar)"/>
<rect class="bx" x="90" y="86" width="260" height="46" rx="6"/><text class="t" x="220" y="106" text-anchor="middle">Prefilter</text><text class="s" x="220" y="121" text-anchor="middle">drops acks, bot posts · no model</text>
<line class="ln" x1="220" y1="132" x2="220" y2="160" marker-end="url(#b-ar)"/>
<rect class="bx-a" x="90" y="162" width="260" height="46" rx="6"/><text class="t" x="220" y="182" text-anchor="middle">Classifier</text><text class="s" x="220" y="197" text-anchor="middle">gpt-5.6-luna · pinned fallback</text>
<line class="ln" x1="200" y1="208" x2="80" y2="252" marker-end="url(#b-ar)"/>
<line class="ln" x1="220" y1="208" x2="220" y2="252" marker-end="url(#b-ar)"/>
<line class="ln" x1="240" y1="208" x2="360" y2="252" marker-end="url(#b-ar)"/>
<rect class="bx" x="10" y="254" width="124" height="46" rx="6"/><text class="t" x="72" y="274" text-anchor="middle">Ignore</text><text class="s" x="72" y="289" text-anchor="middle">most messages</text>
<rect class="bx" x="158" y="254" width="124" height="46" rx="6"/><text class="t" x="220" y="274" text-anchor="middle">Track</text><text class="s" x="220" y="289" text-anchor="middle">👀 reaction</text>
<rect class="bx" x="306" y="254" width="124" height="46" rx="6"/><text class="t" x="368" y="274" text-anchor="middle">Reply or ask</text><text class="s" x="368" y="289" text-anchor="middle">one question</text>
<line class="ln" x1="220" y1="300" x2="220" y2="328" marker-end="url(#b-ar)"/>
<rect class="bx" x="130" y="330" width="180" height="46" rx="6"/><text class="t" x="220" y="350" text-anchor="middle">Todo + Linear</text><text class="s" x="220" y="365" text-anchor="middle">Triage · owner · due · link</text>
<line class="ln dash" x1="72" y1="300" x2="72" y2="398" marker-end="url(#b-ar)"/>
<line class="ln dash" x1="368" y1="300" x2="368" y2="398" marker-end="url(#b-ar)"/>
<line class="ln dash" x1="220" y1="376" x2="220" y2="398" marker-end="url(#b-ar)"/>
<rect class="bx dash" x="10" y="400" width="420" height="36" rx="6"/>
<text class="t" x="220" y="423" text-anchor="middle">Decision log · reason, tokens, latency</text>
</svg>
<figcaption>Every human message takes this path. The model is one step in it; code before and after the model decides what is allowed to happen, and every outcome is logged with the model's reason.</figcaption>
</figure>

Cost is treated as a design constraint, not an afterthought. Every billed trigger, scheduled job and model call has a reason to exist, spend has alerts on it, and model credentials live in one place so no stray key can run up an unaccounted bill.

## Evals built from real traffic

The decision at the heart of Hawkeye is a passive classifier: one structured-output model call per human message. It receives the message, some thread context, up to twenty open items with their owners, and today's date in IST. It returns an action (ignore, track quietly, track and reply, or ask a clarifying question) plus a title, an owner, a due date, a duplicate pointer and any extra items a dense message contains.

We do not test that call with invented scenarios. Every one of the 79 cases in the classifier suite is a real message from our own workspace, with the thread and the open items exactly as they were at the time, and the verdict a careful person would have given.

### How a case gets made

1. **Every decision is logged.** Each passive message is filtered, classified and written to a decisions table with the model's stated reason, its token counts and its latency. Each item created, reassigned or closed is logged there too.
2. **Candidates are mined nightly.** An evening job scans the day's decisions for signs of a wrong call: an item a person corrected, closed straight away, or reassigned soon after creation. It queues those for review.
3. **A person reviews them daily.** Someone reads the queue and the real interactions, decides what the right verdict was, and turns each genuine miss into a case. That is a standing rule, so the suite never goes stale.
4. **The fix ships with its case.** A behaviour change merges together with the cases that pin it. The classifier suite and session evals run before any change to the prompt, the model or its settings, and their results go with the change.

<figure class="diagram">
<svg viewBox="0 0 440 214" role="img" aria-label="Production traffic feeds the decision log, nightly mining queues likely misses, a person reviews them daily, each genuine miss becomes an eval case, and the evals run before the next change merges and ships to production.">
<defs><marker id="c-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head" d="M0 0 L10 5 L0 10 z"/></marker><marker id="c-aa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head-a" d="M0 0 L10 5 L0 10 z"/></marker></defs>
<rect class="bx" x="10" y="20" width="124" height="46" rx="6"/><text class="t" x="72" y="40" text-anchor="middle">Production</text><text class="s" x="72" y="55" text-anchor="middle">Slack traffic</text>
<rect class="bx" x="158" y="20" width="124" height="46" rx="6"/><text class="t" x="220" y="40" text-anchor="middle">Decision log</text><text class="s" x="220" y="55" text-anchor="middle">verdict + reason</text>
<rect class="bx" x="306" y="20" width="124" height="46" rx="6"/><text class="t" x="368" y="40" text-anchor="middle">Nightly mining</text><text class="s" x="368" y="55" text-anchor="middle">misses queued</text>
<line class="ln" x1="134" y1="43" x2="156" y2="43" marker-end="url(#c-ar)"/>
<line class="ln" x1="282" y1="43" x2="304" y2="43" marker-end="url(#c-ar)"/>
<line class="ln" x1="368" y1="66" x2="368" y2="146" marker-end="url(#c-ar)"/>
<rect class="bx" x="306" y="148" width="124" height="46" rx="6"/><text class="t" x="368" y="168" text-anchor="middle">Daily review</text><text class="s" x="368" y="183" text-anchor="middle">a person decides</text>
<rect class="bx-a" x="158" y="148" width="124" height="46" rx="6"/><text class="t" x="220" y="168" text-anchor="middle">Eval case</text><text class="s" x="220" y="183" text-anchor="middle">message + thread</text>
<rect class="bx" x="10" y="148" width="124" height="46" rx="6"/><text class="t" x="72" y="168" text-anchor="middle">Pre-merge evals</text><text class="s" x="72" y="183" text-anchor="middle">run before merge</text>
<line class="ln" x1="306" y1="171" x2="284" y2="171" marker-end="url(#c-ar)"/>
<line class="ln-a" x1="158" y1="171" x2="136" y2="171" marker-end="url(#c-aa)"/>
<line class="ln" x1="72" y1="148" x2="72" y2="68" marker-end="url(#c-ar)"/>
<text class="lbl" x="80" y="112">ships</text>
</svg>
<figcaption>Production mistakes become eval cases, and those cases are run before the next change merges.</figcaption>
</figure>

A recent example. One morning, Hawkeye assigned two tickets to the person who asked for the work instead of the person who had to do it. One was "@colleague please respond to this email", which was filed to the sender. The other was a teammate offering "Shall I post this?" and getting the reply "Sure, please do", which was filed to the person who approved. By the next day both messages were cases in the suite, along with variants ("cc @someone", "ask @someone about X", "I'll send it to @someone") and a code-level guard for each pattern. The fix shipped the same day with a dated incident write-up covering the root cause, the fix and the evidence. Every production problem gets one, and the rule it produces goes into our architecture doc.

### Three layers of evals

The classifier is one model call inside a lot of ordinary code, so we test at three levels: the code around the model, the model call itself, and the whole agent end to end.

- **Deterministic checks** run without a model and cost nothing. They pin the code around the model: owner corrections, duplicate guards, date handling, privacy filters, the Linear sync's rules. CI runs them on every push.
- **The classifier suite** runs the real prompt and model on the 79 real cases. We run each configuration three times and read per-case pass counts, because a single run moves by two or three cases on noise alone. Cases run in parallel, so a full run takes about 21 seconds and a three-run comparison is cheap enough to do on every change.
- **Session evals** drive the full agent end to end, with real tools against a real database. Hard gates check behaviour (it never claims work it did not do; a failed approval fails closed; it does not invent deadlines) and a separate judge model scores tone.

## What the classifier needs from a model

Three properties of this job decide every comparison below:

- **It runs inline.** The call finishes before Hawkeye reacts to the message, so people feel the latency, and the slowest calls matter more than the median. Calls time out at 30 seconds.
- **The output is a contract.** A "track this" answer with no title is useless. We call that a *degenerate* answer. Production treats it as a failure and retries on the fallback model, which costs a second call and its latency.
- **Accuracy comes first.** Each call costs a fraction of a cent on either model, while a wrong owner or a missed deadline costs a person's time and a client's trust. Cost is the tiebreaker, not the deciding factor.

## Head to head: the gap opens

A first comparison in late September, on 61 cases at reasoning effort `none`, tied on accuracy (155 vs 154 of 183), but about 12% of gpt-6-luna's answers were degenerate and its p95 latency was 5.6s against 3.4s. We stayed. Two weeks and twelve new real-traffic cases later, we reran it: 73 cases ×3, effort `none`, the production prompt, with runs interleaved so neither model got a quieter minute of the gateway.

| | gpt-5.6-luna | gpt-6-luna |
| --- | ---: | ---: |
| Passes per run | 69, 67, 68 | 65, 66, 62 |
| Accuracy | **93.2%** | 88.1% |
| Degenerate answers | **0 / 207** | 24 / 207 (11.6%) |
| Latency p50 / p95 | 2.80s / 3.70s | 2.51s / 5.29s |
| Cost per 1k messages (warm cache) | $0.47 | **$0.21** |

<p class="table-note">73 cases ×3 at effort <code>none</code>. Gateway list prices. Back-to-back runs read about 99% of input from the prompt cache, so read the cost row as a ratio, not a bill.</p>

The new cases were the ones that separated the models. Both failed the same few hard cases, but gpt-6-luna also missed what reads like basic extraction:

- It dropped a due date written as "by Thursday" (0 of 3 runs right).
- It lost the second task in a two-task message (1 of 3).
- It created a todo for work someone reported as already finished (1 of 3).
- It matched a completion to the wrong open item (1 of 3).

The session evals showed something worse. gpt-5.6-luna passed all 42 gates in all three runs. In one of three runs, gpt-6-luna told the user it had linked a Linear issue that it never linked: the tool was never called and no record carried the link. That is the failure we least want from an agent people hand work to, and it is exactly what the honesty gate exists to catch.

## Was reasoning effort the problem?

Both models had been running at reasoning effort `none`, because the classifier is latency-bound. The fair question was whether gpt-6-luna simply needs room to think, and its degenerate answers came from denying it that. So we ran a matrix: both models at `none`, `low` and `medium`, 79 cases, three runs per cell, the two models in parallel lanes. We stopped `medium` after two runs per model because its latency ruled it out whatever the accuracy.

<figure class="diagram chart">
<svg viewBox="0 0 640 352" role="img" aria-label="Accuracy against p95 latency. gpt-5.6-luna moves from 91.6% at 3.2s (none) to 98.3% at 6.9s (low) and 98.1% at 8.9s (medium). gpt-6-luna moves from 88.6% at 7.1s (none) to 95.8% at 10.4s (low) and 98.1% at 9.2s (medium).">
<line class="rule" x1="60" x2="610" y1="260.6" y2="260.6"/><text class="lbl" x="52" y="264.6" text-anchor="end">88%</text>
<line class="rule" x1="60" x2="610" y1="181.7" y2="181.7"/><text class="lbl" x="52" y="185.7" text-anchor="end">92%</text>
<line class="rule" x1="60" x2="610" y1="102.9" y2="102.9"/><text class="lbl" x="52" y="106.9" text-anchor="end">96%</text>
<line class="rule" x1="60" x2="610" y1="24" y2="24"/><text class="lbl" x="52" y="28" text-anchor="end">100%</text>
<line class="rule" x1="60" x2="610" y1="300" y2="300"/>
<text class="lbl" x="60" y="318" text-anchor="middle">0s</text><text class="lbl" x="151.7" y="318" text-anchor="middle">2s</text><text class="lbl" x="243.3" y="318" text-anchor="middle">4s</text><text class="lbl" x="335" y="318" text-anchor="middle">6s</text><text class="lbl" x="426.7" y="318" text-anchor="middle">8s</text><text class="lbl" x="518.3" y="318" text-anchor="middle">10s</text><text class="lbl" x="610" y="318" text-anchor="middle">12s</text>
<text class="lbl" x="335" y="342" text-anchor="middle">p95 latency (slowest 5% of calls)</text>
<text class="lbl" x="60" y="14">accuracy</text>
<path class="series-a" d="M206.7 189.6 L376.3 57.5 L467.9 61.5"/>
<path class="series-b" d="M385.4 248.7 L536.7 106.8 L481.7 61.5"/>
<circle class="pt-a" cx="206.7" cy="189.6" r="5.5"/><text class="lbl" x="216.7" y="193.6">none</text><text class="lbl" x="196.7" y="193.6" text-anchor="end">gpt-5.6-luna</text>
<circle class="pt-a" cx="376.3" cy="57.5" r="5.5"/><text class="t" x="366.3" y="47.5" text-anchor="end">low · shipped</text>
<circle class="pt-a open" cx="467.9" cy="61.5" r="5.5"/><text class="lbl" x="461.9" y="47.5" text-anchor="middle">medium</text>
<circle class="pt-b" cx="385.4" cy="248.7" r="5.5"/><text class="lbl" x="395.4" y="252.7">none</text><text class="lbl" x="375.4" y="252.7" text-anchor="end">gpt-6-luna</text>
<circle class="pt-b" cx="536.7" cy="106.8" r="5.5"/><text class="lbl" x="546.7" y="110.8">low</text>
<circle class="pt-b open" cx="481.7" cy="61.5" r="5.5"/><text class="lbl" x="489.7" y="81.5" text-anchor="middle">medium</text>
</svg>
<figcaption>Accuracy against p95 latency for each model and effort, 79 cases. Up and to the left is better. <span class="key key-a">gpt-5.6-luna</span> <span class="key key-b">gpt-6-luna</span>. Filled points are three runs; hollow points are two, because <code>medium</code> was stopped on latency.</figcaption>
</figure>

| Model @ effort | Passes per run | Accuracy | Degenerate | p50 / p95 / max | $ / 1k |
| --- | ---: | ---: | ---: | ---: | ---: |
| gpt-5.6-luna none | 71, 72, 74 | 91.6% | 0% | 2.4 / 3.2 / 10.0s | 0.47 |
| **gpt-5.6-luna low (shipped)** | **77, 78, 78** | **98.3%** | **0%** | **3.9 / 6.9 / 8.9s** | **0.59** |
| gpt-5.6-luna medium* | 77, 78 | 98.1% | 0% | 4.5 / 8.9 / 22.5s | 0.65 |
| gpt-6-luna none | 68, 69, 73 | 88.6% | 5.8% | 2.6 / 7.1 / 17.9s | 0.26 |
| gpt-6-luna low | 76, 76, 75 | 95.8% | 2.2% | 3.9 / 10.4 / 48.8s | 0.36 |
| gpt-6-luna medium* | 76, 79 | 98.1% | 0% | 4.6 / 9.2 / 17.1s | 0.36 |

<p class="table-note">79 cases. *Two runs, stopped on latency. Latency is what a Slack message actually waited, including a retried first attempt. "Degenerate" is the share of answers that chose a tracking action but left the title empty.</p>

The hypothesis was mostly right. gpt-6-luna's degenerate rate fell as effort rose: 5.8%, then 2.2%, then 0%. A thinking budget clearly helps it keep the output contract. It still did not change the outcome:

- gpt-6-luna only reaches zero degenerate answers at `medium`, where 5% of calls take more than 9 seconds.
- At `low` it has a heavy tail: p95 of 10.4s and one call that took 48.8 seconds. gpt-5.6-luna at `low` never went past 8.9s.
- At its best it only ties: 98.1% at `medium`, against gpt-5.6-luna's 98.3% one effort level lower.

The more useful finding was about gpt-5.6-luna itself. Moving it from `none` to `low` removed about six misses per run, including cases that had failed on every run for weeks: an owner saying their review is done, a terse "done" closing its item, and a raised PR being read as "not started". `medium` added nothing on top and cost another second.

## Detour: other models through a third-party API

We also screened other fast models, mostly open-weight, through an OpenAI-compatible API that serves about 85 models, on the same 79 cases. These ran at each model's default effort, because that route does not accept `none`. Production still uses the AI Gateway only; this was an evaluation.

| Model | Accuracy | p50 / p95 | What went wrong |
| --- | ---: | ---: | --- |
| gpt-5.6-luna (control) | 99.6% | 4.3 / 8.7s | Run at the model's default effort, not our shipped `low`, so not directly comparable to the gateway rows |
| DeepSeek V4.1 Flash | 94.5% | 5.5 / 24–30s | Repeated 30-second timeouts on the same cases |
| Gemini 3.8 Flash | 91.1% | 9.6 / 30s | Slow, and no prompt caching, so about 50× the cost |
| MiMo V2.6 Flash | 87.3% | 7.4 / 19.6s | Ignored a strict JSON schema and renamed fields |
| MiniMax M3 | 65.8% | 4.1 / 6.2s | About one response in five came back empty |
| Qwen 3.8 Flash, GLM-5.3 Flash | stopped | ≥30s | Mostly timeouts; GLM also rejected the JSON schema outright |

<p class="table-note">79 cases. The open-weight models on that route are served by rotating upstream providers, with no way to pin one.</p>

None came close. The failures matched what we saw in August, when an unpinned provider pool for our fallback model dropped fields from structured answers and we pinned it to two named providers. Structured output is only as reliable as whichever upstream serves the request.

## What we shipped

- **Model:** unchanged. gpt-5.6-luna through the AI Gateway, with the provider-pinned DeepSeek fallback behind it.
- **Reasoning effort:** `none` → `low`. Two verification runs scored 157 of 158 (79 cases ×2), with a p50 of 3.8s and a p95 of 6.2s. Against the matrix figures, the trade is about 1.5 seconds more before Hawkeye's reaction on a typical message, and about 3.7 seconds at the slow end, for roughly six fewer mistakes per 79 messages. The per-message cost rises by about a quarter, from $0.47 to $0.59 per 1,000 messages.

## What we took away

1. **Test on your own traffic.** On paper, the newer and cheaper model was the obvious switch. Our 79 real messages told us not to, and showed exactly where it fell short.
2. **A newer model is a hypothesis.** gpt-6-luna is the newer generation and half the price. On our task it lost on accuracy, on keeping the output contract, on tail latency, and once on honesty.
3. **Sweep the settings before you swap the model.** Reasoning effort moved accuracy by almost seven points on the same model, more than any model swap on offer.
4. **Measure the shape of the answer, not just the verdict.** Counting degenerate answers separately is what made gpt-6-luna's problem visible. Pass/fail on the action alone would have hidden it.
5. **Look at the slowest calls.** At `low` both models had a median of 3.9 seconds. The p95 (6.9s vs 10.4s) and the maximum (8.9s vs 48.8s) told the real story for a call people wait on.
6. **Repeat runs and read each case.** Three interleaved runs, read case by case, separate real regressions from luck. Making the suite fast is what makes that habit stick.
7. **Provider routing is part of the model.** The same open-weight model behaved differently depending on which upstream served it. If structured output matters, pin the provider.

## What would make us look again

- gpt-6-luna producing zero degenerate answers at `none` or `low`, without the latency spikes.
- The suite passing everything at `low`. At that point it needs harder real cases before it can tell models apart again.

Until then, the newer model waits. Not because it is worse in general, but because 79 messages from our own Slack say it is worse at this job, and this job is the one we have.

---

*Method notes: production prompt and schema; Vercel AI Gateway; models compared in the same session with interleaved runs; 30-second per-call timeout; gateway list prices per million tokens (input / cached input / output) of $0.20 / $0.02 / $1.20 for gpt-5.6-luna and $0.10 / $0.01 / $0.50 for gpt-6-luna.*
