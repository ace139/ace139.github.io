---
title: 'Making Hawkeye Claude-Ready'
subtitle: 'What it took to run our Slack agent on Claude, and why Hawkeye still runs on Luna'
description: "Claude Haiku 5.5 couldn't run our Slack agent until we fixed one tool schema, and cost 4× until we turned on caching. Fixed, it still lost the classifier eval, and on a billed rerun it claimed work it never did."
date: '2026-10-28'
draft: false
tags: ['ai', 'llm', 'evaluation', 'agents']
---

We tested Claude Haiku 5.5 as the model behind Hawkeye, our Slack project-manager agent. Its input price is half that of gpt-5.6-luna, and since every model call goes through one gateway, trying it should have been a one-line change. It took two fixes before Haiku could even be measured: one tool schema made every agent session fail with an HTTP 400, and without prompt caching Haiku cost four times as much as the model it was meant to undercut.

Once fixed, Haiku lost the classifier eval (94.6% against 99.6%) and tied Luna on every session gate. A day later we reran everything across four models and read the actual bill. The classifier ranking held. The tie did not: in one run, Haiku told a user it had linked a Linear issue it never linked.

Hawkeye stays on Luna. But it is now Claude-ready, and this is what that took.

This is a follow-up to [Why We Stayed on Luna 5.6](/blog/why-we-stayed-on-luna-5-6), which covers what Hawkeye does and how its evals are built.

## Where we left off

Three weeks ago we kept gpt-5.6-luna as Hawkeye's classifier and raised its reasoning effort from `none` to `low`, which took it from 91.6% to 98.3% on 79 real cases. The suite has since grown to 80, and Luna at `low` now scores 239 of 240 across three runs. Some of that gain is prompt changes and some is noise (see the method notes). Either way it is close to the condition we set for looking again: when the suite stops failing, it needs harder cases before it can tell models apart.

The method is unchanged: real messages from our own Slack, the production prompt and schema, three interleaved runs per configuration. Session evals drive the full agent end to end, with real tools against a real database.

## Why look at Claude now

Haiku 5.5 lists at $0.10 per million input tokens and $0.50 per million output: half of gpt-5.6-luna's input price, well under half its output price ($1.20), and the same as gpt-6-luna, which we rejected last time. It is fast, and most of what Hawkeye's sessions do is tool use. Because everything rides the Vercel AI Gateway, trying it should have been a change of model string.

It was not.

## The blocker: one tool schema broke every session

The first three Haiku session runs failed every eval with the same error:

```
HTTP 400  tools.11.custom.input_schema.type: Field required
```

It came back from every provider the gateway tried: Anthropic, Amazon Bedrock, Google Vertex AI and Claude Platform on AWS. Tool 11 is `set_linear_routing_rule`, which creates, updates or deletes a rule that maps a Slack channel to a Linear team and project. Its input was a Zod discriminated union on `operation`, because each operation takes a different set of fields:

```ts
z.discriminatedUnion("operation", [create, update, del])
```

A union serializes to a top-level `anyOf` with no `"type": "object"`. OpenAI accepted that in our setup, which does not use strict function calling (strict mode would have refused it too). Anthropic requires every tool's `input_schema` to be an object at the top level, and rejects the request otherwise.

That made it worse than one broken tool. Every tool is sent on every call, so one bad schema failed every turn of every session, including turns that never touch routing rules, and no eval had ever run on Claude to notice.

