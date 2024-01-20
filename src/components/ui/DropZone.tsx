import { UploadFileProps } from '@/pages/Workers.page'
import Dropzone from 'dropzone'
import { useEffect, useRef, useState } from 'react'
import { Button } from './Button'
import { Input } from './Input'

export const DropZone = ({ readFile }: { readFile: (props: UploadFileProps) => void }): JSX.Element => {
  const [dropzone, setDropzone] = useState<Dropzone | null>(null)
  const [file, setFile] = useState<File | null>(null)
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    Dropzone.autoDiscover = true
    const myDropzone = new Dropzone('.dropzone', {
      url: '/target',
      paramName: 'file', // The name that will be used to transfer the file
      maxFilesize: 4, // MB
      maxFiles: 1,
      maxfilesexceeded: (file) => {
        myDropzone.removeAllFiles()
        setFile(null)
        if (fileInputRef.current) (fileInputRef.current as HTMLInputElement).value = ''
        myDropzone.addFile(file)
      },
      acceptedFiles: '.xlsx',
      autoProcessQueue: false,
      dictDefaultMessage: '',
      dictFallbackMessage: 'Seu navegador não suporta upload de arquivos arrastando e soltando.',
      dictFileTooBig: 'O arquivo é muito grande ({{filesize}}MiB). Tamanho máximo: {{maxFilesize}}MiB.',
      dictInvalidFileType: 'Você não pode enviar arquivos desse tipo.',
      dictResponseError: 'O servidor respondeu com o código {{statusCode}}.',
      dictCancelUpload: 'Cancelar upload',
      dictCancelUploadConfirmation: 'Tem certeza de que deseja cancelar este upload?',
      dictRemoveFile: 'Remover arquivo',
      dictMaxFilesExceeded: 'Você não pode enviar mais arquivos.',
    })

    myDropzone.on('addedfile', () => {
      readFile({ f: myDropzone.files[0] })
      setFile(myDropzone.files[0])
    })

    myDropzone.on('removedfile', () => {
      setFile(null)
    })

    setDropzone(myDropzone)

    return () => {
      myDropzone.destroy()
    }
  }, [])

  const fileInputRef = useRef(null)

  return (
    <>
      <form
        action="/target"
        className="dropzone flex flex-col items-start justify-center w-full [&_.dz-details]:flex [&_.dz-details]:flex-row-reverse [&_.dz-details]:w-full [&_.dz-preview]:w-full  [&_.dz-details]:justify-between [&_.dz-size]:text-primary-700 [&_.dz-filename]:text-primary-700"
      >
        {/* <Label htmlFor="dropzone-file" label="Importar de uma planilha" className="mb-2" /> */}
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg
              className="w-10 h-10 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">planilhas do tipo XLSX.</p>
          </div>

          {/* <input id="dropzone-file" type="file" className="hidden" /> */}
          <Input
            ref={fileInputRef}
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={(event) => {
              dropzone?.addFile(event.target.files?.[0] as Dropzone.DropzoneFile)
            }}
          />
        </label>
      </form>
      {file ? (
        <Button
          variant={'destructive'}
          onClick={() => {
            dropzone?.removeAllFiles()
            setFile(null)
            if (fileInputRef.current) (fileInputRef.current as HTMLInputElement).value = ''
            dropzone?.removeFile(file as Dropzone.DropzoneFile)
          }}
          className="mt-[-90px]"
        >
          Remover arquivo
        </Button>
      ) : null}
    </>
  )
}
