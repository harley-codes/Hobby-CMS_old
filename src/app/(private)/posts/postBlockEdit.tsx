import { InputText } from '@/components'
import { PostBlockTypes } from '@/scripts/data/postBlockTypes'
import { Typography } from '@mui/material'

type Props = {
	data: Record<string, string>
	onUpdate: (data: Record<string, string>) => void
}

type EditVewProps = Pick<Props, 'data' | 'onUpdate'>

export function PostBlockDynamicEdit({ data, onUpdate }: Props)
{
	switch (data['type'])
	{
		case PostBlockTypes.Span:
			return <EditViewSpan data={data} onUpdate={onUpdate} />
		default:
			return <div></div>
	}
}

function EditViewSpan(props: EditVewProps)
{
	function updateValueHandler(value: string)
	{
		props.data['value'] = value
		props.onUpdate(props.data)
	}

	return (
		<div>
			<Typography>Plain Text</Typography>
			<InputText value={props.data['value']} onValueChange={(v) => updateValueHandler(v)} size='small' />
		</div>
	)
}
