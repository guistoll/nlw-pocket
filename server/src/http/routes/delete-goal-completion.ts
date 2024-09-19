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
    async (request, reply) => {
      const { id } = request.params

      try {
        const deletedGoalId = await deleteGoalCompletion({ id })

        if (!deletedGoalId) {
          return reply
            .status(404)
            .send({ success: false, message: 'Goal completion not found' })
        }

        return reply.status(200).send({
          success: true,
          message: 'Goal completion deleted successfully',
        })
      } catch (error) {
        return reply
          .status(500)
          .send({ success: false, message: 'Internal server error' })
      }
    }
  )
}
