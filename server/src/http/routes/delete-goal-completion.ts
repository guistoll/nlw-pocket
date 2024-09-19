import { deleteGoalCompletion } from '@/app/functions/delete-goal-completion'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const deleteGoalCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/completions/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async request => {
      const { id } = request.params

      const deletedGoalId = await deleteGoalCompletion({ id })

      return deletedGoalId
    }
  )
}
