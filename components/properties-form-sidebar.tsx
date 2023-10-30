import { AiOutlineClose } from 'react-icons/ai'

import { useDesigner } from '../hooks/use-designer'
import { FormElements } from './form-elements'
import { Button } from './ui/button'
import { Separator } from './ui/separator'

export default function PropertiesFormSidebar() {
	const { selectedElement, setSelectedElement } = useDesigner()
	if (!selectedElement) return null

	const FieldOptionsForm = FormElements[selectedElement?.type].fieldOptionsForm

	return (
		<div className='flex flex-col p-2'>
			<div className='flex justify-between items-center'>
				<p className='text-sm text-foreground/70'>Element properties</p>
				<Button
					size={'icon'}
					variant={'ghost'}
					onClick={() => setSelectedElement(null)}
				>
					<AiOutlineClose />
				</Button>
			</div>
			<Separator className='mb-4' />
			<FieldOptionsForm elementInstance={selectedElement} />
		</div>
	)
}
