import { db } from '@/db'
import { goalCompletions } from '@/db/schema'
import { eq } from 'drizzle-orm'

interface DeleteGoalCompletionRequest {
  id: string
}

export async function deleteGoalCompletion({
  id,
}: DeleteGoalCompletionRequest) {
  const deletedGoalCompletion = await db
    .delete(goalCompletions)
    .where(eq(goalCompletions.id, id))
    .returning()

  return deletedGoalCompletion.length
}
