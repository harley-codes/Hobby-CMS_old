export enum PostBlockTypes {
	Span = 'span'
}

export const PostBlockRecords: Readonly<Record<PostBlockTypes, string>> = {
	[PostBlockTypes.Span]: 'Span'
}
