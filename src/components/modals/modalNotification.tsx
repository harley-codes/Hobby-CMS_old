'use client'

import { ModalBase } from '@/components/modals/modalBase'

import { Button } from '@mui/material'

export interface Props
{
	modelOpen: boolean
	title?: string
	message: string
	onModalClose: () => void
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
		/>
	)
}
