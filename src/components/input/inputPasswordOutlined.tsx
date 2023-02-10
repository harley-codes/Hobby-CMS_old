'use client'

import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { ChangeEvent, useState } from 'react';

type PasswordChangeEvent = (value: string) => void;

interface Props
{
	password?: string
	onPasswordChange: PasswordChangeEvent
	inputColor?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
	label?: string
	fullWidth?: boolean
}

export function InputPasswordOutlined(props: Props)
{
	const [showPassword, setShowPassword] = useState(false)

	const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => props.onPasswordChange(event.target.value)

	const onTogglePassword = () => setShowPassword(!showPassword)

	return (
		<FormControl sx={{ mt: 1 }} variant="outlined" fullWidth={props.fullWidth != false}>
			<InputLabel>{props.label || 'Password'}</InputLabel>
			<OutlinedInput
				type={showPassword ? 'text' : 'password'}
				value={props.password}
				onChange={onChangeHandler}
				endAdornment={
					<InputAdornment position="end">
						<IconButton
							onClick={onTogglePassword}
							edge="end"
							sx={{ marginRight: -0.9 }}
						>
							{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
						</IconButton>
					</InputAdornment>
				}
				color={props.inputColor}
				label={props.label || 'Password'}
			/>
		</FormControl>
	)
}
