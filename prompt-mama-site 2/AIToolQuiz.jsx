import React, { useState, useMemo } from “react”;

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Caveat:wght@500;600;700&display=swap');`;

const C = {
blue: “#BFDFEF”,
blueDeep: “#7CB6D6”,
pink: “#EC4899”,
pinkSoft: “#FCE7F3”,
yellow: “#FDE047”,
yellowSoft: “#FEF9C3”,
navy: “#1E2A4A”,
navySoft: “#475379”,
white: “#FFFFFF”,
};

const TOOLS = {
Claude: {
name: “Claude”,
maker: “Anthropic”,
url: “https://claude.ai”,
tagline: “the thoughtful one”,
blurb:
“Best for writing, long documents, decks, PDFs, and careful analysis. Built safety-first. Strong at coding too.”,
strengths: [“Documents & decks”, “Long writing”, “Coding”, “Safety-first”],
},
ChatGPT: {
name: “ChatGPT”,
maker: “OpenAI”,
url: “https://chatgpt.com”,
tagline: “the all-rounder”,
blurb:
“The most versatile day-to-day assistant. Great for image generation, voice mode, and a little of everything.”,
strengths: [“Image generation”, “Voice chat”, “Everyday use”, “Big ecosystem”],
},
Gemini: {
name: “Gemini”,
maker: “Google”,
url: “https://gemini.google.com”,
tagline: “the Google native”,
blurb:
“Lives inside Gmail, Docs, Drive, and Search. Natural pick if you spend your day in Google.”,
strengths: [“Google Workspace”, “Free w/ account”, “Multimodal”, “Search-aware”],
},
Copilot: {
name: “Copilot”,
maker: “Microsoft”,
url: “https://copilot.microsoft.com”,
tagline: “the work BFF”,
blurb:
“Built into Word, Excel, Outlook, and Teams. Obvious pick if Microsoft 365 is your work life.”,
strengths: [“Office integration”, “Excel + Word”, “Enterprise security”, “Bundled w/ M365”],
},
Perplexity: {
name: “Perplexity”,
maker: “Perplexity AI”,
url: “https://perplexity.ai”,
tagline: “the researcher”,
blurb:
“A search engine with an AI brain. Every answer comes with sources you can click. Best for research.”,
strengths: [“Cited sources”, “Real-time web”, “Research”, “Fact-checking”],
},
Grok: {
name: “Grok”,
maker: “xAI”,
url: “https://grok.com”,
tagline: “the unfiltered one”,
blurb:
“Plugged into X for real-time posts and trends. More casual and less filtered than the others.”,
strengths: [“Real-time X data”, “Casual tone”, “Trend-spotting”, “Free w/ X”],
},
};

const QUESTIONS = [
{
q: “Which world do you live in?”,
sub: “The devices and apps you actually use every day.”,
options: [
{ label: “Apple — iPhone, Mac, iPad”, scores: { Claude: 1, ChatGPT: 1 } },
{ label: “Google — Android, Pixel, Chromebook”, scores: { Gemini: 3 } },
{ label: “Microsoft — Windows, Surface, Office 365”, scores: { Copilot: 3 } },
{ label: “A mix of everything”, scores: { Claude: 1, ChatGPT: 1, Perplexity: 1 } },
],
},
{
q: “What do you want AI to help you with most?”,
sub: “Pick the one you’d reach for first.”,
options: [
{ label: “Writing — documents, decks, PDFs, long-form”, scores: { Claude: 3 } },
{ label: “Creating images and visuals”, scores: { ChatGPT: 3 } },
{ label: “Researching with real sources”, scores: { Perplexity: 3 } },
{ label: “Coding or technical work”, scores: { Claude: 2, Copilot: 2 } },
{ label: “Quick everyday questions”, scores: { ChatGPT: 2, Gemini: 2 } },
{ label: “Real-time news, trends, social pulse”, scores: { Grok: 3 } },
],
},
{
q: “How important is safety and privacy?”,
sub: “Strong guardrails and how your data is handled.”,
options: [
{ label: “Critical — I want the safest option”, scores: { Claude: 3, Copilot: 1 } },
{ label: “Important, but I’m flexible”, scores: { Claude: 1, ChatGPT: 1, Gemini: 1, Copilot: 1 } },
{ label: “Not a major factor for me”, scores: { Grok: 1, ChatGPT: 1 } },
],
},
{
q: “Does environmental impact factor in?”,
sub: “All AI uses a lot of energy. Some companies are louder about it than others.”,
options: [
{ label: “Yes — I look for transparency on this”, scores: { Claude: 1, Gemini: 1, Copilot: 1 } },
{ label: “Somewhat — nice to have”, scores: {} },
{ label: “Not a deciding factor”, scores: {} },
],
},
{
q: “How do you want answers delivered?”,
sub: “The vibe of the reply.”,
options: [
{ label: “Thoughtful, nuanced, like a colleague”, scores: { Claude: 2 } },
{ label: “Quick, direct, and helpful”, scores: { ChatGPT: 2, Gemini: 1 } },
{ label: “Backed by clickable sources”, scores: { Perplexity: 3 } },
{ label: “Witty and unfiltered”, scores: { Grok: 2 } },
],
},
{
q: “What’s the budget?”,
sub: “AI pricing keeps shifting — these are the current vibes.”,
options: [
{ label: “Free only, please”, scores: { Gemini: 2, ChatGPT: 1, Grok: 1 } },
{ label: “I’ll pay ~$20/mo for the right fit”, scores: { Claude: 1, ChatGPT: 1, Perplexity: 1 } },
{ label: “Already paying for productivity software”, scores: { Copilot: 2, Gemini: 1 } },
],
},
{
q: “Do you need today’s information?”,
sub: “News from this morning, prices, what people just posted.”,
options: [
{ label: “Yes — I need it current”, scores: { Perplexity: 2, Grok: 2, Gemini: 1 } },
{ label: “Sometimes useful”, scores: { ChatGPT: 1, Gemini: 1 } },
{ label: “Rarely — I want depth over recency”, scores: { Claude: 2 } },
],
},
];

