import { PostModel, PostModelDetail, PostStatus } from 'src/scripts/modules/database/models/postModel'
import { ProjectModel, ProjectRecordModel } from 'src/scripts/modules/database/models/projectModel'

export type PostUpdateData = Partial<Omit<PostModel, 'id'>>

export default interface DatabaseService
{
	/** Use dispose to discard any instances after each transaction */
	dispose(): Promise<void>

	projectGetAll(): Promise<ProjectModel[]>

	projectGetRecordsAll(): Promise<ProjectRecordModel[]>

	projectCreate(name: string, active: boolean, token: string): Promise<ProjectModel>

	projectUpdate(id: string, name: string, active: boolean, token: string): Promise<ProjectModel>

	projectDelete(id: string): Promise<boolean>

	postGetById(postId: string): Promise<PostModel | null>

	postGetAll(): Promise<PostModel[]>

	postGetAllDetails(): Promise<PostModelDetail[]>

	postCreate(name: string, projectId: string | null): Promise<PostModelDetail>

	postUpdate(postId: string, data: PostUpdateData): Promise<PostModel>

	postDetailUpdate(postId: string, projectId: string | null, name: string, postStatus: PostStatus): Promise<PostModelDetail>

	postDelete(id: string): Promise<boolean>
}
