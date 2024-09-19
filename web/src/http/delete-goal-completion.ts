export interface DeleteGoalRequest {
  goalId: string
}

export async function deleteGoalCompletion({ goalId }: DeleteGoalRequest) {
  const response = await fetch(`http://localhost:3333/completions/${goalId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error while deleting the goal completion')
  }
}