function calculateScores(answers) {
const scores = Object.fromEntries(Object.keys(TOOLS).map((k) => [k, 0]));
answers.forEach((answerIndex, qIndex) => {
if (answerIndex == null) return;
const opt = QUESTIONS[qIndex].options[answerIndex];
Object.entries(opt.scores).forEach(([tool, points]) => {
scores[tool] += points;
});
});
return scores;
}

function rank(scores) {
return Object.entries(scores)
.sort((a, b) => b[1] - a[1])
.map(([name, score]) => ({ name, score }));
}

function EyebrowTag({ children, bg = C.yellow, fg = C.navy }) {
return (
<div
className=“inline-flex items-center gap-2 px-4 py-1.5 rounded-full”
style={{
backgroundColor: bg,
color: fg,
fontFamily: “Poppins, sans-serif”,
fontWeight: 800,
fontSize: “11px”,
letterSpacing: “0.15em”,
}}
>
<span style={{ fontSize: “10px” }}>★</span>
<span>{children}</span>
<span style={{ fontSize: “10px” }}>★</span>
</div>
);
}

export default function AIToolQuiz() {
const [step, setStep] = useState(-1);
const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));

const total = QUESTIONS.length;
const isWelcome = step === -1;
const isResults = step === total;
const isQuestion = step >= 0 && step < total;

const ranked = useMemo(
() => (isResults ? rank(calculateScores(answers)) : []),
[isResults, answers]
);

const top = ranked[0];
const runnerUp = ranked[1];
const topTool = top ? TOOLS[top.name] : null;
const runnerTool = runnerUp ? TOOLS[runnerUp.name] : null;

function selectOption(idx) {
const next = […answers];
next[step] = idx;
setAnswers(next);
setTimeout(() => {
if (step < total - 1) setStep(step + 1);
else setStep(total);
}, 220);
}

function reset() {
setAnswers(Array(QUESTIONS.length).fill(null));
setStep(-1);
}

