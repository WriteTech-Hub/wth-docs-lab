---
title: "Intermediate Resources"
description: "Intermediate technical writing resources covering information architecture, docs-as-code, API documentation, quality systems, and AI-assisted workflows."
summary: "Develop reliable skills in information architecture, docs-as-code, API documentation, quality systems, and responsible AI use for technical writers."
date: 2026-06-14T20:52:00+01:00
lastmod: 2026-06-14T20:52:00+01:00
draft: false
weight: 300
toc: true
seo:
  title: "Intermediate Technical Writing Resources - WriteTech Hub"
  description: "Build portfolio-ready skills in information architecture, docs-as-code, API documentation, and quality systems for technical writers."
  canonical: ""
  robots: ""
---

# Intermediate Resources

This level is for writers who understand the basics and are ready to create documentation used in active projects and collaborative environments. The focus moves from learning concepts to developing reliable skills and a portfolio that demonstrates them.

There are four skill areas to work through: information architecture, docs-as-code, API documentation, and quality systems. They build on each other, so working through them in order is worth it, but if your current project makes one more urgent, start there.

## 1. Information architecture

Before writing anything, you need to think about how the content is organised and why that organisation matters. Information architecture is the practice of organising and structuring documentation so that readers can find what they need without going through unrelated content or guessing where information might be. It sounds obvious, but most documentation problems are actually architecture problems in disguise. The content exists; it is just in the wrong place, split across the wrong pages, or buried under an unhelpful structure.

At this level, learn to think about your documentation at the structural level before thinking about individual pages or sentences.

### Core concepts to get comfortable with

- **Docs hierarchy:** which pages exist, how they relate, what level of detail belongs where
- **Page goals:** every page should have one job. If a page is trying to do two things, split it.
- **Progressive disclosure:** give readers what they need for their immediate task, with paths to deeper information when they want it
- **Naming and headings:** names should say what a thing is, not what you wish it were
- **Cross-linking:** link to related content deliberately, not as a reflex
- **Avoiding duplication:** when the same information exists in two places, both versions go out of date
- **Content reuse and single sourcing:** avoid maintaining the same information in multiple places. Reuse content where possible and establish a single source of truth for information that appears across guides, references, and release notes

### Resources

