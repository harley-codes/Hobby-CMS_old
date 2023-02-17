'use client'

import { Breakpoint, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

interface Props
{
	header?: any
	body?: any
	footer?: any
	modalOpen: boolean
	onHideModal?: () => void
	static?: boolean
	size?: Breakpoint
	fullScreen?: boolean
}

export function ModalBase(props: Props)
{
	const onCloseHandler = () =>
	{
		if (props.static == false)
		{
			props.onHideModal && props.onHideModal()
		}
	}

	return (
		<Dialog
			open={props.modalOpen} onClose={onCloseHandler}
			maxWidth={props.size}
			fullWidth={props.size != null || typeof props.size !== 'undefined'}
			fullScreen={props.fullScreen}
			sx={(props.fullScreen ? { margin: 3 } : {})}
		>
			<DialogTitle>{props.header}</DialogTitle>
			<DialogContent>{props.body}</DialogContent>
			<DialogActions>{props.footer}</DialogActions>
		</Dialog>
	)
}
