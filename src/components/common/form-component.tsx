import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Form } from '../ui/form'
import InputField from './input-field'

export default function FormComponent({ form, fields, onSubmit, loading }: any) {
  return (
    <Form {...form}>
      <form
        className="flex w-full flex-1 flex-col justify-center gap-3 text-foreground animate-in"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {fields.map((field: any, index: number) => (
          <InputField key={index} form={form} props={field} />
        ))}

        {!loading ? (
          <Button type="submit">Submit</Button>
        ) : (
          <Button type="button">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
          </Button>
        )}
      </form>
    </Form>
  )
}
