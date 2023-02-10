import { PostModel, PostModelDetail } from 'src/scripts/modules/database/models/postModel'
import { ProjectModel, ProjectRecordModel } from 'src/scripts/modules/database/models/projectModel'

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

	postGetAllDetails(): Promise<PostModelDetail[]>
}