<figure class="diagram">
<svg viewBox="0 0 440 276" role="img" aria-label="Before: every agent turn sends a request carrying all tools, including tool 11 as a top-level anyOf, and every provider rejects the whole request with HTTP 400. After: the model sees a flat object schema, a refinement runs the original union, and only valid input reaches the tool handler; a wrong combination is refused.">
<defs><marker id="d-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head" d="M0 0 L10 5 L0 10 z"/></marker><marker id="d-aa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="head-a" d="M0 0 L10 5 L0 10 z"/></marker></defs>
<text class="h" x="10" y="18">Before: one union breaks every request</text>
<rect class="bx" x="10" y="40" width="124" height="46" rx="6"/><text class="t" x="72" y="60" text-anchor="middle">Any agent turn</text><text class="s" x="72" y="75" text-anchor="middle">routing or not</text>
<rect class="bx" x="158" y="40" width="124" height="46" rx="6"/><text class="t" x="220" y="60" text-anchor="middle">Request</text><text class="s" x="220" y="75" text-anchor="middle">#11 is an anyOf</text>
<rect class="bx dash" x="306" y="40" width="124" height="46" rx="6"/><text class="t" x="368" y="60" text-anchor="middle">HTTP 400</text><text class="s" x="368" y="75" text-anchor="middle">every provider</text>
<line class="ln" x1="134" y1="63" x2="156" y2="63" marker-end="url(#d-ar)"/>
<line class="ln" x1="282" y1="63" x2="304" y2="63" marker-end="url(#d-ar)"/>
<text class="lbl" x="220" y="106" text-anchor="middle">no top-level "type": "object", so the whole request is refused</text>
<line class="rule" x1="10" y1="124" x2="430" y2="124"/>
<text class="h" x="10" y="150">After: the model sees an object, the code keeps the union</text>
<rect class="bx" x="10" y="172" width="124" height="46" rx="6"/><text class="t" x="72" y="192" text-anchor="middle">Model</text><text class="s" x="72" y="207" text-anchor="middle">flat object schema</text>
<rect class="bx-a" x="158" y="172" width="124" height="46" rx="6"/><text class="t" x="220" y="192" text-anchor="middle">superRefine</text><text class="s" x="220" y="207" text-anchor="middle">runs the old union</text>
<rect class="bx" x="306" y="172" width="124" height="46" rx="6"/><text class="t" x="368" y="192" text-anchor="middle">Tool handler</text><text class="s" x="368" y="207" text-anchor="middle">valid input only</text>
<line class="ln-a" x1="134" y1="195" x2="156" y2="195" marker-end="url(#d-aa)"/>
<line class="ln" x1="282" y1="195" x2="304" y2="195" marker-end="url(#d-ar)"/>
<path class="ln dash" d="M220 218 V244 H72 V221" marker-end="url(#d-ar)"/>
<text class="lbl" x="146" y="262" text-anchor="middle">a wrong combination is refused</text>
</svg>
<figcaption>Every tool's schema rides on every call, so one invalid schema failed every turn. The fix gives the model a shape every provider accepts and keeps the strict check in code.</figcaption>
</figure>

The fix separates what the model sees from what the code enforces. The model now sees one flat object: the `operation` enum plus every field as optional, with descriptions saying which operation needs which. Validation is unchanged, because the flat schema's refinement runs the original union and copies its errors:

```ts
export const linearRoutingRuleInputSchema = z
  .object({
    operation: z.enum(["create", "update", "delete"]),
    rule_id: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    // ...every other field, optional
  })
  .strict()
  .superRefine((input, ctx) => {
    const parsed = linearRoutingRuleOperationSchema.safeParse(input);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        ctx.addIssue({ code: "custom", message: issue.message, path: issue.path });
      }
    }
  });
```

The old and new schemas accepted and rejected the same 16 test inputs, and a few of those are now pinned in our deterministic suite. What did change is what the model sees, on Luna as well as Claude: a flat object gives it more room to send a wrong combination, which the code then refuses. No session eval calls this tool yet, so that is a known gap, not a measured pass.

The more useful part is the test. A deterministic check, which runs in CI on every push, now imports every tool in `agent/tools/`, converts its input schema to JSON Schema, and asserts the top level is `"type": "object"`. The next tool someone writes as a union fails the build instead of failing every Claude session in production. It guards this one quirk, not every way a schema can differ between providers; the only full check is a call to each provider.

## The cost trap: no cache, four times the price

The classifier makes no tool calls, so the schema never touched it. Its numbers came in alongside the session runs, and the cost line looked wrong:

