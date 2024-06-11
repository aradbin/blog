import { CalendarIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

export default function InputField({ props }: any) {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => (
        <>
          {!props.hide && (
            <FormItem>
              <FormLabel>{props.label}</FormLabel>
              {(() => {
                switch (props.type) {
                  case 'select':
                    return (
                      <Select onValueChange={props.onChangeHandler || field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={props.placeholder || props.label} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {props.options?.map((item: any, index: number) => (
                            <SelectItem key={index} value={item?.value}>
                              {item?.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )
                  case 'date':
                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={`w-full pl-3 text-left font-normal ${!field.value && 'text-muted-foreground'}`}
                            >
                              {field.value ? field.value.toLocaleDateString() : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                        </PopoverContent>
                      </Popover>
                    )
                  default:
                    return (
                      <FormControl>
                        <Input type={props.type || 'text'} placeholder={props.placeholder || props.label} {...field} />
                      </FormControl>
                    )
                }
              })()}
              <FormMessage />
            </FormItem>
          )}
        </>
      )}
    />
  )
}
