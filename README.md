# ResearchFlow 🔬 

ResearchFlow is a complete, scalable, and beautifully designed Research Collaboration & Experiment Tracking Platform. Built for lab teams, research organizations, and independent academicians seeking robust project execution with integrated reviews and insights pipelines.

## Project Overview 
Modern researchers face structural overhead tracking hypothesis variations, datasets, observations, and literature. ResearchFlow unifies these verticals under single isolated project scopes while mapping all team activities asynchronously across an actionable audit and review trail perfectly suitable for institutional workflows.

## Features fully Implemented
* **Robust Role-based Access Rules** (Lead/Member/Supervisor scopes).
* **Research Project Workspaces** capturing structural tasks and goals mappings dynamically.
* **Literature Tracking** binding authors, reads, and DOIs.
* **Isolated Experiment Executions** tracking datasets limits, hyper-parameters alongside explicit unstructured Findings insights.
* **Metrics Persistence** maintaining dynamic key bounds (ex. Accuracies, Losses) cleanly separated structurally bounding to generic experiment scopes cleanly.
* **Supervisor Reviews Pipeline** trapping official 'Changes Requested' logic natively against experiment timelines securely.
* **Activity & Audit Subsystem** automatically tracking Actor variations visualizing beautiful interactive visual timelines natively inside workspaces.
* **Asynchronous Universal Email Alert Framework** using Resend / React Email for notification updates (webhook delivery state verifications mapping SVIX headers dynamically included).
* **High Performance Output** heavily depending on Next.js Server Side features stripping heavy UI bloat significantly accelerating Largest Contentful Paint times cleanly.

## Running Locally

1. Create a `.env` file referencing `.env.example` configurations (See below). Ensure PostgreSQL is running on your machine natively or through Docker.
`DATABASE_URL="postgresql://user:pass@localhost:5432/researchflow"`
2. Install package constraints.
`npm install`
3. Execute Prisma mappings aligning schema dependencies against PostgreSQL arrays recursively.
`npx prisma db push`
`npx prisma generate`
4. Preload dataset arrays matching valid mock interactions using Faker ensuring local demonstrations pop successfully. 
`npm run db:seed`
5. Boot system instances matching deployment bounds. 
`npm run dev`

Login dynamically using `lead@research.edu` passing password `password123`.

## Architecture Note
Check the `/docs` folder for intensive structural definitions capturing: Server Rendering behaviors vs UI Zustand maps, Authorization Pipeline boundaries securely blocking un-verified actors across actions globally, and detailed Schema mappings mapping foreign constraints specifically.