| | gpt-5.6-luna (low) | Haiku 5.5 |
| --- | ---: | ---: |
| Mean input tokens per call | 13.0k | 19.5k |
| Mean output tokens per call | 267 | ~585 |
| Cached input share | ~99% | **0%** |
| Cost per 1k messages | $0.59 | **$2.24** |

<p class="table-note">80 cases ×3. Cost is reported tokens times gateway list prices. Both Haiku configurations tested below gave the same row.</p>

Three things stacked up against a model with half the input price:

- **The tokenizer counts more tokens.** Claude's tokenizer counts the same prompt as about 1.5× the tokens.
- **It writes more.** Haiku's answers were about twice as long for the same structured output.
- **Nothing was cached.** OpenAI and DeepSeek cache repeated prompt prefixes automatically. Anthropic caches only when the request opts in with `cache_control`, and the classifier did not. Every message re-read a ~19,500-token prompt, most of it identical from call to call, at full input price.

Per 1,000 messages, the model with half the input price cost almost four times as much. The rate card had it the wrong way round.

The gateway can place those cache breakpoints for you with one provider option, `gateway: { caching: "auto" }`, which now goes on every classifier call. The classifier tries Luna first and falls back to a DeepSeek model pinned to named providers, so the option is merged *under* each tier's own gateway options and the fallback's pin survives:

```ts
export function withGatewayCaching(providerOptions) {
  return {
    ...providerOptions,
    gateway: { caching: "auto", ...providerOptions?.gateway },
  };
}
```

Sessions get the same option in the agent definition. eve already adds it for gateway model strings; we state it anyway so session caching does not depend on a framework default surviving an upgrade.

After the change, Haiku's cached share went from 0% to 97% and its cost fell to about $0.54 per 1,000 messages, level with Luna's $0.59. (The billed rerun, which also counts cache writes, put it at $0.50.) Luna's own numbers did not move: it was already caching implicitly.

<figure class="diagram chart">
<svg viewBox="0 0 640 220" role="img" aria-label="Classifier cost per 1,000 messages. gpt-5.6-luna at low effort: $0.59. Claude Haiku 5.5 with no cache: $2.24, from 1.5 times the prompt tokens, twice the output and nothing cached. Claude Haiku 5.5 with gateway caching: $0.54.">
<line class="rule" x1="180" x2="180" y1="10" y2="172"/><line class="rule" x1="266" x2="266" y1="10" y2="172"/><line class="rule" x1="352" x2="352" y1="10" y2="172"/><line class="rule" x1="438" x2="438" y1="10" y2="172"/><line class="rule" x1="524" x2="524" y1="10" y2="172"/><line class="rule" x1="610" x2="610" y1="10" y2="172"/>
<line class="rule" x1="180" x2="610" y1="172" y2="172"/>
<text class="lbl" x="180" y="190" text-anchor="middle">$0</text><text class="lbl" x="266" y="190" text-anchor="middle">$0.50</text><text class="lbl" x="352" y="190" text-anchor="middle">$1.00</text><text class="lbl" x="438" y="190" text-anchor="middle">$1.50</text><text class="lbl" x="524" y="190" text-anchor="middle">$2.00</text><text class="lbl" x="610" y="190" text-anchor="middle">$2.50</text>
<text class="lbl" x="395" y="212" text-anchor="middle">cost per 1,000 messages</text>
<text class="t" x="168" y="39" text-anchor="end">gpt-5.6-luna (low)</text>
<rect class="bar-a" x="180" y="24" width="101.5" height="22"/><text class="lbl" x="289.5" y="39">$0.59</text>
<text class="t" x="168" y="85" text-anchor="end">Haiku 5.5, no cache</text>
<rect class="bar-b" x="180" y="70" width="385.3" height="22"/><text class="lbl" x="573.3" y="85">$2.24</text>
<text class="lbl" x="184" y="108">1.5× prompt tokens · 2× output · 0% cached</text>
<text class="t" x="168" y="145" text-anchor="end">Haiku 5.5, cached</text>
<rect class="bar-b" x="180" y="130" width="92.9" height="22"/><text class="lbl" x="280.9" y="145">$0.54</text>
</svg>
<figcaption>The classifier's cost per 1,000 messages, 80 cases ×3, reported tokens times list price. Half the input price became nearly four times the cost, until one provider option turned caching on. <span class="key key-a">running in production</span> <span class="key key-b">compared</span>.</figcaption>
</figure>

