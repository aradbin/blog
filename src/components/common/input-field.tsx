import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { useState } from 'react'

export default function InputField({ props }: any) {
  const [open, setOpen] = useState(false)
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
                  case 'searchable-select':
                    return (
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={`w-full justify-between pl-3 text-left font-normal ${
                                !field.value && 'text-muted-foreground'
                              }`}
                            >
                              {field.value || props.placeholder || props.label}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search language..." />
                            <CommandList>
                              <CommandEmpty>No item found</CommandEmpty>
                              <CommandGroup>
                                {props.options?.map((item: any, index: number) => (
                                  <CommandItem
                                    key={index}
                                    value={item?.value}
                                    onSelect={() => {
                                      props.form.setValue(props.name, item?.value)
                                      setOpen(false)
                                    }}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${
                                        field.value === item?.value ? 'opacity-100' : 'opacity-0'
                                      }`}
                                    />
                                    {item?.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
