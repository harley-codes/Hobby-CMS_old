'use client'

import { InputDate } from '@/components/input/inputDate'
import { InputSelect } from '@/components/input/inputSelect'
import { InputText } from '@/components/input/inputText'
import { PostModelDetail, PostStatusOptions } from '@/scripts/modules/database/models/postModel'
import { ProjectRecordModel } from '@/scripts/modules/database/models/projectModel'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Stack, Tooltip, Typography } from '@mui/material'
import { PostStatus } from '@prisma/client'
import { SyntheticEvent } from 'react'

type Props = {
	postName: string
	postDetails: PostModelDetail | undefined
	projectRecords: ProjectRecordModel[]
	onDataChange: (postData: PostModelDetail) => void
	onExpandChange: (expanded: boolean) => void
	onSave: () => void
	onCancel: () => void
	onDelete: () => void
	hasChanged: boolean
}

export function PostsListItem(props: Props)
{
	const post = props.postDetails

	function updateDataHandler(data: Partial<PostModelDetail>)
	{
		if (!post) return
		props.onDataChange({ ...post, ...data })
	}

	function onExpandChangeHandler(_: SyntheticEvent<Element, Event>, expanded: boolean)
	{
		props.onExpandChange(expanded)
	}

	return (
		<Accordion expanded={post && true || false} onChange={onExpandChangeHandler}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />} >
				<Typography variant="h6">{props.postName}</Typography>
			</AccordionSummary>
			<AccordionDetails>
				{post && (
					<Stack spacing={4}>
						<InputText
							label="Post Name"
							value={post.name}
							onValueChange={(value) => updateDataHandler({ name: value })}
							inputVariant="standard"
						/>
						<InputSelect
							label='Project'
							labelId='edit-post-project'
							inputVariant='standard'
							value={post.idProject ?? undefined}
							onValueChange={
								(v) => updateDataHandler({ idProject: v })
							}
							options={
								Object.fromEntries(props.projectRecords.map(x => [x.id, x.name]))
							}
						/>
						<Stack spacing={4} direction="row">
							<InputSelect
								label='Status'
								labelId='edit-post-status'
								inputVariant='standard'
								value={post.status}
								onValueChange={
									(v) => updateDataHandler({ status: v as PostStatus })
								}
								options={[
									PostStatusOptions.ACTIVE,
									PostStatusOptions.DISABLED,
									PostStatusOptions.HIDDEN,
								]}
							/>
							<InputDate
								label='Publish Date'
								value={post.date}
								inputVariant='standard'
								onValueChange={
									(v) => updateDataHandler({ date: v })
								}
							/>
						</Stack>
					</Stack>
				)}
			</AccordionDetails>
			<AccordionActions>
				<Stack direction="row" gap={1} padding={1} flexGrow={1}>
					{/* <Button color='success' variant="contained" onClick={props.onSave}>Edit Content</Button> */}
					<Tooltip title="Double Click to Delete" arrow>
						<Button
							color="warning" variant="outlined"
							onDoubleClick={props.onDelete}
						>Delete</Button>
					</Tooltip>
					{props.hasChanged &&
						<Button
							variant="contained"
							onClick={props.onCancel}
						>Reset</Button>
					}
					<Box flexGrow={1} />
					<Tooltip title={!props.hasChanged ? 'Make changes to save' : ''} arrow>
						<span>
							<Button
								color="success" variant="contained"
								disabled={!props.hasChanged}
								onClick={props.onSave}
							>Save</Button>
						</span>
					</Tooltip>
				</Stack>
			</AccordionActions>
		</Accordion >
	)
}
