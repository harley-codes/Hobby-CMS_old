'use client'

import { PostBlockDynamicEdit } from '@/app/(private)/posts/postBlockEdit'
import { ModalBase } from '@/components'
import { InputSelect } from '@/components/input/inputSelect'
import { PostBlockRecords, PostBlockTypes } from '@/scripts/data/postBlockTypes'
import { PostBlocks } from '@/scripts/modules/database/models/postModel'
import { compareObjectsSame } from '@/scripts/utils/comparer'
import { Add as AddIcon } from '@mui/icons-material'
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

type Props = {
	postBlocks: PostBlocks | undefined
	onRequestSave: (postBlocks: PostBlocks) => void
	onRequestCancel: () => void
}

export function PostBlocksEditModal(props: Props)
{
	const [blocks, setBlocks] = useState(props.postBlocks ?? {})
	const [newBlockType, setNewBlockType] = useState(PostBlockTypes.Span)

	// Reset when props:blocks change.
	useEffect(() =>
	{
		console.log('#', props.postBlocks)
		setBlocks(props.postBlocks ?? {})
		setNewBlockType(PostBlockTypes.Span)
	}, [props.postBlocks])

	const display = typeof props.postBlocks !== 'undefined'

	function hasChanged()
	{
		return (typeof props.postBlocks !== 'undefined')
			? !compareObjectsSame(blocks, props.postBlocks)
			: false
	}

	function blocksAdd()
	{
		function getNewId(maxAttempts: number): string
		{
			const x = self.crypto.randomUUID()
			if (blocks[x] === undefined) return x
			if (maxAttempts >= 0) throw new Error(`Max attempts reached for ${getNewId} method`)
			return getNewId(maxAttempts--)
		}

		const newId = getNewId(10)

		const newBlocks = { ...blocks }
		newBlocks[newId] = {
			'type': newBlockType
		}
		setBlocks(newBlocks)
	}

	return (
		<ModalBase
			fullScreen
			header="Edit Content"
			modalOpen={display}
			body={blocks &&
				<Box mt={2}>
					<Box display="flex">
						<InputSelect
							label='New Block Type' labelId='post-edit-new-block-type'
							value={newBlockType} options={PostBlockRecords}
							onValueChange={(v) => setNewBlockType(v as PostBlockTypes)}
							inputVariant="standard"
						/>
						<Button startIcon={<AddIcon />} onClick={blocksAdd} sx={{ mt: 'auto' }}>Add</Button>
					</Box>
					<Stack gap={3} mt={3}>
						{Object.entries(blocks).map(([blockId, blockData], index) =>
							<Card key={blockId} variant="outlined">
								<CardContent>
									{process.env.NEXT_PUBLIC_SHOW_DEBUG_IDS &&
										<Typography variant='caption'>ID: {blockId}</Typography>
									}
									<PostBlockDynamicEdit
										key={blockId} data={blockData}
										onUpdate={(data) => blocks[blockId] = data}
									/>
								</CardContent>
							</Card>
						)}
					</Stack>
				</Box>
			}
			footer={
				<>
					<Box flex={1}>
						<Button variant="outlined" onClick={props.onRequestCancel}>Cancel</Button>
					</Box>
					<Button color='warning' disabled={!hasChanged()} variant="contained" onClick={() => setBlocks(props.postBlocks ?? {})}>Clear Changes</Button>
					<Button color='success' disabled={!hasChanged()} variant="contained">Save Changes</Button>
				</>
			}
		/>
	)
}
