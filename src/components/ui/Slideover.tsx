import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { Fragment, ReactNode, useEffect, useRef, useState } from 'react'

export interface SlideOverProps {
  isOpen: boolean
  children: ReactNode
  title: string
  subtitle?: string
  close: () => void
}

export const SlideOver = ({ title, subtitle, isOpen, children, close }: SlideOverProps): JSX.Element => {
  const [headerHeight, setHeaderHeight] = useState(0)

  const headerRef = useRef<HTMLDivElement | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.clientHeight)
    }
  }, [isOpen, headerRef])

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={close}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md h-full shadow-md">
                  <div ref={headerRef} className="bg-primary px-4 py-6 sm:px-6 h-[112px]">
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-lg font-semibold leading-6 text-white">{title}</Dialog.Title>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className="relative rounded-md bg-transparent text-white hover:opacity-50 focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => close()}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Fechar modal</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-1">
                      <p className="text-xs text-white/60">{subtitle}</p>
                    </div>
                  </div>
                  <div
                    className="bg-white h-full"
                    style={{
                      height: 'calc(100% - 112px)',
                    }}
                  >
                    {children}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export const SlideOverFooter = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <div className="flex flex-shrink-0 justify-end py-4 bg-white border-t-[1px] border-solid border-gray-100">
      {children}
    </div>
  )
}
