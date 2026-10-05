import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Clearing old data...')

    await prisma.activityLog.deleteMany()
    await prisma.comment.deleteMany()
    await prisma.review.deleteMany()
    await prisma.notification.deleteMany()
    await prisma.finding.deleteMany()
    await prisma.task.deleteMany()
    await prisma.paper.deleteMany()
    await prisma.researchQuestion.deleteMany()
    await prisma.projectMember.deleteMany()
    await prisma.experimentResult.deleteMany()
    await prisma.observation.deleteMany()
    await prisma.experiment.deleteMany()
    await prisma.researchProject.deleteMany()
    await prisma.user.deleteMany()

    console.log('Seeding users...')
    const passwordHash = await bcrypt.hash('password123', 10)

    // Seed defined roles
    const lead = await prisma.user.create({
        data: {
            name: 'Dr. Alice Lead',
            email: 'lead@research.edu',
            password: passwordHash,
            role: 'RESEARCH_LEAD'
        }
    })

    const member = await prisma.user.create({
        data: {
            name: 'Bob Member',
            email: 'member@research.edu',
            password: passwordHash,
            role: 'RESEARCH_MEMBER'
        }
    })

    const supervisor = await prisma.user.create({
        data: {
            name: 'Prof. Charlie',
            email: 'supervisor@research.edu',
            password: passwordHash,
            role: 'SUPERVISOR'
        }
    })

    // create some extra random users
    const extraUsers = []
    for (let i = 0; i < 5; i++) {
        const u = await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: passwordHash,
                role: 'RESEARCH_MEMBER'
            }
        })
        extraUsers.push(u)
    }

    console.log('Seeding projects...')
    for (let i = 0; i < 3; i++) {
        const project = await prisma.researchProject.create({
            data: {
                title: faker.company.catchPhrase(),
                description: faker.lorem.paragraphs(2),
                researchArea: faker.science.chemicalElement().name,
                status: faker.helpers.arrayElement(['PLANNING', 'ACTIVE', 'COMPLETED']),
                startDate: faker.date.recent(),
                expectedEndDate: faker.date.future(),
                createdById: lead.id,
            }
        })

        // Assign members
        await prisma.projectMember.create({ data: { projectId: project.id, userId: lead.id, role: 'LEAD' } })
        await prisma.projectMember.create({ data: { projectId: project.id, userId: member.id, role: 'MEMBER' } })
        await prisma.projectMember.create({ data: { projectId: project.id, userId: supervisor.id, role: 'SUPERVISOR' } })

        // Assign some papers
        for (let k = 0; k < 5; k++) {
            await prisma.paper.create({
                data: {
                    projectId: project.id,
                    title: faker.lorem.words(5),
                    authors: faker.person.fullName() + ', ' + faker.person.fullName(),
                    url: faker.internet.url(),
                    addedById: lead.id
                }
            })
        }

        // Assign tasks
        for (let t = 0; t < 4; t++) {
            await prisma.task.create({
                data: {
                    projectId: project.id,
                    title: 'Review ' + faker.science.chemicalElement().name,
                    description: faker.lorem.sentence(),
                    status: faker.helpers.arrayElement(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']),
                    assigneeId: faker.helpers.arrayElement([lead.id, member.id]),
                    createdById: lead.id
                }
            })
        }

        // Experiments
        for (let e = 0; e < 2; e++) {
            const exp = await prisma.experiment.create({
                data: {
                    title: `Eval on ${faker.science.chemicalElement().name}`,
                    projectId: project.id,
                    objective: faker.lorem.sentences(2),
                    method: faker.lorem.sentence(),
                    dataset: "Dataset_v1.csv",
                    status: "COMPLETED",
                    researcherId: faker.helpers.arrayElement([lead.id, member.id])
                }
            })

            // Results
            await prisma.experimentResult.createMany({
                data: [
                    { experimentId: exp.id, metricName: 'Accuracy', metricValue: 92.4, unit: '%' },
                    { experimentId: exp.id, metricName: 'F1 Score', metricValue: 89.1, unit: '%' },
                    { experimentId: exp.id, metricName: 'Loss', metricValue: 0.04 }
                ]
            })

            // Observations
            await prisma.observation.create({
                data: {
                    experimentId: exp.id,
                    content: "Training stabilized after 10 epochs. Recommend early stopping.",
                    authorId: member.id,
                }
            })

            // Reviews
            await prisma.review.create({
                data: {
                    experimentId: exp.id,
                    reviewerId: supervisor.id,
                    status: "APPROVED",
                    comment: "Methodology looks sound. Moving to production.",
                    reviewedAt: new Date()
                }
            })

            // Comments
            await prisma.comment.create({
                data: {
                    projectId: project.id,
                    experimentId: exp.id,
                    content: "Should we run another pass?",
                    authorId: lead.id
                }
            })
        }

        // Findings
        await prisma.finding.create({
            data: {
                title: "Overfitting on Baseline",
                description: "We noted significant deviation during cross-validation.",
                projectId: project.id,
                authorId: member.id
            }
        })

        // Timeline / Activity Logs
        await prisma.activityLog.create({
            data: {
                projectId: project.id,
                action: "created the project",
                actorId: lead.id,
                entityType: "PROJECT",
                entityId: project.id,
                entityTitle: project.title
            }
        })

        // Simulate Notification
        await prisma.notification.create({
            data: {
                userId: member.id,
                type: "GENERAL",
                title: "Welcome to Project",
                message: `You were added to ${project.title}`,
                isRead: false
            }
        })
    }

    console.log('Seeding complete!')
    console.log('Login with: lead@research.edu (password: password123)')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