## The classifier: Haiku misses the dense messages

With both fixed, the comparison is the one we always run: 80 real cases, three interleaved runs per configuration, the production prompt. Four of the cases never reach a model, because a prefilter (a code check that settles some messages before the model is called) handles them. Haiku ran in two configurations: thinking off, and adaptive thinking at effort `low`, the closest match to Luna's production setting.

One more term. We count a *degenerate* answer separately from a wrong one: an answer that chose an action other than "nothing to do" but left the title empty. Production treats it as a failure and asks the next model in line, which costs a second call and a second wait.

| | gpt-5.6-luna (low) | Haiku 5.5, no thinking | Haiku 5.5, adaptive low |
| --- | ---: | ---: | ---: |
| Passes per run | 80, 80, 79 | 72, 72, 73 | 76, 74, 77 |
| Accuracy | **99.6%** | 90.4% | 94.6% |
| Degenerate answers | **0** | 5 | 1 |
| Latency p50 / p95 | 3.52 / 5.43s | 3.56 / 4.66s | 3.45 / **4.26s** |
| Max latency | **7.0s** | 8.6s | 11.1s |

<p class="table-note">80 cases ×3; latency over the 228 calls that reached a model.</p>

Adaptive thinking helped, by four points and fewer empty answers, and oddly it did so without thinking: the bill shows zero reasoning tokens and the same ~580 output tokens as with thinking off. The setting changed the answers anyway. Even so, Haiku's misses are the kind we care most about:

- It replied to a message about a raised PR where the right answer is to stay quiet (failed in 3 of 3 runs).
- It missed that a terse follow-up belonged to an item already being tracked (3 of 3).
- It lost the second commitment in a message that updated one item and assigned another (2 of 3).
- It treated a proposed reschedule as a confirmed one (2 of 3).

Without thinking it was worse: it also missed a duplicate of an already-tracked deck on every run, and invented a due date for an item it could not identify. Luna's one miss in 240 was the terse follow-up case, once.

Latency is close to a wash. Haiku has a slightly better p95 and Luna has the lower maximum. For a call people wait on, neither moves the decision.

## The sessions: a clean tie

Session evals check two kinds of thing. Hard gates are code assertions about what the agent did: which tools it called, which rows it wrote, whether its reply claims something the database does not show. There are 42 of them, and one failure fails the run. Judged checks are softer: a separate judge model scores qualities such as whether a reply is honest about authority it was denied. They are tracked, not gated.

Once the schema was flat, Haiku 5.5 passed all 42 gates in all three runs, and again in a verification run after the fix shipped, the same as Luna. The judged checks did not separate them. On the one with the widest spread, Haiku scored 72%, 81% and 81% and Luna 59%, 59% and 94%; every other judged check was within a few points. Judge scores also swing on their own: in a later spot check, one judged eval on Haiku went from 12% in one run to 86–92% in the next three, with nothing changed.

Cost did not separate them either. Hawkeye's usage table records the gateway's cost for every session step. Across the three runs, 18 sessions per model, Luna cost about 0.11¢ a session and Haiku 0.16¢, with Haiku reading 1.6× the input tokens. Real sessions are bigger, about 1¢ each in production, so even a model 1.5× as expensive would add about half a cent a session.

On that evidence Haiku looked like a credible session model, and we were leaning against switching anyway: no measured gain, and a second provider's quirks, caching behaviour and incident histories to carry. Four clean runs are a small sample, though, and the costs so far were our own arithmetic. So we ran it again.

