'use client'

import { SxProps, TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import fromUnixTime from 'date-fns/fromUnixTime'
import getUnixTime from 'date-fns/getUnixTime'

type ValueChangeEvent = (value: number) => void;

interface Props
{
	label?: string
	value: number
	onValueChange: ValueChangeEvent
	inputVariant?: 'standard' | 'filled' | 'outlined'
	fullWidth?: boolean
	color?: 'error' | 'primary' | 'secondary' | 'info' | 'success' | 'warning'
	sx?: SxProps
}

export function InputDate(props: Props)
{
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<DatePicker
				label={props.label}
				inputFormat={process.env.NEXT_PUBLIC_DATE_FORMAT}
				value={fromUnixTime(props.value)}
				onChange={(newValue) => props.onValueChange(getUnixTime(newValue ?? new Date()))}
				renderInput={(params) =>
					<TextField {...params}
						variant={props.inputVariant}
						sx={props.sx}
						fullWidth={props.fullWidth != false}
						color={props.color}
					/>
				}
			/>
		</LocalizationProvider>
	)
}

// 	<TextField

// 		label={props.label}
// 		variant={props.inputVariant}
// 		value={props.value}
// 		onChange={(event) => props.onValueChange(event.target.value)}
// 		sx={{ mt: 1, ...props.sx }}
// 		fullWidth={props.fullWidth != false}
// 		color={props.color}
// 	/>
// )
