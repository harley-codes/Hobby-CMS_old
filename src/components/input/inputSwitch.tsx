'use client'

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { ChangeEvent } from 'react';

type InputSwitchChangeEvent = (checked: boolean) => void;

interface Props
{
	label?: string
	checked?: boolean
	onChange: InputSwitchChangeEvent
	color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default'
}

export function InputSwitch(props: Props)
{
	const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => props.onChange(event.target.checked)

	return (
		<FormControlLabel
			label={props.label}
			control={
				<Switch checked={props.checked} color={props.color} onChange={onChangeHandler} />
			}
		/>
	)
}
