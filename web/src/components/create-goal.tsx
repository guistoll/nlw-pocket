import { X } from 'lucide-react'
import { Button } from './ui/button'
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from './ui/radio-group'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createGoal } from '../http/create-goal'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

const createGoalSchema = z.object({
  title: z.string().min(1, 'Informe a atividade que deseja praticar'),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
})

type CreateGoalSchema = z.infer<typeof createGoalSchema>

export function CreateGoal() {
  const queryClient = useQueryClient()

  const desiredWeeklyFrequencyIcon = ['🥱', '🙂', '😎', '😜', '🤨', '🤯', '🔥']

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateGoalSchema>({
    resolver: zodResolver(createGoalSchema),
  })

  async function handleCreateGoal({
    title,
    desiredWeeklyFrequency,
  }: CreateGoalSchema) {
    try {
      await createGoal({
        title,
        desiredWeeklyFrequency,
      })

      reset()

      queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })

      toast.success('Goal created successfully!')
    } catch {
      toast.error('Failed to create goal. Please try again.')
    }
  }

  return (
    <DialogContent>
      <div className="flex flex-col gap-6 h-full">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle>Register goal</DialogTitle>

            <DialogClose>
              <X className="size-5 text-zinc-600" />
            </DialogClose>
          </div>

          <DialogDescription>
            Add activities that are good for you and that you want to continue
            practicing every week.
          </DialogDescription>
        </div>

        <form
          onSubmit={handleSubmit(handleCreateGoal)}
          className="flex-1 flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">What is the activity?</Label>

              <Input
                id="title"
                autoFocus
                placeholder="Practice exercises, meditate, etc…"
                {...register('title')}
              />

              {errors.title && (
                <p className="text-sm text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="desiredWeeklyFrequency">
                How many times a week?
              </Label>

              <Controller
                control={control}
                name="desiredWeeklyFrequency"
                defaultValue={3}
                render={({ field }) => {
                  return (
                    <RadioGroup
                      value={String(field.value)}
                      onValueChange={field.onChange}
                    >
                      {Array.from({ length: 7 }).map((_, i) => {
                        const frequency = String(i + 1)

                        return (
                          <RadioGroupItem key={i} value={frequency}>
                            <RadioGroupIndicator />
                            <span className="text-zinc-300 text-sm font-medium leading-none">
                              {Number(frequency) < 7 ? (
                                <span>{frequency} x in week</span>
                              ) : (
                                <span>Every day of the week</span>
                              )}
                            </span>
                            <span className="text-lg leading-none">
                              {
                                desiredWeeklyFrequencyIcon[
                                  Number(frequency) - 1
                                ]
                              }
                            </span>
                          </RadioGroupItem>
                        )
                      })}
                    </RadioGroup>
                  )
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-auto">
            <DialogClose asChild>
              <Button variant="secondary" className="flex-1">
                Close
              </Button>
            </DialogClose>

            <Button type="submit" className="flex-1">
              Save
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  )
}