- [The 5 Principles of Single Sourcing](https://paligo.net/blog/single-sourcing/the-5-principles-of-single-sourcing/) explains how to create a single source of truth for information and avoid the maintenance problems that occur when the same content is copied into multiple locations.
- [Single Sourcing in Technical Writing](https://www.archbee.com/blog/single-sourcing-in-technical-writing) provides a practical introduction to single sourcing, including when to use it, how it improves consistency, and the trade-offs involved.
- [Unlock the Power of Content Reuse in Technical Documentation](https://www.madcapsoftware.com/products/flare/single-sourcing.aspx) explores strategies for reusing content effectively while keeping documentation accurate, maintainable, and scalable.
- [Information Architecture for Technical Writing](https://paligo.net/blog/information-architecture/information-architecture-101-for-technical-writers/) covers documentation hierarchy, navigation, content organization, labeling, and findability from a technical writing perspective.
- [The Difference Between Information Architecture and Navigation](https://www.uxdt.nic.in/guidelines/ux-design-guidelines/navigation-and-information-architecture/) is a foundational article that helps you think about structure and navigation as separate but related concerns.
- [What Information Architecture Is and How I Use It to Improve User Experience](https://mockflow.com/blog/information-architecture-a-beginners-guide) explains information architecture from the perspective of a practicing technical writer and connects it to documentation outcomes.

### Practice

Find an open-source project whose documentation has grown over time and is now slightly inconsistent or hard to navigate. Your task is to redesign its information architecture.

You should produce:

- A before-and-after sitemap and write a short rationale explaining your decisions.
- What did you move, what did you merge, what did you cut, and why?

If you are not sure where to start, you can choose from well-known open-source projects such as:

- [GitHub Docs](https://docs.github.com/) ([Documentation](https://docs.github.com/), [GitHub repository](https://github.com/github/docs))
- [Mautic](https://docs.mautic.org/) ([Documentation](https://docs.mautic.org/), [GitHub repository](https://github.com/mautic/mautic))
- [Wagtail](https://docs.wagtail.org/) ([Documentation](https://docs.wagtail.org/), [GitHub repository](https://github.com/wagtail/wagtail))
- [CHAOSS](https://chaoss.community/kb-metrics-and-metrics-models/) ([Documentation](https://chaoss.community/kb-metrics-and-metrics-models/), [GitHub repository](https://github.com/chaoss))
- [Flask](https://flask.palletsprojects.com/) ([Documentation](https://flask.palletsprojects.com/), [GitHub repository](https://github.com/pallets/flask))

This is a strong portfolio piece because it demonstrates structural thinking, not just writing ability.

## 2. Docs-as-code

Docs-as-code means managing documentation with the same tools and workflows used for software, like version control, branches, pull requests, issue tracking, and automated checks. It is the standard workflow for developer-facing documentation teams, and being comfortable with it is a practical requirement for most technical writing roles. You need to know how the workflow works and be able to operate within it.

### Core concepts

- Learn how to use Git for tasks like cloning a repo, creating a branch, committing changes, pushing, and opening a pull request
- Pull request reviews as a quality gate, not just a formality
- Using issues as a documentation backlog
- Writing in Markdown, and understanding when rST or AsciiDoc might be used instead
- Release notes and versioning: how documentation tracks product changes

### Resources

[Write the Docs: Docs as Code](https://www.writethedocs.org/guide/docs-as-code/) is the community's primary reference for this workflow. Start there.

[A Technical Writer's Introduction to Docs as Code](https://www.writethedocs.org/guide/docs-as-code/) is a practical walkthrough covering the four components of a docs-as-code setup: version control, static site generator, CI/CD pipeline, and hosting.

### Video tutorials

The following sessions from the WriteTech Accelerator Program cover docs-as-code and Docusaurus in a practical, hands-on format. Watch sessions 1 and 2 alongside this section, and sessions 3 through 7 when you are ready to work with Docusaurus.

| # | Video | Duration |
|:---|:---|:---|
| 1 | Week 1, Session 1: Docs-as-Code in the Real World | 1:31:32 |
| 2 | Week 1, Session 2: Setting Up and Customizing Docusaurus | 1:53:09 |
| 3 | Portfolio Project Setup and Docusaurus Practical Session | 1:59:19 |

### Communities

Connecting with other writers is one of the most practical things you can do at this stage. These communities have active members who discuss tooling, workflows, and real documentation problems.

As you work through this level, share what you are building with us in the [WriteTech Hub community](https://writetechhub.org/our-community/). Post your documentation experiments, ask for reviews on your pull requests, share what you are struggling with, and learn from how others are solving similar problems.

You can also engage with broader communities to expand your perspective and see how other writers and teams approach their work:

- [Hackmamba Community](https://hackmamba.io/community/)
- [Write the Docs Community](https://www.writethedocs.org/)

### Practice

Set up a GitHub repository that demonstrates a basic docs-as-code workflow using a static documentation site.

You are expected to follow the Docusaurus setup shown in the video tutorials for this section. However, if you prefer, you may use another static site generator such as MkDocs or Hugo, as long as your documentation is structured and published locally or online.

Your documentation site should include a simple structure such as:

- A home page or introduction
- A getting-started page
- An installation or setup guide
- A troubleshooting page

In the same repository, add a `CONTRIBUTING.md` file explaining how someone should contribute to the documentation.

If you are not sure what to document, you can choose a simple setup such as:

- Setup instructions for a development environment (Python, Node.js, Git, etc.)
- A personal project (for example, a to-do app or portfolio website)
- A simple open-source starter project (for example, Flask, FastAPI, or Express boilerplate)

Once your repository is ready:

- Make a documentation change through a pull request
- Review it yourself after a day, or ask someone else to review it
- Share the repository or pull request in the [WriteTech Hub community](https://writetechhub.org) for feedback
- Then merge the pull request after applying feedback

The goal is to complete the full docs-as-code workflow at least once: set up → write → commit → pull request → review → revise → merge → publish.

## 3. API documentation

API documentation is consistently one of the most in-demand specialisations in technical writing. You do not need to be a developer to do it well, but you do need to understand what an API does, how it communicates, and what information a developer needs to actually use it.

Start by learning to read an API before you try to document one.

### Core concepts

- The difference between an API reference and an API guide, and why a developer needs both
- Requests and responses: endpoints, parameters, headers, authentication, status codes
- Error patterns: what breaks, why it breaks, and what the developer should do about it
- OpenAPI and Swagger: what they are, what they generate, and what they cannot replace

### Resources

[Documenting APIs: A Guide for Technical Writers](https://idratherbewriting.com/learnapidoc/) by Tom Johnson is the most widely used free course for this topic. It is hands-on: you learn by making actual API calls with Postman and curl, reading real responses, and writing documentation based on what you find. Work through it in full.

The [WriteTech Mentorship Pod](https://writetechhub.org) is a small-group mentorship programme for intermediate writers who want feedback on their work and accountability as they develop their skills. Join the community to participate.

### Video Tutorials

| # | Video | Duration |
|:---|:---|:---|
| 1 | API Documentation 101: Best Practices for Writing Clear and Useful API Docs | 1:09:54 |
| 2 | Week 2, Session 1: Understanding and Testing APIs | 2:09:36 |
| 3 | Week 2, Session 2: Writing API Docs and Working with OpenAPI | 2:02:15 |
| 4 | Documenting and Building with the Chimoney API | 1:01:41 |

### Practice

Document three endpoints from a public API. Good options include APIs with clear documentation and simple authentication or no authentication.

For each endpoint, you should test at least one working request.

You can choose from APIs such as:

- [GitHub API](https://docs.github.com/en/rest) (for example: user data, repositories, commits)
- [OpenWeatherMap API](https://openweathermap.org/api) (for example: current weather, forecast)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) (fake REST API for testing; no authentication required)
- [ReqRes API](https://reqres.in/) (simple user and authentication simulation API)
- [NASA API](https://api.nasa.gov/) (for example: astronomy picture of the day)
- [Open-Meteo API](https://open-meteo.com/) (weather API with no API key required)
- Any other public API with clear documentation and testable endpoints

For each endpoint, you should have a working example you tested yourself. Across the three endpoints, produce:

- A quickstart guide that gets a reader to their first successful request in under ten minutes
- An authentication guide (if required by the API)
- An errors and troubleshooting section
- Reference entries for each endpoint

## 4. Quality and review systems

Good documentation does not come from a careful writer working alone. It comes from a system that consistently catches problems before they reach readers.

At the intermediate level, you should start thinking less about "writing a document" and more about "designing a process that produces reliable documentation." This means moving from relying on final reviews to building quality into your workflow from the start.

### Defining what "done" means

Before any documentation is considered complete, there should be a clear definition of what "good" looks like. This prevents quality from depending on memory, personal standards, or last-minute attention.

A simple way to enforce this is through editorial checklists. Before publishing any document, you should be able to confirm:

- Does this serve the reader's goal?
- Is the structure correct for the content type?
- Has it been reviewed by at least one other person?
- Are all code samples tested and accurate?

A checklist ensures these questions are asked consistently across every piece of documentation, not just when you remember to ask them.

### Automating quality checks

As documentation scales, manual review alone is not enough. You need systems that can enforce consistency automatically.

This is where tools like [Vale](https://vale.sh/) come in. Vale is a command-line prose linter. You configure it with rules based on a style guide (Google, Microsoft, or your own), and it flags violations automatically — like passive voice, inconsistent terminology, heading capitalisation issues, and more.

It can run locally as you write and also in CI pipelines like GitHub Actions, ensuring every pull request is checked before it is merged.

### Resources

- [Vale documentation](https://vale.sh/docs/) covers installation, configuration, and writing custom rules.
- [Prose Linting with Vale (Meilisearch)](https://blog.meilisearch.com/prose-linting-with-vale/) is a practical walkthrough of setting Vale up for a real documentation project, from defining a style to running checks in CI.
- [How Datadog Uses Vale](https://www.datadoghq.com/blog/engineering/how-we-use-vale-at-datadog/) shows how a large documentation team uses Vale in production, including their approach to custom rules.

### Practice

Add Vale to one of your documentation repositories. Configure it with at least ten custom rules relevant to a style guide you define. Set it up to run as a GitHub Actions check on every pull request. Fix the violations it surfaces. Document your Vale configuration in the project's `CONTRIBUTING.md` so anyone else working in the repo knows it exists and how it works.

## 5. Using AI in intermediate-level technical writing

At the intermediate level, AI tools are practical time-savers. Most documentation teams are already using them. The question is not whether to use them but how to use them without compromising accuracy or quality.

### What you should learn at this level

#### 1. Advanced prompting techniques

Move beyond basic prompts to systematic approaches that produce consistent, reliable output across multiple documentation tasks. Learn to use:

- **Few-shot prompting with reusable templates:** build a library of prompt templates for common documentation tasks that include 2-3 examples of the desired output format
- **Chain-of-thought prompting:** for complex explanations, ask the AI to work through its reasoning step by step before giving the final answer. This produces more accurate technical explanations and helps you spot where the AI's logic diverges from reality
- **Prompt chaining:** break multi-step documentation tasks into a sequence of prompts where each step feeds into the next. For example: research notes → structured outline → first draft → style review → final edit

**Prompt chaining example:**

> **Step 1:** "Generate research notes on [topic] from the attached spec."
>
> **Step 2:** "Create a detailed outline for a user guide using these notes."
>
> **Step 3:** "Write the first section based on this outline, targeting intermediate users."
>
> **Step 4:** "Review this draft for technical accuracy against the source spec."

Each step uses the output from the previous step as its input. This is more reliable than asking for a complete draft in a single prompt because it gives you review points between steps.

#### 2. Reusable prompt libraries and workflows

Build a personal or team library of prompts that you can reuse across projects. Each prompt should be:

- Tested and validated against real output
- Versioned so you can track what changed when results shift
- Documented with notes on when it works well and when it fails
- Shared with teammates so quality is consistent across the team

Integrate AI tools into your document workflows and CI/CD pipelines. For example:

- Run AI consistency checks as part of your pull request review process
- Use AI to generate release notes from commit logs automatically, with human review as a gate
- Set up pre-commit hooks that flag style guide violations using AI-assisted linting alongside Vale

#### 3. AI-assisted editing and quality control

Use AI to enforce consistency at scale, not just to draft content. At this level, you should be able to:

- Check terminology consistency across a large document set by asking AI to identify terms used inconsistently
- Validate that AI-generated content matches your style guide by running it through the same checks you use for human-written content
- Compare multiple versions of the same explanation and evaluate which is clearer for your audience
- Identify gaps in documentation by asking AI to review a draft against a checklist of required topics

#### 4. Content architecture for retrieval systems

Design documentation content so it works well with AI retrieval systems like RAG (Retrieval-Augmented Generation) and chatbots. This means:

- **Semantic chunking:** break content into self-contained units that answer specific questions, rather than long pages that cover many topics. Each chunk should make sense on its own
- **Structured metadata:** add clear headings, labels, and tags that help retrieval systems understand what each chunk contains and who it is for
- **Clear boundaries:** separate tutorials from reference from explanation so AI systems retrieve the right type of content for the right query
- **Source attribution:** design content so AI-generated responses can point back to specific documentation pages, not just general knowledge

This is forward-looking work. Even if your team does not use RAG yet, designing content this way makes it more useful for both human readers and AI systems.

### What you can use AI for at this level

- Generate first drafts from rough notes or SME input: paste interview notes, Slack threads, or ticket comments and ask AI to organise them into a structured draft, then rewrite for accuracy and structure
- Produce release notes from commit logs or product notes: feed a changelog into AI and ask for a structured release notes draft, then verify each item against the actual release
- Check terminology consistency across a large document set: ask AI to scan multiple files and flag where the same concept is described with different terms
- Restructure or simplify dense technical content: give AI a complex technical explanation and ask it to reorganise using the Diátaxis framework or simplify for a less technical audience
- Write first-pass translations for review: use AI to produce initial translations, then have a native speaker review and correct
- Build editing checklists and verification workflows: use AI to generate checklists for specific document types, then validate them against your team's actual review process
- Automate routine quality checks: use AI alongside Vale to flag style inconsistencies, passive voice, or unclear headings across your entire documentation site

### What you should be careful about

AI tools produce confident output that is sometimes factually wrong. At the intermediate level, every AI-generated or AI-assisted draft needs to be validated against the actual product or system before it goes anywhere near a reader. The speed gained in drafting is often spent in review, which is why developing strong editing and validation habits matters.

Specific risks at this level:

- **Inconsistent output across sessions:** the same prompt may produce different results on different days. Document what works and test prompts regularly
- **Scope creep in AI drafts:** AI may add explanations, examples, or steps that were not in your source material. Always compare AI output against your SME input
- **False confidence in AI editing:** AI may "correct" technically accurate but unusual phrasing into something more generic but wrong. Never accept AI suggestions without understanding why

### Resources

- [AI in Technical Writing: Complete Guide for 2026 (INSTRKTIV)](https://instrktiv.com/en/ai-in-technical-writing/) — covers workflows, effective prompting, data handling, and quality control in AI-assisted documentation. Includes reusable prompts for user manuals, API endpoints, consistency checks, and troubleshooting.
- [AI in Technical Writing: A Complete Guide for 2026](https://www.adoc-studio.app/blog/technical-writing-guide) covers workflows, effective prompting, data handling, and quality control in AI-assisted documentation.
- Week 4, Session 2: Using AI Tools in Your Documentation Workflow from the WriteTech Accelerator Program covers this in a practical, applied format.
- Week 3, Session 4: Documentation Workflows and AI Integration covers how AI fits into broader documentation workflows.

### Practice

Pick a documentation task you have already completed manually in this guide — such as the API endpoint documentation, the Vale configuration, or the information architecture redesign. Use AI to:

1. Generate a first draft from your existing notes or source material
2. Apply prompt chaining: break the task into steps (research → outline → draft → edit) and use a separate prompt for each step
3. Review the AI output for consistency, accuracy, and tone against your style guide
4. Build a reusable prompt template for this task type, tested and documented with notes on what works
5. Share your prompt template with a peer and compare results

Document your prompt library, the AI output at each stage, and your review notes. This is a portfolio piece that shows you can build repeatable AI workflows, not just generate one-off drafts.

### Additional Practice

Pick a simple technical topic you are already familiar with. This could be something like:

- How to create a GitHub repository
- How to install a tool (e.g., Python, Node.js, VS Code)
- How to connect to Wi-Fi on a device
- How to set up a basic Notion page or Google Doc structure
- How to use a feature in an app you already use regularly

Write a short explanation of the process (just a few sentences or rough notes).

Then use an AI tool to:

- Turn your notes into a step-by-step how-to guide
- Rewrite it for a complete beginner who knows nothing about the tool
- Generate a clean, structured version with headings and formatting

After that, review the AI output and check:

- Is anything incorrect or exaggerated?
- Did the AI assume steps that don't exist or skip important ones?
- Is the order of steps actually usable in real life?
- Would someone be able to follow it without confusion?

Finally, rewrite the final version yourself so it is accurate and usable.

Compare:

- How quickly you produced a usable draft with AI
- How much correction was needed
- And whether the AI made your writing clearer or introduced mistakes

## 6. Tools overview

You do not need to master all of these before moving to the next level. Get familiar with the categories and learn the specific tools as your projects require them.

### Version control

Git and GitHub are the standard. GitLab and Bitbucket are used in some organisations. Knowing Git at a basic level is a prerequisite for most documentation roles.

### Documentation site generators

[MkDocs](https://www.mkdocs.org/), [Hugo](https://gohugo.io/), and [Docusaurus](https://docusaurus.io/) are the most common tools for turning Markdown files into published documentation sites. Docusaurus is covered in the video tutorials above.

### Writing tools

VS Code with a Markdown preview extension, Typora, or Obsidian for writing and editing. Google Docs or Microsoft Word for collaborative draft review.

### Visual tools

Miro, Lucidchart, Adobe, Canva, draw.io, or similar for diagrams and illustrations when you cannot get them from the engineering team.

Follow the [WriteTech Tool Review Series](https://writetechhub.org) for coverage of new and updated tools as they become relevant.

## 7. Portfolio projects

At this level, the goal is to have real work to show. Potential employers and collaborators want to see the documentation you produced, not a description of documentation you could produce. Every project below gives you something concrete.

| Project | What to do | Where to publish |
|:---|:---|:---|
| Technical blog posts | Write about a tool you use, a documentation workflow, or a concept you found difficult to understand. Teaching something is the fastest way to find gaps in your own knowledge. | WriteTech Hub guest posting, WriteTech Hub blog, Hashnode, Medium, Dev.to |
| README improvements | Find an open-source project with a weak README and rewrite it. Open a pull request. Getting it merged is a public contribution; even if it is not merged, the before-and-after is a portfolio piece. | Example repos: Flask, Requests, Docusaurus |
| Open-source documentation | Search GitHub for issues labelled "documentation" or "help wanted." Pick something specific and submit a pull request. | GitHub |
| Outreachy | Seasonal programmes like Outreachy offer structured open-source contribution with mentorship. | [Outreachy](https://www.outreachy.org/) |
| Mock project documentation | Choose a tool or workflow you know well and write complete documentation for it from scratch. Apply everything from this level: clean IA, docs-as-code workflow, Vale in CI. | Your own GitHub |
| Writing challenges | Join a structured writing challenge to practise producing documentation under time constraints. | Write-a-Thon and similar events |

## Capstone deliverable

Before moving to the Advanced level, build a complete portfolio-ready documentation project. In your capstone project, you may use AI to support drafting, restructuring, or editing your documentation. However, your final submission should clearly reflect your understanding of the system you are documenting.

If AI was used in your workflow, it should improve clarity and speed, not replace your reasoning or judgment.

This is a single end-to-end documentation project. You will design and build it from scratch, applying information architecture, API documentation, docs-as-code practices, and quality systems in one coherent project.

You are expected to treat this like a real documentation project that could exist in a production environment.

### What you will build

Your project must be a documentation site hosted in a GitHub repository using a static site generator (Docusaurus is recommended, but you may use any static site generator).

Your documentation system must include:

- A clear information architecture showing how the documentation is structured and navigated
- At least one complete API or technical guide, including a quickstart, authentication (if required), and error handling
- A docs-as-code workflow using GitHub (branches, pull requests, and review process)
- Vale integrated into the repository to enforce documentation quality checks in CI
- At least one diagram or visual that helps explain the system (architecture, flow, or process)

### Suggested project ideas

If you are unsure what to document, choose something simple but realistic, such as:

#### 1. A complete fictional SaaS product documentation site

You will create a documentation site for a fictional software product such as a task manager, expense tracker, study planner, or booking system.

Your documentation must include:

- A homepage that introduces the product
- A getting-started guide for new users
- A full user guide explaining how to use the product features
- A troubleshooting section for common user issues and errors
- An API documentation section that explains how the product can be accessed programmatically
- A clear navigation structure that organizes all documentation pages

In this project, the product is both a user-facing application and an API-based system.

#### 2. A fictional API platform (developer-focused product)

You will create documentation for a fictional API platform that provides a service to developers (for example: a messaging API, file storage API, weather aggregation API, or payment simulation API).

Your documentation must include:

- A homepage explaining what the API does
- A quickstart guide showing how to make a first successful API request
- Authentication documentation explaining how to access the API
- Full API reference documentation for at least 3 endpoints (request, response, parameters, errors)
- An error handling and troubleshooting section explaining failure cases
- A structured navigation system grouping all API documentation clearly

In this project, the API is the main product being documented.

#### 3. A system-based workflow documentation product

You will create documentation for a complete system workflow such as onboarding, setup, or operational process (for example: user onboarding system, deployment workflow, or account setup process).

Your documentation must include:

- A homepage explaining the system or workflow
- A step-by-step user guide for completing the process
- A technical explanation of how the system works behind the scenes
- An error and troubleshooting section covering what can go wrong and how to fix it
- A structured documentation layout that separates user actions from system explanations

In this project, the system is a process that must be clearly understood and followed.

### Required for ALL options (mandatory)

No matter which project you choose, your documentation must also include:

- A clear information architecture showing how all pages are organized
- A docs-as-code workflow using GitHub (branches and pull requests)
- Vale integrated into the repository for documentation quality checks
- At least one diagram or visual explaining a system, flow, or structure
- A fully working static documentation site

This project does not need to document a real product. A well-executed mock or a meaningful open-source contribution both count. What matters is that it demonstrates the full skill set from this level: structure, technical depth, workflow discipline, and quality control.

When you can build something like this without needing to look up every step, you are ready for [Advanced Resources](advanced.md).
