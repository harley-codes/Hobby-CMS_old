'use client'

import { ProjectModel } from '@/scripts/modules/database/models/projectModel'

import { InputPasswordOutlined, InputSwitch, InputText, ModalLoading, ModalNotification, ModalTextInput, OnModalTextInputResponseEvent } from '@/components'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Alert, Box, Button, Stack, Tooltip, Typography } from '@mui/material'

import projectsPageCreateProjectTrigger from '@/app/(private)/projects/newProjectTrigger'
import { ProjectControllerCS } from '@/scripts/modules/controller/projectController'
import { compareObjectsSame } from '@/scripts/utils/comparer'
import { useState } from 'react'

interface Props
{
	projects: ProjectModel[]
}

export function ProjectPageCsr({ projects: projectsListProp }: Props)
{
	projectsPageCreateProjectTrigger.addSubscription('ProjectPageCsr', () => setNewProjectModelOpen(true))

	const [isWorking, setIsWorking] = useState(false)
	const [projectsList, setProjectsList] = useState(projectsListProp)
	const [selectedProject, setSelectedProject] = useState<ProjectModel | undefined>(projectsList[0])
	const [newProjectModelOpen, setNewProjectModelOpen] = useState(false)

	const [modalNotificationProps, setModalNotificationProps] = useState({
		title: 'Title' as undefined | string,
		message: 'Message',
		modelOpen: false,
	})

	function displayModalNotification(message: string, title?: string)
	{
		setModalNotificationProps({
			title: title,
			message: message,
			modelOpen: true,
		})
	}

	function projectsCreateClickHandler()
	{
		if (selectedProject)
		{
			const project = projectsList.find(x => x.id === selectedProject.id)
			if (project) setSelectedProject({ ...project })
		}

		setNewProjectModelOpen(true)
	}

	function projectsListItemSelectHandler(projectId: string | undefined)
	{
		const project = [...projectsList].find(x => x.id === projectId)
		setSelectedProject(project)
	}

	const projectCreateHandler: OnModalTextInputResponseEvent = async (dialogResponse, value) =>
	{
		setNewProjectModelOpen(false)

		if (dialogResponse != 'accept' || !value) return

		setIsWorking(true)
		try
		{
			const controller = new ProjectControllerCS()
			const response = await controller.create(value, false)

			displayModalNotification('Project has been created.')

			setProjectsList([...projectsList, response])
		}
		catch (error: any)
		{
			displayModalNotification(error, 'Error')
		}
		setIsWorking(false)
	}

	async function projectUpdateHandler(project: ProjectModel)
	{
		if (project.name.length === 0)
		{
			displayModalNotification('Missing Project Name.', 'Cannot Save')
			return
		}

		if (project.token.length === 0)
		{
			displayModalNotification('Missing Token.', 'Cannot Save')
			return
		}

		setIsWorking(true)

		try
		{
			const controller = new ProjectControllerCS()
			await controller.update(project.id, project.name, project.active, project.token)

			const index = projectsList.findIndex(x => x.id === project.id)
			projectsList[index] = project
			setProjectsList([...projectsList])

			displayModalNotification('Project Updated.')
		}
		catch (error: any)
		{
			displayModalNotification(error, 'Error')
		}

		setIsWorking(false)
	}

	async function projectDeleteHandler(project: ProjectModel)
	{
		setIsWorking(true)

		try
		{
			const controller = new ProjectControllerCS()
			await controller.delete(project.id)

			const index = projectsList.findIndex(x => x.id === project.id)
			projectsList.splice(index, 1)
			setProjectsList([...projectsList])
			setSelectedProject(undefined)

			displayModalNotification('Project has been deleted.')
		}
		catch (error: any)
		{
			displayModalNotification(error, 'Error')
		}
		setIsWorking(false)
	}

	return (
		<>
			{/* Project List */}
			<Stack spacing={3}>
				{projectsList.length === 0 && <>
					<Box mb={3}>
						<Alert severity="info" variant="outlined">
							No projects.
						</Alert>
					</Box>
				</>}
				{projectsList.length > 0 && projectsList.map(project =>
					<Accordion key={project.id} expanded={project.id === selectedProject?.id} onChange={(_, v) => projectsListItemSelectHandler(v ? project.id : undefined)}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />} >
							<Typography variant="h6">{project.name}</Typography>
						</AccordionSummary>
						{selectedProject &&
							<>
								<AccordionDetails>
									<Stack spacing={4}>
										<InputSwitch
											color="success"
											label={`${selectedProject.active ? 'Is' : 'Not'} Active`}
											checked={selectedProject.active}
											onChange={(value) => setSelectedProject({ ...selectedProject, active: value })}
										/>
										<InputText
											label="Project Name"
											value={selectedProject.name}
											onValueChange={(value) => setSelectedProject({ ...selectedProject, name: value })}
										/>
										<InputPasswordOutlined
											label="Access Token"
											password={selectedProject.token}
											onPasswordChange={(value) => setSelectedProject({ ...selectedProject, token: value })} />
									</Stack>
								</AccordionDetails>

								<AccordionActions>
									<Stack direction="row" gap={2} paddingRight={1} paddingBottom={1}>
										<Tooltip title="Double Click to Delete" arrow>
											<Button
												color="warning"
												onDoubleClick={() => projectDeleteHandler(selectedProject)}
											>Delete</Button>
										</Tooltip>
										<Tooltip title={compareObjectsSame(project, selectedProject) ? 'Make changes to save' : ''} arrow>
											<span>
												<Button
													color="success" variant="contained"
													disabled={compareObjectsSame(project, selectedProject)}
													onClick={() => projectUpdateHandler(selectedProject)}
												>Save</Button>
											</span>
										</Tooltip>
									</Stack>
								</AccordionActions>
							</>
						}
					</Accordion>
				)}
			</Stack>
			{/* Overlays */}
			<ModalLoading modelOpen={isWorking} title="Please Wait" />
			<ModalNotification
				title={modalNotificationProps.title}
				message={modalNotificationProps.message}
				modelOpen={modalNotificationProps.modelOpen}
				onModalClose={() => setModalNotificationProps({ ...modalNotificationProps, modelOpen: false })}
			/>
			<ModalTextInput
				title="New Project"
				message="Select a name for your new project, all other values will bet auto generated."
				textLabel="Project Name"
				textType="text"
				modalOpen={newProjectModelOpen}
				onModalRespond={projectCreateHandler}
			/>
		</>
	)
}
