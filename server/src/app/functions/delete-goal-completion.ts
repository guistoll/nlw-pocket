import { db } from '@/db'
import { goalCompletions } from '@/db/schema'
import { eq } from 'drizzle-orm'

interface DeleteGoalCompletionRequest {
  id: string
}

export async function deleteGoalCompletion({
  id,
}: DeleteGoalCompletionRequest) {
  try {
    const result = await db
      .delete(goalCompletions)
      .where(eq(goalCompletions.id, id))
      .returning()

    if (result.length === 0) {
      return { success: false, message: 'Goal completion not found.' }
    }

    return { success: true, message: 'Goal completion deleted successfully.' }
  } catch (error) {
    console.error('Error deleting goal completion:', error)
    return {
      success: false,
      message: 'An error occurred while deleting the goal completion.',
    }
  }
}
