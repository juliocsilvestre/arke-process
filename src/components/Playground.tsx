import { Button } from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import { Label } from '@components/ui/Label'

import { TrashIcon } from '@heroicons/react/24/solid'

export const Playground = () => {
  return (
    <div className="w-[300px] py-8 px-4 rounded-lg bg-white flex flex-col">
      <Label htmlFor="email" label="Email" />
      <Input type="email" id="email" placeholder="Email" />
      <Label htmlFor="password" label="Password" />
      <Input type="password" id="password" placeholder="••••••••••" />
      <Button variant={'default'} size={'sm'}>
        <TrashIcon className="w-4 h-4" />
        Delete
      </Button>
    </div>
  )
}
