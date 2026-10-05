# Database Entity Overview 

ResearchFlow is backed by a relational PostgreSQL schema deployed through Prisma ORM.

## Entities
- **User**: Core identities (Credentials, hashed Passwords, Roles). 
- **ResearchProject**: Primary grouping bounds.
- **ProjectMember**: Explicit mapped M:N join enforcing roles strictly within isolated project workspaces. Overrides global roles dynamically.
- **Paper**: Traces literature DOIs and reading states.
- **ResearchQuestion**: Traces hypotheses against Projects.
- **Experiment & ExperimentResult**: Connects testing scopes ensuring arbitrary parameters mapping cleanly (ex. 'Accuracy', 'F1 Score') avoiding ML framework structural binds.
- **Task**: Maps execution goals to specific assignee identifiers.
- **ActivityLog**: Unified audit chain logging explicit Actor/Action timestamps per Project domain cleanly visualizing history globally.
- **Observation / Finding / Comment**: Connects isolated insights bounding strictly to Project/Experiment relational constraints ensuring isolation scopes are not corrupted cross-team.
- **Notification & EmailDelivery**: Safely traps interaction hooks handling Resend pipeline hooks guaranteeing visibility.

See `prisma/schema.prisma` for explicitly aligned mapping types.