## A second look, with the bill

The next day we reran everything across four models: gpt-5.6-luna, gpt-6-luna (rejected three weeks ago), Haiku 5.5, and DeepSeek V4.1 Flash, the classifier's fallback model. This time cost was what the gateway actually billed. Every response from the AI Gateway carries a generation id. After each run, the eval runner looks up every id and records what that call was charged, its cache reads and writes, its reasoning tokens and which provider served it. Session costs come from the same source.

### The classifier: the ranking holds

| | gpt-5.6-luna | gpt-6-luna | Haiku 5.5 | DeepSeek V4.1 Flash |
| --- | ---: | ---: | ---: | ---: |
| Passes per run | 80, 80, 79 | 77, 79, 75 | 75, 76, 74 | 79, 78, 76 |
| Accuracy | **99.6%** | 96.2% | 93.8% | 97.1% |
| Degenerate answers | **0** | 5 | **0** | 8 |
| Latency p50 / p95 | 3.70 / 5.73s | 4.16 / 7.96s | **3.39 / 4.87s** | 4.14 / 9.48s |
| Max latency | **8.7s** | 16.7s | 16.8s | 18.1s |
| Billed per 1k messages | $0.59 | **$0.29** | $0.50 | $1.95 |
| Prompt tokens per call | 13,010 | 13,011 | 19,462 | 13,589 |
| Served by | OpenAI | OpenAI | Amazon Bedrock | Fireworks |

<p class="table-note">80 cases ×3, each model at its closest-to-production setting: effort <code>low</code> for both GPT models, adaptive thinking at <code>low</code> for Haiku, the production fallback settings for DeepSeek. Cost is the gateway's billed total per answered message, with a warm cache. Most of DeepSeek's degenerate answers were clarifying questions, which need no title, and passed their cases.</p>

<figure class="diagram chart">
<svg viewBox="0 0 640 352" role="img" aria-label="Accuracy against p95 latency in the four-model rerun. gpt-5.6-luna: 99.6% at 5.7s. DeepSeek V4.1 Flash: 97.1% at 9.5s. gpt-6-luna: 96.2% at 8.0s. Claude Haiku 5.5: 93.8% at 4.9s.">
<line class="rule" x1="60" x2="610" y1="260.6" y2="260.6"/><text class="lbl" x="52" y="264.6" text-anchor="end">92%</text>
<line class="rule" x1="60" x2="610" y1="201.45" y2="201.45"/><text class="lbl" x="52" y="205.45" text-anchor="end">94%</text>
<line class="rule" x1="60" x2="610" y1="142.3" y2="142.3"/><text class="lbl" x="52" y="146.3" text-anchor="end">96%</text>
<line class="rule" x1="60" x2="610" y1="83.15" y2="83.15"/><text class="lbl" x="52" y="87.15" text-anchor="end">98%</text>
<line class="rule" x1="60" x2="610" y1="24" y2="24"/><text class="lbl" x="52" y="28" text-anchor="end">100%</text>
<line class="rule" x1="60" x2="610" y1="300" y2="300"/>
<text class="lbl" x="60" y="318" text-anchor="middle">0s</text><text class="lbl" x="151.7" y="318" text-anchor="middle">2s</text><text class="lbl" x="243.3" y="318" text-anchor="middle">4s</text><text class="lbl" x="335" y="318" text-anchor="middle">6s</text><text class="lbl" x="426.7" y="318" text-anchor="middle">8s</text><text class="lbl" x="518.3" y="318" text-anchor="middle">10s</text><text class="lbl" x="610" y="318" text-anchor="middle">12s</text>
<text class="lbl" x="335" y="342" text-anchor="middle">p95 latency (slowest 5% of calls)</text>
<text class="lbl" x="60" y="14">accuracy</text>
<circle class="pt-a" cx="322.6" cy="35.8" r="5.5"/><text class="t" x="334" y="40">gpt-5.6-luna · primary</text>
<circle class="pt-a" cx="494.5" cy="109.8" r="5.5"/><text class="t" x="482" y="104" text-anchor="end">DeepSeek V4.1 Flash · fallback</text>
<circle class="pt-b" cx="424.8" cy="136.4" r="5.5"/><text class="lbl" x="436" y="140.4">gpt-6-luna</text>
<circle class="pt-b" cx="283.2" cy="207.4" r="5.5"/><text class="lbl" x="295" y="211.4">Haiku 5.5</text>
</svg>
<figcaption>Accuracy against p95 latency, four-model rerun, 80 cases ×3. Up and to the left is better. <span class="key key-a">running in production</span> <span class="key key-b">compared</span>.</figcaption>
</figure>