return (
<div
className=“min-h-screen w-full”
style={{
backgroundColor: C.white,
color: C.navy,
fontFamily: “Poppins, system-ui, sans-serif”,
}}
>
<style>{FONT_IMPORT}</style>

```
  {/* Topbar */}
  <div
    className="w-full px-5 sm:px-8 py-3 flex items-center justify-between"
    style={{
      backgroundColor: C.navy,
      color: C.white,
      fontWeight: 700,
      fontSize: "11px",
      letterSpacing: "0.15em",
    }}
  >
    <span>AI MATCH QUIZ</span>
    <span>
      {isQuestion
        ? `${String(step + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`
        : isResults
        ? "RESULTS"
        : "START"}
    </span>
    <span style={{ color: C.yellow }}>@PROMPT_MAMA</span>
  </div>

  <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
    {isWelcome && (
      <div className="space-y-7">
        <EyebrowTag>QUIZ · 2 MINUTES</EyebrowTag>

        <h1
          className="leading-[0.95] tracking-tight"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(44px, 9vw, 68px)",
            color: C.navy,
            letterSpacing: "-0.02em",
          }}
        >
          Which AI is{" "}
          <span style={{ color: C.pink }}>actually</span>{" "}
          right for you?
        </h1>

        <p
          className="text-lg max-w-md leading-relaxed"
          style={{ color: C.navySoft, fontWeight: 500 }}
        >
          Six tools. Six personalities. One you. Answer 7 quick questions
          and we'll point you to the AI that fits how you live, work, and
          create.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {Object.keys(TOOLS).map((t, i) => {
            const colors = [
              { bg: C.blue, fg: C.navy },
              { bg: C.pinkSoft, fg: C.pink },
              { bg: C.yellow, fg: C.navy },
              { bg: C.blue, fg: C.navy },
              { bg: C.pinkSoft, fg: C.pink },
              { bg: C.yellow, fg: C.navy },
            ];
            const c = colors[i % colors.length];
            return (
              <span
                key={t}
                className="px-4 py-2 rounded-full"
                style={{
                  backgroundColor: c.bg,
                  color: c.fg,
                  fontWeight: 700,
                  fontSize: "13px",
                }}
              >
                {t}
              </span>
            );
          })}
        </div>

        <button
          onClick={() => setStep(0)}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full transition-transform hover:scale-105 active:scale-95"
          style={{
            backgroundColor: C.pink,
            color: C.white,
            fontWeight: 800,
            fontSize: "16px",
            letterSpacing: "0.02em",
            boxShadow: `0 4px 0 ${C.navy}`,
          }}
        >
          Start the quiz <span>→</span>
        </button>

        <div
          className="mt-4 p-5 rounded-2xl"
          style={{ backgroundColor: C.yellowSoft }}
        >
          <p
            style={{
              color: C.navy,
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: 1.55,
            }}
          >
            <span style={{ fontWeight: 800 }}>A note on honesty:</span>{" "}
            this quiz was built with Claude (Anthropic). Scoring is
            weighted by what each AI is genuinely good at — not by who
            built it. If Claude doesn't win for you,{" "}
            <span style={{ color: C.pink, fontWeight: 800 }}>
              it really doesn't.
            </span>
          </p>
        </div>
      </div>
    )}

    {isQuestion && (
      <div className="space-y-6">
        <div
          className="h-2 w-full rounded-full overflow-hidden"
          style={{ backgroundColor: C.blue }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((step + 1) / total) * 100}%`,
              backgroundColor: C.pink,
            }}
          />
        </div>

        <EyebrowTag>QUESTION {String(step + 1).padStart(2, "0")}</EyebrowTag>

        <div className="space-y-3">
          <h2
            className="leading-[1.05] tracking-tight"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(30px, 6vw, 44px)",
              color: C.navy,
              letterSpacing: "-0.02em",
            }}
          >
            {QUESTIONS[step].q}
          </h2>
          <p
            style={{
              color: C.navySoft,
              fontSize: "15px",
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            {QUESTIONS[step].sub}
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          {QUESTIONS[step].options.map((opt, i) => {
            const selected = answers[step] === i;
            return (
              <button
                key={i}
                onClick={() => selectOption(i)}
                className="w-full text-left px-5 py-4 rounded-2xl transition-all flex items-center gap-4 active:scale-[0.99]"
                style={{
                  backgroundColor: selected ? C.pink : C.white,
                  color: selected ? C.white : C.navy,
                  border: selected
                    ? `2px solid ${C.pink}`
                    : `2px solid ${C.blue}`,
                  fontWeight: 600,
                  fontSize: "15px",
                  lineHeight: 1.4,
                }}
              >
                <span
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: selected ? C.yellow : C.yellowSoft,
                    color: C.navy,
                    fontWeight: 800,
                    fontSize: "13px",
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-2">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                color: C.navySoft,
                fontWeight: 700,
                fontSize: "12px",
                letterSpacing: "0.1em",
              }}
            >
              ← PREVIOUS
            </button>
          ) : (
            <span />
          )}
          <button
            onClick={reset}
            style={{
              color: C.navySoft,
              fontWeight: 700,
              fontSize: "12px",
              letterSpacing: "0.1em",
            }}
          >
            ↻ RESTART
          </button>
        </div>
      </div>
    )}

    {isResults && topTool && (
      <div className="space-y-7">
        <EyebrowTag bg={C.pink} fg={C.white}>YOUR MATCH</EyebrowTag>

        <div className="space-y-2">
          <div
            style={{
              fontFamily: "Caveat, cursive",
              fontStyle: "italic",
              color: C.pink,
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            you matched with...
          </div>
          <h2
            className="leading-[0.9] tracking-tight"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(64px, 14vw, 110px)",
              color: C.navy,
              letterSpacing: "-0.04em",
            }}
          >
            {topTool.name}
          </h2>
          <div
            className="inline-block px-3 py-1 rounded-full"
            style={{
              backgroundColor: C.yellow,
              color: C.navy,
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.05em",
            }}
          >
            {topTool.tagline} · by {topTool.maker}
          </div>
        </div>

        <p
          style={{
            color: C.navy,
            fontSize: "17px",
            fontWeight: 500,
            lineHeight: 1.55,
          }}
        >
          {topTool.blurb}
        </p>

        <div className="flex flex-wrap gap-2">
          {topTool.strengths.map((s) => (
            <span
              key={s}
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: C.blue,
                color: C.navy,
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              {s}
            </span>
          ))}
        </div>

        <a
          href={topTool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full transition-transform hover:scale-105 active:scale-95"
          style={{
            backgroundColor: C.pink,
            color: C.white,
            fontWeight: 800,
            fontSize: "16px",
            boxShadow: `0 4px 0 ${C.navy}`,
          }}
        >
          Try {topTool.name} <span>↗</span>
        </a>

        {runnerTool && (
          <div
            className="p-6 rounded-3xl space-y-3"
            style={{ backgroundColor: C.pinkSoft }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: "11px",
                letterSpacing: "0.15em",
                color: C.pink,
              }}
            >
              ★ ALSO WORTH A LOOK ★
            </div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h3
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 900,
                  fontSize: "32px",
                  color: C.navy,
                  letterSpacing: "-0.02em",
                }}
              >
                {runnerTool.name}
              </h3>
              <span
                style={{
                  fontFamily: "Caveat, cursive",
                  fontStyle: "italic",
                  color: C.pink,
                  fontSize: "22px",
                  fontWeight: 700,
                }}
              >
                {runnerTool.tagline}
              </span>
            </div>
            <p style={{ color: C.navy, fontSize: "14px", fontWeight: 500, lineHeight: 1.55 }}>
              {runnerTool.blurb}
            </p>
            <a
              href={runnerTool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
              style={{
                color: C.pink,
                fontWeight: 800,
                fontSize: "12px",
                letterSpacing: "0.1em",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
              }}
            >
              VISIT {runnerTool.name.toUpperCase()} ↗
            </a>
          </div>
        )}

        <div
          className="p-6 rounded-3xl space-y-3"
          style={{ backgroundColor: C.blue }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: C.navy,
            }}
          >
            ★ YOUR FULL RANKING ★
          </div>
          <ol className="space-y-2">
            {ranked.map((r, i) => (
              <li
                key={r.name}
                className="flex items-center justify-between"
                style={{
                  color: C.navy,
                  fontWeight: i === 0 ? 800 : 600,
                  fontSize: "15px",
                }}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: "24px",
                      height: "24px",
                      backgroundColor: i === 0 ? C.pink : C.white,
                      color: i === 0 ? C.white : C.navy,
                      fontSize: "11px",
                      fontWeight: 800,
                    }}
                  >
                    {i + 1}
                  </span>
                  {r.name}
                </span>
                <span style={{ fontSize: "13px", fontWeight: 600 }}>
                  {r.score} pt{r.score === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div
          className="p-6 rounded-3xl space-y-3"
          style={{ backgroundColor: C.yellowSoft }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: C.navy,
            }}
          >
            ★ FULL TRANSPARENCY ★
          </div>
          <p style={{ color: C.navy, fontSize: "14px", fontWeight: 500, lineHeight: 1.6 }}>
            <span style={{ fontWeight: 800 }}>How this works.</span> Each
            answer adds points to one or more tools based on their publicly
            documented strengths.
          </p>
          <p style={{ color: C.navy, fontSize: "14px", fontWeight: 500, lineHeight: 1.6 }}>
            <span style={{ fontWeight: 800 }}>Built with Claude.</span> The
            scoring is weighted by what each AI is genuinely good at — not
            by who built the quiz. Claude only wins if your answers point
            there.
          </p>
          <p
            style={{
              fontFamily: "Caveat, cursive",
              fontStyle: "italic",
              color: C.pink,
              fontSize: "22px",
              fontWeight: 700,
              lineHeight: 1.2,
              paddingTop: "4px",
            }}
          >
            AI changes fast — try the top two and see which one feels right.
          </p>
        </div>

        <button
          onClick={reset}
          className="px-6 py-3 rounded-full"
          style={{
            backgroundColor: C.white,
            color: C.navy,
            border: `2px solid ${C.navy}`,
            fontWeight: 800,
            fontSize: "13px",
            letterSpacing: "0.05em",
          }}
        >
          ↻ TAKE IT AGAIN
        </button>
      </div>
    )}
  </div>

  <div
    className="w-full px-5 sm:px-8 py-3 flex items-center justify-between mt-10"
    style={{
      backgroundColor: C.navy,
      color: C.white,
      fontWeight: 700,
      fontSize: "11px",
      letterSpacing: "0.15em",
    }}
  >
    <span>AI MATCH QUIZ</span>
    <span style={{ color: C.yellow }}>★</span>
    <span style={{ color: C.yellow }}>@PROMPT_MAMA</span>
  </div>
</div>
```

);
}