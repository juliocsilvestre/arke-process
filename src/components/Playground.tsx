import { SIZE } from '@/utils/constants'
import { Input } from '@/components/ui/Input'
import { Label } from './ui/Label'

export const Playground = () => {
  return (
    <div className="p-12 rounded-lg bg-white flex flex-col">
      <Label htmlFor="email" label="Email" isRequired />
      <Input type="email" id="email" placeholder="Email" />
      {/* <Input type="password" id="password" placeholder="Password" size="xl" /> */}
      {/* <Button>Submit</Button> */}
    </div>
  )
}
