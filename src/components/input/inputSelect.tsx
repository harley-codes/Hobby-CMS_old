'use client'

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Enumerable from 'linq'

type ValueChangeEvent = (value: string) => void;

interface Props
{
	label?: string
	value?: string
	onValueChange: ValueChangeEvent
	inputVariant?: 'standard' | 'filled' | 'outlined'
	fullWidth?: boolean
	color?: 'error' | 'primary' | 'secondary' | 'info' | 'success' | 'warning'
	options: string[] | Record<string, string>
	labelId: string
}

export function InputSelect(props: Props)
{
	return (
		<FormControl fullWidth={props.fullWidth != false}>
			<InputLabel id={props.labelId} variant={props.inputVariant}>{props.label}</InputLabel>
			<Select
				labelId={props.labelId}
				variant={props.inputVariant}
				value={props.value ?? ''}
				onChange={(event) => props.onValueChange(event.target.value)}
				sx={{ mt: 1 }}
				color={props.color}
			>
				{Array.isArray(props.options)
					? Enumerable.from(props.options).distinct().toArray().map(x => <MenuItem key={x} value={x}>{x}</MenuItem>)
					: Object.entries(props.options).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)
				}
			</Select>
		</FormControl>
	)
}
