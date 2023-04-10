import { InputText, ModalBase } from '@/components'
import { InputSelect } from '@/components/input/inputSelect'
import { ProjectRecordModel } from '@/scripts/modules/database/models/projectModel'
import { Button, DialogContentText } from '@mui/material'
import { useEffect, useState } from 'react'

type Props = {
	showModel: boolean
	projectRecords: ProjectRecordModel[]
	onCancel: () => void
	onCreate: (postName: string, projectId: string | undefined) => void
}

const newPostTemplate = { name: '', projectId: undefined as string | undefined }

export function PostCreateModal(props: Props)
{
	const [details, setDetails] = useState(newPostTemplate)

	useEffect(() =>
	{
		setDetails(newPostTemplate)
	}, [props.showModel])

	return (
		<ModalBase
			header='New Post'
			modalOpen={props.showModel}
			size="sm"
			body={<>
				<DialogContentText marginBottom={3}>Select a name and project, all other values will bet auto generated.</DialogContentText>
				<InputSelect
					label='Project'
					labelId='new-post-project-select'
					inputVariant='standard'
					value={details.projectId}
					onValueChange={
						(v) => setDetails({ ...details, projectId: v })
					}
					options={
						Object.fromEntries(props.projectRecords.map(x => [x.id, x.name]))
					}
				/>
				<InputText
					label='Post Name'
					inputVariant='standard'
					value={details.name}
					onValueChange={(v) => setDetails({ ...details, name: v })}
					sx={{ mt: 2 }}
				/>
			</>}
			footer={<>
				<Button onClick={props.onCancel}>Cancel</Button>
				<Button onClick={() => props.onCreate(details.name, details.projectId)} disabled={details.name.length === 0}>Submit</Button>
			</>}
		/>
	)
}
