# Lifemarks — Idea Validation

---

## 1. What does the app do?

A user opens the app, types a goal ("Run a half-marathon by December") or an experience they want to have ("Watch Oppenheimer", "Try Buhari Hotel"), sets a priority, and tracks progress with milestones. When they complete it, they mark it done and rate it.

**The specific outcome:** A personal record of things they wanted to do, things they did, and whether it was worth it — all in one place instead of scattered across Notes, WhatsApp saved messages, and their head.

---

## 2. Who is the user?

A 26–34 year old urban Indian — Bangalore, Chennai, Hyderabad — working in tech or a corporate job. They follow productivity creators on YouTube, have a "someday" list that never shrinks, feel like weekends disappear without anything to show, and use Notion or Notes to half-track goals but never finish the system. You can find 10 of them in any co-working space or a LinkedIn search for "software engineer, Bangalore."

---

## 3. What pain does it solve?

**Honest answer: it's a vitamin, not a painkiller.**

The user is not losing money today. They're not losing their job. The pain is diffuse — "I feel like I'm not living intentionally" — which is real but not urgent enough to make someone pull out a credit card on a Tuesday.

**The closest painkiller framing:** People DO have goals they care about (buy a house, learn guitar, run a 10K) and they DO forget them or lose track. The pain is the gap between who they want to be and who they are — but that gap has been acceptable for years without an app.

**Risk:** If the pain is a vitamin, retention will be the core problem. Users will sign up, add 5 things, feel good, and stop opening it in 2 weeks.

---

## 4. Why an app?

**Lifemarks is already a web app (PWA)** — not a native Android app. This is the right call.

- No Play Store 30% cut
- Instant updates, no review cycles
- Works on all devices from one codebase
- Users can install it to their home screen

**The only reason to go native later:** push notifications (already working via web push), offline-first (can be done with service workers), or if a specific native feature becomes critical (camera, widgets, lock screen integration). None of those require native right now.

---

## 5. What's the monetization model?

Currently: **₹0. No monetization.**

Realistic options ranked by fit:

| Model | Feasibility | Notes |
|-------|-------------|-------|
| **Freemium** (free: 10 goals/exp, Pro: unlimited + stats) | High | Natural gate, low friction to start |
| **One-time purchase** (₹199–499) | Medium | Works for productivity tools, hard to sustain |
| **Subscription** (₹99–149/month) | Low short-term | Requires strong daily retention first |
| **Ads** | Avoid | Destroys the premium feel |

**Recommended starting point:** Stay free until 500 active users. Then introduce a Pro tier (₹199 one-time or ₹49/month) with a clear feature gate. Validate willingness to pay before building the payment system.

**The 30% Play Store cut is irrelevant** since this is a PWA — payments go directly through your payment gateway (Razorpay, etc.).

---

## Honest Summary

| Question | Signal |
|----------|--------|
| Clear specific action? | Yes |
| Specific enough user? | Yes |
| Painkiller or vitamin? | Vitamin — retention risk is real |
| Right distribution channel? | Yes — PWA is correct |
| Monetization path? | Unclear, needs validation before building paywall |

**The one thing to validate before building more features:**  
Find 10 people who match the user profile. Get them to use it for 2 weeks. Check if they open it on day 7. If less than 3 of 10 do, the retention problem is more important than any new feature.
