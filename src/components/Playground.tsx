import { SIZE } from '@/utils/constants'
import { Input } from '@components/ui/input'

export const Playground = () => {
  return (
    <div className="p-12 rounded-lg bg-white flex flex-col gap-4">
      {/* <Label htmlFor="email">Email</Label> */}
      <Input type="email" id="email" placeholder="Email" size={SIZE.sm}/>
      <Input type="password" id="password" placeholder="Password" size="xl" />
      {/* <Button>Submit</Button> */}
    </div>
  )
}
