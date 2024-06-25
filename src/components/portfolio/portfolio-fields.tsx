import { transactionTypes } from '@/helpers/variables'
import { z } from 'zod'

export const portfolioDefaultValues = {
  user_id: '',
  name: '',
}

export const portfolioSchema = z.object({
  user_id: z.string(),
  name: z.string().min(1, { message: 'Name is required' }),
})

export const portfolioFields = [
  {
    name: 'name',
    label: 'Portfolio Name',
  },
]

export const portfolioTransactionDefaultValues = {
  portfolio_id: '',
  type: '',
  instrument: '',
  quantity: '1',
  amount: '1',
  charge: '0',
  commission: '0',
  tax: '0',
  date: new Date(),
}

export const portfolioTransactionSchema = z.object({
  portfolio_id: z.string(),
  type: z.string().min(1, { message: 'Type is required' }),
  instrument: z.string().optional(),
  quantity: z.string().optional(),
  amount: z.string().optional(),
  charge: z.string().optional(),
  commission: z.string().optional(),
  tax: z.string().optional(),
  date: z.date().optional(),
})

export const portfolioTransactionFields = (form: any, instrumentOptions: any, portfolioinstrumentOptions: any) => {
  return [
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      options: transactionTypes,
      placeholder: 'Select Transaction Type',
      onChangeHandler: (value: any) => {
        form.setValue('type', value)
        if (value === 'deposit' || value === 'withdrawal') {
          form.setValue('instrument', 'CASH')
          form.setValue('quantity', '1')
        } else {
          form.setValue('instrument', '')
        }
      },
    },
    {
      name: 'instrument',
      label: 'Instrument',
      type: 'searchable-select',
      options: form.watch().type === 'buy' ? instrumentOptions : portfolioinstrumentOptions,
      placeholder: 'Select Instrument',
      hide: form.watch().type === '' || form.watch().type === 'deposit' || form.watch().type === 'withdrawal',
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      hide: form.watch().type === '' || form.watch().type === 'deposit' || form.watch().type === 'withdrawal',
    },
    {
      name: 'amount',
      label: form.watch().type === 'buy' || form.watch().type === 'sell' ? 'Price per unit' : 'Amount',
      type: 'number',
    },
    {
      name: 'charge',
      label: 'Charge',
      type: 'number',
      hide: form.watch().type !== 'deposit' && form.watch().type !== 'withdrawal',
    },
    {
      name: 'commission',
      label: 'Commission',
      type: 'number',
      hide: form.watch().type !== 'buy' && form.watch().type !== 'sell',
    },
    {
      name: 'tax',
      label: 'Tax',
      type: 'number',
      hide: form.watch().type !== 'dividend',
    },
    { name: 'date', label: 'Date', type: 'date' },
  ]
}