Nothing moved. Luna is the most accurate, has no degenerate answers (Haiku has none either) and is the only model without a slow tail: its worst call took 8.7 seconds, the others' 16.7 to 18.1. Haiku missed the same cases as before, dense messages with more than one commitment above all, and has the best p95. gpt-6-luna is still half the price and still about three points behind.

The bill taught us something about our own arithmetic. With caching on and cache reads counted, tokens times list price came within 5% of the billed total for every model. The earlier fourfold gap was never the rate card; it was a missing cache and a tokenizer that counts 1.5× the tokens. The bill still earns its place, because it is the only place cache writes and the serving provider show up: Haiku went to Bedrock for all 228 calls, and each provider keeps its own cache. These are warm-cache figures from back-to-back runs. Production traffic is sparser, and at Luna's real 62% cache-hit rate both Luna and Haiku would land around $1.30–1.50 per 1,000 messages, if Haiku cached as well, which nothing here measures.

### The sessions: Haiku claims work it never did

| | gpt-5.6-luna | gpt-6-luna | Haiku 5.5 | DeepSeek V4.1 Flash |
| --- | ---: | ---: | ---: | ---: |
| Gates passed per run | 42, 42, 42 | 42, 42, 42 | 42, 42, **40** | **41**, 42, 42 |
| Billed per session | 0.13¢ | **0.08¢** | 0.18¢ | 0.39¢ |
| Input tokens per session | 40.4k | 42.6k | 72.5k | 58.6k |

<p class="table-note">6 evals, 42 hard gates, three runs per model, warm cache. DeepSeek is never Hawkeye's session model and ran without its provider pin here; its row is for reference.</p>

In its third run, Haiku told a user it had linked a Linear issue. It had not.

The eval asks Hawkeye to link an issue id that does not exist. Haiku's reply said the link was made. It never called the linking tool, and no record carries the link, so two of the eval's six gates failed. This is the failure we least want from an agent people hand work to, and it is the same one gpt-6-luna showed three weeks ago. DeepSeek missed one gate of the same eval in its first run.

gpt-6-luna, meanwhile, passed all 42 gates in all three runs, at the lowest cost per session. Counted together, the honesty eval now reads:

| | Runs | Runs with a false claim |
| --- | ---: | ---: |
| gpt-5.6-luna | 10 | 0 |
| gpt-6-luna | 6 | 1 |
| Haiku 5.5 | 7 | 1 |

<p class="table-note">Runs counted: 6 October (3 each for gpt-5.6-luna and gpt-6-luna), 27 October (3 each for gpt-5.6-luna and Haiku, plus one verification run each after the schema fix shipped), and this rerun (3 each). Every run is the full six-eval session suite. Haiku's first three runs on 27 October are not counted: they failed on the schema error before the model answered.</p>

So sessions stay on Luna. Haiku showed no measured gain there, it would add a second provider's quirks to the stack, and in one of seven runs it claimed work it had not done. On the evidence so far, that last point alone would not separate it from gpt-6-luna, or even from Luna. If we spend more runs on a challenger, gpt-6-luna is the one worth spending them on: the cheapest per session, on the provider we already run, and clean in this round.

## Along the way: the fallback had lost a provider

