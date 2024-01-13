import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'

export const Auth = () => {
  return (
    <div>
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
      <Button>Submit</Button>
    </div>
  )
}
