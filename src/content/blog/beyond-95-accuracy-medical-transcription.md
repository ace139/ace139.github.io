---
title: 'Beyond 95% Accuracy'
subtitle: "What I've Learned Building SoTA Production-Grade Medical Transcription"
description: 'The engineering lessons from building voice agents for healthcare - where benchmarks fail, context hints unlock accuracy, and your production failures become your most valuable training data'
date: '2026-01-06'
heroImage: './beyond-95-accuracy-medical-transcription-hero.png'
tags: ['ai', 'healthcare', 'speech-recognition', 'machine-learning', 'voice-agents']
---

## The Sad Reality of Benchmarks

I've been building voice agents the last few months. When I first started building them for healthcare, the benchmarks made me rethink! Whisper Large v3 was hitting 3% WER on LibriSpeech and that made the problem look solved.

But then, I tried this with doctors.

**FAIL!**

Collaborating with Clinicians in India and the US showed me that medical transcription isn't a "speech-to-text" problem; it's a "signal-to-system" problem. The benchmarks broke immediately because doctors don't talk to machines like they talk to humans. They use a compressed, rapid speech pattern - a "procedural dialect" where words are elided and abbreviations are non-standard.

To make it worse, the environments are noisy. The incessant chatter in the hospital and the controlled chaos of an OR create acoustic signatures that general-purpose models weren't trained to ignore. Also, in all these critical settings, a 95% accuracy rate is a failure.

## Medical Transcription is Challenging

In healthcare, errors are catastrophic. ASR systems typically exhibit an 8-17% WER on medical terminology. But "Metformin" becoming "Metoprolol" isn't a 1-word error - it's a medication swap between a diabetes drug and a beta-blocker.

There is indeed one lever to "unlock" — **Context Hints**.

Whisper allows you to pass domain hints. Priming the model with "This is a Root Canal procedure" versus "This is a CT brain report" drastically shifts how the model interprets ambiguous phonemes. It's a simple architectural move that many skip, yet it's the difference between an unacceptable transcript and a clinical record.

## Improving the Accuracy of the Transcription

To hit production-grade accuracy without the overhead of massive fine-tuning, I landed on a two-stage pipeline.

**Stage 1: The Raw Capture (Whisper v3 Turbo via Groq)**
Groq's LPU inference is the best way to run Whisper v3 Large at a speed that feels alive. While it provides a solid output, the transcript is still raw and far from being complete and accurate.

**Stage 2: The LLM Refinement (Kimi-K2 on Groq)**
The raw transcript is piped into Kimi-K2. I chose Kimi because of the cost-to-intelligence ratio on Groq. For error correction, you need a model that understands medical context but doesn't require the $15/M token price tag of a top-tier proprietary model. Kimi provides "reflex-grade" reasoning - perfect for spelling correction - at a fraction of the cost.

## The Audio Input Challenges - The Hardware Reality

A common mistake is assuming you can dictate to the hardware. You hardly ever see a $300 cardioid mic in a clinic. The model has to be workable on commonly found consumer-grade hardware: iPad, iPhone, and MacBook mics. Asking a doctor to wear a lapel mic is a point of friction that kills adoption.

To manage this, we use a layered audio approach:

- **Off-the-shelf Background Noise Cancellation**: Removing the baseline hum of clinical environments. This took some back and forth.
- **Silero VAD (Voice Activity Detection)**: Segmenting the audio to ensure the ASR only processes actual speech, not ambient ward noise.

The plan is to eventually train our own noise cancellation models based on the specific audio data we collect, making the system increasingly resilient to the unique "noise" of a Hospital.

## The Prompt Structure

The core of our accuracy gain comes from a specialized Kimi-K2 prompt. The prompt treats the LLM as a transcription specialist, not a writer. It focuses on four pillars:

1. **Language Filtering**: Strip all non-English fragments without translating them.
2. **Terminology Correction**: Normalize spelling for drugs and procedures.
3. **Perspective Preservation**: Maintain the speaker's exact point of view and tone.
4. **Format Constraint**: Return a single, clean paragraph with no "helpful" introductory fluff.

This constraint fundamentally changes the hallucination risk. By asking the LLM to correct rather than create, we leverage its medical knowledge while keeping it tethered to the original audio signal.

## Evals on Private Data is the Only Moat

Public benchmarks are vanity metrics. They don't tell you how you perform for a dentist in Austin or a neurosurgeon in Chicago.

The real value of human-in-the-loop review isn't just catching errors - it's data curation. Every time a doctor corrects a transcript, we capture a "ground truth" pair. These pairs form our Private Benchmark.

- Did they fix a comma? (Low signal).
- Did they change "left" to "right"? (High signal).

This feedback loop eventually feeds the fine-tuning pipeline. Since you can't scrape the web for clinical dictations, your production failures are quite literally your most valuable training data.

## Building Industry-specific Metrics

Standard WER is a lie. In production, we track:

- **MC-WER (Medical Concept WER)**: Accuracy specifically on clinical terms.
- **Negation Accuracy**: Does "No history of malignancy" stay "No history"?
- **Laterality**: "Left" vs "Right" must be 100%.

## The Engineering is in the Pipeline, Not the Model

Stop chasing the 99% accuracy model. It doesn't exist. Instead, build a system that expects the model to fail and has the guardrails - VAD, layered noise cancellation, and LLM post-processing - to catch it.