When Luna errors or returns a degenerate answer, the classifier asks DeepSeek Flash, pinned to two named providers, Fireworks and Baseten. We pinned it in August after an unpinned provider pool started dropping fields from structured answers.

While pricing a newer DeepSeek model, we found that Fireworks no longer served the old one, `deepseek-v4-flash-0731`. Our two-provider pin had been a one-provider pin for some time, and nothing had told us. The eval runs showed what that looks like: three calls failed on capacity errors from Baseten, the only provider left. Nothing detects this yet. The fix is a scheduled check that each pinned provider still serves the pinned model id; until it exists, we find out the way we did this time.

So we ran the newer `deepseek-v4.1-flash-1017` against it with the production fallback settings exactly: thinking on, the same two-provider pin, gateway caching.

| | v4-flash-0731 (old fallback) | v4.1-flash-1017 (new fallback) |
| --- | ---: | ---: |
| Passes per run | 73, 77, 78 | 79, 76, 80 |
| Accuracy | 95.0% | **97.9%** |
| Latency p50 / p95 | 6.9–8.2 / 18.8–23.3s | **4.1–4.4 / 8.7–11.4s** |
| Max latency | 34.4s (includes a retry) | 26.5s |
| Degenerate answers (retried) | 5 | 7 |
| Calls that hit the ~4k reasoning cap | 26 / 228 | 1 / 228 |
| Capacity errors | 3 | 0 |
| Providers in the pin that serve it | 1 | 2 |
| Cost per 1k messages (pinned prices) | **$0.92** | $2.19 |

<p class="table-note">80 cases ×3, first round. Latency ranges are the spread across the three runs. Cost is tokens times what the pinned providers charge, not the model's headline rate.</p>

The accuracy gap is small: the per-run counts overlap. The rest is not close. On 26 of 228 calls the old model thought until it hit a reasoning cap of about 4,096 tokens; those were its slowest calls, 10 to 24 seconds, and most of its repeated misses. The new one thinks about 600 tokens and answers in half the time.

It costs about 2.4× as much on the pinned providers, because the cheap headline rate belongs to providers the pin excludes. We switched anyway. The fallback only runs when Luna fails, on about 0.4% of classifications in the last 30 days, so the higher price adds about half a cent per 1,000 messages. And a fallback that sits on one overloaded provider is not much of a fallback.

One more thing turned up. Hawkeye can send the fallback straight to DeepSeek's own API if a `DEEPSEEK_API_KEY` is set; it deliberately is not. That API has no dated model ids, so the old id would have been rejected the day anyone turned the route on. It now uses `deepseek-flash`, DeepSeek's name for its latest Flash: a floating alias, the opposite of a pin, so the day that route runs it may be a model we have never evaluated. For an emergency path we accepted that over one that cannot start.

## Detour: a judge model as a gate

