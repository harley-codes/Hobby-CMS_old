import { PostBlockTypes } from '@/scripts/data/postBlockTypes'

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
	return (
		<div>{props.data['type']}</div>
	)
}
