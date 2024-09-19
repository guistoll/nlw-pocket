import { Plus } from 'lucide-react'
import { DialogTrigger } from '@radix-ui/react-dialog'

import logo from '../assets/in-orbit-logo.svg'
import rocketLaunchIllustration from '../assets/rocket-launch-illustration.svg'
import { Button } from './ui/button'

export function EmptyGoals() {
  return (
    <main className="h-screen flex flex-col items-center justify-center gap-8">
      <img src={logo} alt="in.orbit" />

      <img
        src={rocketLaunchIllustration}
        alt="Illustration of a woman controlling the launch of a rocket through a remote control"
      />

      <p className="text-zinc-300 leading-relaxed max-w-80 text-center">
        You haven’t registered any goals yet. How about registering one right
        now?
      </p>

      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Register goal
        </Button>
      </DialogTrigger>
    </main>
  )
}