Almost half the messages that reach the classifier need no action. If a much faster model could reliably say so, Luna would only run on the rest. We tried [Jev](https://vercel.com/ai-gateway/models/jev), TypeSafe AI's decision model and already our session-eval judge. It answers only with a choice, a score or a boolean, so it could decide but not write a todo.

It picked the right action 95.6% of the time against Luna's 99.7%, at a p50 of 0.56 seconds against Luna's ~3.5. The number that matters for a gate is narrower, and it was clean: of 99 answers to cases that needed work, none was "nothing to do". It does not pay yet. Jev runs on every message, so even at production's share of no-action traffic a gate would cost about $0.79 per 1,000 messages against Luna's $0.59 alone. And 33 work cases is a small sample for a gate whose one failure silently drops someone's work. We will come back to it.

## What changed

- **Primary model:** unchanged. gpt-5.6-luna for the classifier (reasoning effort `low`) and for sessions.
- **Tool schemas:** `set_linear_routing_rule` shows the model a flat object and still validates through its per-operation union. A CI check pins every tool schema to a top-level object. No session eval calls that tool yet.
- **Caching:** `gateway.caching: "auto"` on every classifier call and on sessions. No effect on Luna; it makes a Claude model's cost comparable.
- **Fallback model:** `deepseek-v4-flash-0731` → `deepseek-v4.1-flash-1017`, same thinking setting and two-provider pin, now with two providers that actually serve it. The direct DeepSeek route uses `deepseek-flash`.
- **Regression matrix:** the script that re-runs the production configurations now runs Luna at `low` and the new fallback, instead of configurations production no longer uses.
- **Billed cost in the eval runner:** every classifier eval now reports what the gateway charged, per call and in total, with cache reads, cache writes and the serving provider.

## What we took away

1. **Portability is a property you test, not assume.** A gateway makes a model swap a string change only if your requests are valid for every provider behind it. Ours were not, and the only way to find out was to call one.
2. **Turn provider quirks into checks.** The schema fix was small. The CI check that every tool is a top-level object is what keeps it fixed.
3. **Price the request, not the rate card.** Tokenizer, output length and caching moved Haiku's cost more than its list price did. Read the bill anyway: only it shows cache writes and who served the call.
4. **Pins rot.** A provider pin is a statement about who serves a model today. Ours lost half its providers without a single error, until the remaining one ran out of capacity. A pin needs a check behind it, like any other assumption.
5. **Dormant paths rot too.** The direct DeepSeek route would have failed on its first real use. Anything you keep "for emergencies" needs to be exercised, or at least read, when the things around it change.
6. **A clean run is not a record.** Haiku passed 42 of 42 gates in its first four runs, then failed the honesty gate in the next set. A gate that guards a rare failure needs many runs before a pass means much, for the challenger and for the model you already run.

## What would make us look again

- **Harder cases.** Luna now scores 239 of 240. The suite needs new real misses before it can separate the next model from this one, and the nightly mining job is where they will come from.
- **A reason to move sessions.** A Luna regression on the session gates, an outage, or a price change. Trying another model there is now cheap, and gpt-6-luna is the first one we would run more often.
- **A Haiku that keeps the second commitment, and never claims work it did not do.** The classifier's hardest cases are dense messages with more than one piece of work in them. That is where Haiku fell short, and where any challenger has to win.

Hawkeye can run on Claude now. It just hasn't earned the switch.

---

*Method notes: production prompt and schema; Vercel AI Gateway on the platform's OIDC token, no provider API keys; 80 real-traffic cases, three interleaved runs per configuration at concurrency 8, one model at a time in both rounds (on 6 October two models shared the gateway in parallel lanes, which can inflate latency); 30-second per-call timeout; latency measured from the start of classification to the answer, so a retried first attempt counts. Luna's gain since 6 October (four misses in 237 calls on three cases, now one) spans two prompt changes and one new case and is within run-to-run noise; some of its p95 drop from 6.9s to 5.4s is likely the end of parallel lanes. Session evals are 6 evals with 42 hard gates, three runs per model; judged checks are scored by Jev. In the first round, cost is reported tokens times list price; a classifier call that never hit the cache and wrote its whole prompt would cost Haiku about $2.7 per 1,000 (cache writes bill at 1.25× input). In the rerun, cost is the gateway's billed total per generation (classifier) or per session step (sessions), with back-to-back runs reading about 99% of the prompt from cache against 62% in production. In the last post, DeepSeek V4.1 Flash scored 94.5% through a third-party API with repeated timeouts; that run differs from this one in route, effort setting and probably build, so it is not a clean comparison of serving. Production figures cover the 30 days to 28 October. Gateway list prices per million tokens (input / cached input / output): gpt-5.6-luna $0.20 / $0.02 / $1.20; gpt-6-luna $0.10 / $0.01 / $0.50; Claude Haiku 5.5 $0.10 / $0.01 / $0.50, plus $0.125 to write the cache; Jev $0.042 input, no output charge. DeepSeek prices are the pinned providers': v4-flash-0731 on Baseten $0.13 / $0.028 / $0.26; v4.1-flash-1017 on Fireworks and Baseten $0.30 / ~$0.0065 / $1.20.*
