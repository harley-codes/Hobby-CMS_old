'use client'

import { ModalBase } from '@/components/modals/modalBase'

import { Breakpoint, Button } from '@mui/material'

export interface Props
{
	modelOpen: boolean
	title?: string
	message: string
	onModalClose: () => void
	size?: Breakpoint
}

export const ModalNotification = (props: Props) =>
{
	return (
		<ModalBase modalOpen={props.modelOpen}
			header={props.title}
			body={props.message}
			footer={
				<Button onClick={props.onModalClose}>Close</Button>
			}
			size={props.size ?? 'xs'}
		/>
	)
}
