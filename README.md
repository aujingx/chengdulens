# Chengdu Lens

**AI city-discovery concierge demo for first-time international independent travelers in Chengdu**

Live site: https://chengdulens.lovable.app

Chengdu Lens explores a focused travel-product question:

> When a first-time international visitor comes to Chengdu, how can an AI product help them decide which places fit their taste, why those recommendations are trustworthy, and how to turn saves into a realistic half-day plan?

This repository contains the interactive website and supporting product documentation. The website is the primary portfolio surface; the documents explain the product judgment behind it.

## Current Demo

The live demo is a single-page product experience:

1. **Hero / Story**: explains the product promise and demo boundary.
2. **Your Taste**: applies a first-time international visitor scenario.
3. **Discover**: shows 8 curated Chengdu places with images, quick facts, and fit reasons.
4. **Your Trip**: turns saved places into a lightweight route and supports rain replanning.
5. **Ask AI**: provides an AI concierge demo scoped to the 8 places, the profile, and saved places.
6. **Case Study**: summarizes product decisions, AI Agent logic, evidence boundaries, and roadmap.

## Product Strategy

Chengdu Lens is not trying to become a full OTA, booking marketplace, or generic global travel search product.

The first product bet is narrower:

- **Discovery before transactions**: help users decide what is worth saving before handling booking or payment.
- **Fit before popularity**: show why a place matches the user's current situation.
- **Evidence before fluency**: avoid unsupported claims, copied reviews, or hidden ranking.
- **Local replanning before full itinerary generation**: preserve confirmed choices and only replace affected stops.

## AI Product Design

The demo uses a simplified website interface, but the intended AI product logic is:

```text
Understand request -> Retrieve candidate places -> Check constraints
-> Explain evidence -> Save choices -> Build route -> Locally replan
```

Key design decisions:

- Use one orchestrating Agent rather than artificial multi-agent complexity.
- Keep hard constraints as gates before scoring.
- Keep Personal Fit and Evidence Confidence conceptually separate.
- Treat Chinese local platform signals, international traveler signals, and official facts as different evidence layers.
- Show demo and data boundaries clearly.

## Evidence Boundary

This is an interactive concept demo.

The following fields are for demonstration and require verification before production use:

- place descriptions
- opening hours
- ticket rules and booking links
- route times and transit notes
- nearby recommendations
- scores and popularity signals
- AI responses

The project does not copy third-party reviews, usernames, avatars, or unauthorized ratings.

## Roadmap

### Now

- Polish the Chengdu-focused demo.
- Keep the Case Study visible on the website.
- Make the README and documentation explain product judgment clearly.
- Avoid overclaiming real-time data, user validation, or production readiness.

### Next

- Register sources for 20 Chengdu places.
- Run 5 lightweight usability tests with international-travel-experience users.
- Create an offline Agent evaluation set for constraints, evidence grounding, and replanning.
- Improve the Case Study with observed usability findings.

### Later

- Test 2-3 city archetypes instead of expanding everywhere:
  - Chengdu: lifestyle and local rhythm
  - Shanghai: international urban discovery
  - Xi'an: historical and cultural route planning
- Build a city-expansion framework for place schema, evidence policy, and route patterns.
- Consider national or global coverage only after the city framework proves repeatable.

## Documentation

- [Product Case Study](docs/product-case-study-en.md) / [中文](docs/product-case-study-cn.md)
- [AI Agent System Design](docs/agent-system-design-en.md) / [中文](docs/agent-system-design-cn.md)
- [Research & Evidence Appendix](docs/research-evidence-appendix-en.md) / [中文](docs/research-evidence-appendix-cn.md)
- [Demo Specification](docs/demo-spec-en.md) / [中文](docs/demo-spec-cn.md)

## Development

```sh
bun install
bun run build
bun run dev
```

Built with TanStack Start, React, TypeScript, Tailwind CSS, and Lovable.
