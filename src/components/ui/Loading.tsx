import PulseLoader from 'react-spinners/PulseLoader'

export const Loading = (): JSX.Element => {
  return (
    <div className="h-svh w-full flex items-center justify-center">
      <PulseLoader color="#9b2abc" />
    </div>
  )
}
