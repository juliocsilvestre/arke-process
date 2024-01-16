import { Button } from '@/components/ui/Button'
import NotFoundImg from '../assets/404-error.png'
import { Link } from '@tanstack/react-router'
import { Footer } from '@/components/Footer'

export const NotFoundPage = () => {
  return (
    <div className="fixed flex flex-col items-center justify-center w-screen h-screen gap-7 bg-primary p-6 md:p-[1.875rem]">
      <div className="flex flex-col items-center justify-center gap-1">
        <h1 className="text-white text-5xl font-bold">OOPS!</h1>
        <p className="text-white text-xl">Página não encontrada</p>
      </div>
      <div className="sm:max-w-[400px] 2xl:max-w-[800px]">
        <img src={NotFoundImg} className="w-auto" alt="404 - Página não encontrada" />
      </div>
      <Button size="sm" className="bg-white text-primary hover:bg-primary-600 hover:text-white">
        <Link to="/dashboard">Voltar para o Dashboard</Link>
      </Button>
      <Footer className="bg-primary text-white" />
    </div>
  )
}
