import { CheckCircle2, Plus } from 'lucide-react'
import { InOrbitIcon } from './in-orbit-icon'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Button } from './ui/button'
import { Progress, ProgressIndicator } from './ui/progress-bar'
import { Separator } from './ui/separator'
import type { GetSummaryResponse } from '../http/get-summary'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-BR'
import { PendingGoals } from './pending-goals'
import { deleteGoalCompletion } from '../http/delete-goal-completion'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

dayjs.locale(ptBR)

interface WeeklySummaryProps {
  summary: GetSummaryResponse['summary']
}

export function WeeklySummary({ summary }: WeeklySummaryProps) {
  const queryClient = useQueryClient()

  const fromDate = dayjs().startOf('week').format('D[ de ]MMM')
  const toDate = dayjs().endOf('week').format('D[ de ]MMM')
  const galsPerDaySummary = summary.goalsPerDay || []

  const completedPercentage = Math.round(
    (summary.completed * 100) / summary.total
  )

  async function handleDeleteGoalCompletion(goalId: string) {
    try {
      await deleteGoalCompletion({ goalId })

      queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })

      toast.success('Meta removida com sucesso!')
    } catch {
      toast.error('Erro ao desfazer meta!')
    }
  }

  return (
    <main className="max-w-[540px] py-10 px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InOrbitIcon />
          <span className="text-lg font-semibold">
            {fromDate} - {toDate}
          </span>
        </div>

        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Cadastrar meta
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress value={summary.completed} max={summary.total}>
          <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
        </Progress>

        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Você completou{' '}
            <span className="text-zinc-100">{summary.completed}</span> de{' '}
            <span className="text-zinc-100">{summary.total}</span> metas nessa
            semana.
          </span>
          <span>{completedPercentage}%</span>
        </div>
      </div>

      <Separator />

      <PendingGoals />

      <div className="space-y-6">
        <h2 className="text-xl font-medium">Sua semana</h2>

        {Object.entries(galsPerDaySummary).map(([date, goals]) => {
          const weekDay = dayjs(date).format('dddd')
          const parsedDate = dayjs(date).format('D[ de ]MMM')

          return (
            <div className="space-y-4" key={date}>
              <h3 className="font-medium capitalize">
                {weekDay}{' '}
                <span className="text-zinc-400 text-xs">({parsedDate})</span>
              </h3>

              <ul className="space-y-3">
                {goals.map(goal => {
                  const parsedTime = dayjs(goal.createdAt).format('HH:mm[h]')

                  return (
                    <li className="flex items-center gap-2" key={goal.id}>
                      <CheckCircle2 className="size-4 text-pink-500" />
                      <span className="text-sm text-zinc-400">
                        Você completou "
                        <span className="text-zinc-100">{goal.title}</span>" às{' '}
                        <span className="text-zinc-100">{parsedTime}</span>
                        <button
                          className="text-zinc-500 text-xs underline underline-offset-2 ml-2"
                          onClick={() => handleDeleteGoalCompletion(goal.id)}
                          type="button"
                        >
                          Desfazer
                        </button>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </main>
  )
}
