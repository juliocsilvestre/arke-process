import { Input } from '@/components/ui/Input'
import { Link, useParams } from '@tanstack/react-router'
import Loader from 'react-spinners/BeatLoader'
import { useEffect, useRef } from 'react'
import { useClockWorkerOnEventDay } from '@/api/mutations/events.mutation'
import { checkError } from '@/utils/errors'
import { toast } from 'sonner'
import { ENTRY_NAMES, Entry } from './Clock.defs'
import { cn } from '@/utils/styles'
import { useSingleEvent } from '@/api/queries/events.query'
import { EventDay } from './Events.defs'
import { ArrowLeftIcon } from 'lucide-react'

export const ClockPage = (): JSX.Element => {
  const { id, day } = useParams({ from: '/dashboard-layout/dashboard/eventos/$id/dias/$day/relogio' })
  const clockInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    clockInputRef.current?.focus()
  })

  const { event } = useSingleEvent(id)

  const dayNumber = event.data?.data.days.findIndex((d: EventDay) => d.id === day) + 1 ?? 0

  const { mutateAsync: clockWorker } = useClockWorkerOnEventDay()

  const handleClock = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      if (clockInputRef.current?.value) {
        const entry = await clockWorker({ event_day_id: day, worker_id: clockInputRef.current?.value })

        // clear input and focus again
        clockInputRef.current.value = ''
        clockInputRef.current.focus()

        // save to local storage an array of entries by event day id
        const entries = localStorage.getItem(`entries-${day}`)

        if (entries) {
          const parsedEntries = JSON.parse(entries)
          parsedEntries.unshift(entry.data)
          localStorage.setItem(`entries-${day}`, JSON.stringify(parsedEntries))
        } else {
          localStorage.setItem(`entries-${day}`, JSON.stringify([entry.data]))
        }
      } else {
        throw new Error('Campo vazio')
      }
    } catch (error) {
      const errors = checkError<'event_day_id' | 'worker_id'>(error)
      if (Array.isArray(errors) && errors.length > 0) {
        for (const e of errors) {
          toast.error(
            <p>
              Alguma coisa deu errado com o campo <strong>{e.field}</strong>: <strong>{e.message}</strong>
            </p>,
          )
        }
      } else if (typeof errors === 'string') {
        toast.error(errors)
      }

      // clear input and focus again
      if (clockInputRef.current) {
        clockInputRef.current.value = ''
        clockInputRef.current.focus()
      }
    }
  }

  const entries = localStorage.getItem(`entries-${day}`)
  const parsedEntries = JSON.parse(entries || '[]')

  return (
    <section className="bg-gray-50 min-h-screen overflow-y-auto p-4 md:p-10">
      <Link
        to="/dashboard/eventos/$id"
        params={{ id }}
        className="flex items-center gap-2 mb-10 text-primary-500 hover:underline"
      >
        <ArrowLeftIcon className="w-6 h-6 text-primary-600" />
        Voltar para o evento
      </Link>

      <div className="mx-auto flex flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-4xl text-primary font-bold">
          Registro de presença - {event.data?.data.name} - Dia {!Number.isNaN(dayNumber) && dayNumber}
        </h1>
      </div>

      <div className="mt-[10%]">
        <form className="mx-auto w-[50%] h-[200px] flex items-center justify-center w-[50%]" onSubmit={handleClock}>
          <Input ref={clockInputRef} />
        </form>

        <section className="w-[50%] mx-auto h-full max-h-[400px] overflow-y-auto bg-white rounded-lg shadow-lg border border-solid border-gray-200">
          <ul className="flex flex-col ">
            <li className="p-4 flex items-center justify-center">
              <Loader color="#561768" />
            </li>

            {parsedEntries?.map((entry: Entry) => (
              <li
                className={cn(
                  'flex pb-2 gap-5 items-center border-b border-solid p-4',
                  entry.type === 'in' ? 'border-success-100 bg-success-50' : ' border-error-100 bg-error-50',
                )}
              >
                <div className="flex flex-col justify-center items-center w-fit gap-1">
                  <span
                    className={cn(
                      'block rounded-full w-3 h-3  shadow-md',
                      entry.type === 'in' ? 'bg-success-500' : 'bg-error-500',
                    )}
                  />
                  <span className={cn('text-xs', entry.type === 'in' ? 'text-success-500' : 'text-error-500')}>
                    {new Date(entry.entry_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600">{entry.name}</span>
                  <span className={cn('text-sm', entry.type === 'in' ? 'text-success-500' : 'text-error-500')}>
                    {ENTRY_NAMES[entry.type]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  )
}
