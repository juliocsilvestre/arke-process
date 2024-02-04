import PulseLoader from 'react-spinners/PulseLoader'

interface LoadingProps {
  className?: string
}

export const Loading = ({ className }: LoadingProps): JSX.Element => {
  return (
    <div className={`h-svh w-full flex items-center justify-center ${className}`}>
      <PulseLoader color="#9b2abc" />
    </div>
  )
}
