import { useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'

export default function Modal({ show, toggleShow, title, btn, children }: any) {
  const buttonRef = useRef<any>(null)

  useEffect(() => {
    if (!show) {
      buttonRef?.current?.click()
      toggleShow(true)
    }
  }, [show])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" ref={buttonRef}>
          {btn}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-72 w-11/12 sm:w-full sm:max-w-sm md:max-w-md lg:max-w-lg">
        <DialogHeader className="items-center">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
