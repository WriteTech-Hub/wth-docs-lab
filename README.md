# Welcome to WTH Docs Lab! 🚀

This repository is a hands-on space for technical writers to improve their documentation skills, explore real-world examples, and contribute to WriteTech Hub’s documentation ecosystem. Whether you're building a portfolio or learning best practices, you're welcome here.

## Quick Links

- 📘 [Contribution Guidelines](./CONTRIBUTING.md)
- 👥 [Contributor List](./CONTRIBUTORS.md)

## Introduction

The **WTH Docs Lab** repository is created to serve two key purposes:

1. **Portfolio Showcase** – Demonstrating before-and-after improvements in documentation through structured comparisons, with annotated screenshots highlighting issues and refinements.
2. **Technical Writing Learning Lab** – Providing onboarding resources, best practices, and structured learning paths for technical writers to improve their documentation skills.

This repository is still in its early stages, and we are in the process of structuring it according to our planned information architecture. We will be integrating our portfolio samples, refining the layout, and ensuring it becomes a useful resource for both internal team members and external contributors.

## How to Use This Repository
1. **Explore the Onboarding Roadmap** → Follow structured learning paths.
2. **Compare Documentation** → Learn from before-and-after examples.
3. **Contribute** – Improve docs, suggest edits, or add yourself to the [contributor list](./CONTRIBUTORS.md).

<!--
1. **Get Started** – Follow the [onboarding roadmap](./content/guide/roadmap.md) to begin your learning journey.
2. **Learn by Example** – Explore real documentation before-and-after comparisons in the `/docs` section.
-->

## Technology Stack

This project is built using **Hugo** with the **Doks** theme, a powerful static site generator designed for documentation.

### Resources

- **Hugo Documentation:** [https://gohugo.io/documentation/](https://gohugo.io/documentation/)
- **Doks Theme Documentation:** [https://getdoks.org/docs/start-here/getting-started/](https://getdoks.org/docs/start-here/getting-started/)
- **Doks Project Structure:** [https://getdoks.org/docs/basics/project-structure/](https://getdoks.org/docs/basics/project-structure/)
- **Doks GitHub Repository:** [https://github.com/h-enk/doks](https://github.com/h-enk/doks)

## Planned Repository Structure

We are in the process of adapting the Doks theme to fit our needs. Once completed, the structure should be similar to the following:

```
📦 wth-docs
 ┣ 📂 content
 ┃ ┣ 📂 guide  # Onboarding and learning materials
 ┃ ┃ ┣ 📜 _index.md  # Overview of onboarding
 ┃ ┃ ┣ 📜 getting-started.md  # Technical writing intro
 ┃ ┃ ┣ 📜 roadmap.md  # Learning roadmap
 ┃ ┃ ┣ 📜 resources.md  # External references
 ┃ ┣ 📂 docs  # Before-and-after documentation comparisons
 ┃ ┃ ┣ 📜 _index.md  # Overview of refinement process
 ┃ ┃ ┣ 📂 api-docs  # API documentation transformations
 ┃ ┃ ┣ 📂 user-guides  # User documentation transformations
 ┃ ┃ ┣ 📂 compliance-docs  # Compliance document comparisons
 ┣ ...
 ┣ 📜 README.md  # Repository overview
 ┣ 📜 CONTRIBUTING.md  # Contribution guidelines
 ┣ 📜 CONTRIBUTOR.md  # List of Contributors
 ┣ 📜 CODE_OF_CONDUCT.md  # Community standards
 ┣ 📜 LICENSE.md  # Open-source license
```

This structure will evolve as we set up the repository and refine the organization of content.

## Getting Started

### Step 1: Install Hugo

Hugo is required to run this project locally. Follow the official installation instructions for your operating system:

- [**Install Hugo for macOS**](https://gohugo.io/getting-started/installing/#macos)
- [**Install Hugo for Windows**](https://gohugo.io/getting-started/installing/#windows)
- [**Install Hugo for Linux**](https://gohugo.io/getting-started/installing/#linux)

### Step 2: Install NPM

Doks also requires **NPM (Node Package Manager)** to install dependencies. If you don’t have NPM installed, follow the official installation guides:

- [**Install NPM for macOS**](https://nodejs.org/en/download/)
- [**Install NPM for Windows**](https://nodejs.org/en/download/)
- [**Install NPM for Linux**](https://nodejs.org/en/download/)

### Step 3: Clone the Repository

Clone the repository:

```sh
git clone https://github.com/WriteTechHub/wth-docs-lab.git
cd wth-docs-lab
```

### Step 4: Install Dependencies

Navigate to the clone repository and run the following command to install all necessary dependencies:

```sh
npm install
```

### Step 5: Run the Local Development Server

Start the Hugo server to view the project locally:

```sh
npm run dev
```

This will start a local development server, and you can access the documentation at:

```
http://localhost:1313/
```

### Step 6: Building the Site for Production

To generate a static version of the site for deployment:

- [**Building a Hugo site**](https://gohugo.io/commands/hugo/)

```sh
npm run build
```

The static files will be generated in the `public/` directory.

### Deployment

The live site at <https://writetech-hub.github.io/wth-docs-lab/> is deployed from the `roadmap-site` branch, not `main`. Pushing to `roadmap-site` runs the [Deploy to GitHub Pages](./.github/workflows/deploy.yml) workflow, which builds the site with Hugo and publishes it.

- To update the live site, make your changes on the `roadmap-site` branch (or open a pull request into it).
- Pushes to `main` do not trigger a deployment.
- Check the **Actions** tab to confirm that a deployment succeeded.

## Contribution Guidelines

As we finalize the repository structure, contributions should align with the following:

- Submit all changes via pull requests for review.
- Please read our [Contribution Guidelines](./CONTRIBUTING.md) before making a contribution.

## Next Steps

* Set up Hugo and clone the repository.
* Finalize the repository structure.
* Adapt the Doks theme to WriteTech Hub brand.
* Start adding onboarding resources and sample documentation refinements.
* Review contribution guidelines and ensure all team members are aligned.
* Generate static site and deploy site.

## Join the Community

Have questions or need support?

* Ask in the `#opensource` channel of the [WriteTech Hub Slack community](https://writetechhub.org/our-community/).
* Or [open an issue](https://github.com/WriteTech-Hub/wth-docs-lab/issues) on this repository.

We’re excited to grow and learn together! ✨


