import { client, db } from '@/db'
import { goals } from './schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { goalCompletions } from './schema/goal-completions'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const [goal1, goal2, goal3, goal4] = await db
    .insert(goals)
    .values([
      {
        title: faker.lorem.words(3),
        desiredWeeklyFrequency: 1,
      },
      {
        title: faker.lorem.words(3),
        desiredWeeklyFrequency: 2,
      },
      {
        title: faker.lorem.words(2),
        desiredWeeklyFrequency: 1,
      },
      {
        title: faker.lorem.words(2),
        desiredWeeklyFrequency: 3,
      },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    { goalId: goal1.id, createdAt: startOfWeek.add(7, 'hour').toDate() },
    {
      goalId: goal4.id,
      createdAt: startOfWeek.add(1, 'day').add(9, 'hour').toDate(),
    },
    {
      goalId: goal1.id,
      createdAt: startOfWeek.add(2, 'day').add(8, 'hour').toDate(),
    },
    {
      goalId: goal2.id,
      createdAt: startOfWeek.add(2, 'day').add(14, 'hour').toDate(),
    },
    {
      goalId: goal4.id,
      createdAt: startOfWeek.add(2, 'day').add(12, 'hour').toDate(),
    },
  ])
}

seed().then(() => {
  console.log('🌱 Database seeded successfully!')
  client.end()
})
