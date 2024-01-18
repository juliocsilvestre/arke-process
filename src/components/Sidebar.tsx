import { Dialog, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { PowerIcon } from '@heroicons/react/24/solid'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { Fragment, ReactNode, useState } from 'react'

import { useSignOutMutation } from '@/api/mutations/auth.mutation'
import { removeUser } from '@/store/auth.store'
import { NAVIGATION } from '@/utils/constants'
import Logo from '../assets/logo-white.png'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function Sidebar({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigate = useNavigate()
  const { latestLocation } = useRouter()

  const { mutateAsync: doLogout } = useSignOutMutation()

  const handleSignOut = async () => {
    await doLogout()
    removeUser()
    await navigate({ to: '/' })
  }

  return (
    <div className="w-full">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary px-6 pb-2">
                  <div className="flex my-10 h-16 shrink-0 items-center  hover:opacity-80">
                    <Link to="/dashboard/eventos">
                      <img className="w-auto" src={Logo} alt="Carvalheira, Criando Memórias" />
                    </Link>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul className="mx-auto space-y-1">
                          {NAVIGATION.map((item) => (
                            <li key={item.name}>
                              <Link
                                to={item.href}
                                activeOptions={{ exact: true }}
                                className={classNames(
                                  '[&.active]:bg-white [&.active]:text-primary [&.active_.icon]:text-primary text-white hover:text-primary hover:bg-white group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                                )}
                              >
                                <item.icon
                                  className={classNames('icon text-white group-hover:text-primary h-6 w-6 shrink-0')}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary px-6">
          <div className="my-10 flex h-16 shrink-0 items-center hover:opacity-80">
            <Link to="/dashboard/eventos">
              <img className="w-auto" src={Logo} alt="Carvalheira, Criando Memórias" />
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-4">
              <li>
                <ul className="mx-auto space-y-1">
                  {NAVIGATION.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        activeOptions={{ exact: true }}
                        className={classNames(
                          '[&.active]:bg-white [&.active]:text-primary [&.active_.icon]:text-primary text-white hover:text-primary hover:bg-white',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                        )}
                      >
                        <item.icon
                          className={classNames('icon text-white group-hover:text-primary', 'h-6 w-6 shrink-0')}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="w-full group -mx-2 flex justify-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-white hover:bg-gray-50 hover:text-primary"
                >
                  <PowerIcon className="h-6 w-6 shrink-0 text-white group-hover:text-primary" aria-hidden="true" />
                  Sair
                </button>
              </li>
              <li className="flex flex-col items-center mb-4">
                <p className="text-[10px] text-white/50">
                  &copy; {new Date().getFullYear()} Init1. Todos os direitos reservados.
                </p>
                <span className="text-[10px] text-white/50">v1.0.0</span>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-primary px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button type="button" className="-m-2.5 p-2.5 text-white lg:hidden" onClick={() => setSidebarOpen(true)}>
          <span className="sr-only">Abrir menu</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        {/* make this dynamic */}
        <div className="flex-1 text-sm font-semibold leading-6 text-white">
          {NAVIGATION.find((n) => n.href === latestLocation.pathname)?.name ?? ''}{' '}
        </div>
      </div>

      {children}
    </div>
  )
}
