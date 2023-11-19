import { CheckboxFieldFormElement } from './fields/checkbox-field'
import { DateFieldFormElement } from './fields/date-field'
import { FileFieldFormElement } from './fields/file-field'
import { NumberFieldFormElement } from './fields/number-field'
import { ParagraphFieldFormElement } from './fields/paragraph-field'
import { RadioGroupFieldFormElement } from './fields/radio-group-field'
import { SelectFieldFormElement } from './fields/select-field'
import { SeparatorFieldFormElement } from './fields/separator-field'
import { SpacerFieldFormElement } from './fields/spacer-field'
import { SubtitleFieldFormElement } from './fields/subtitle-field'
import { SwitchFieldFormElement } from './fields/switch-field'
import { TextFieldFormElement } from './fields/text-field'
import { TextareaFieldFormElement } from './fields/textarea-field'
import { TitleFieldFormElement } from './fields/title-field'

export type ElementsType =
	| 'TextField'
	| 'NumberField'
	| 'TextAreaField'
	| 'DateField'
	| 'TitleField'
	| 'SubTitleField'
	| 'ParagraphField'
	| 'SeparatorField'
	| 'SpacerField'
	| 'SelectField'
	| 'CheckboxField'
	| 'RadioGroupField'
	| 'SwitchField'
	| 'FileField'

export type SubmitFunction = (key: string, value: string | File) => void

export type FormElement = {
	type: ElementsType

	construct: (id: string) => FormElementInstance

	designerBtnElement: {
		icon: React.ElementType
		label: string
	}

	designerComponent: React.FC<{
		elementInstance: FormElementInstance
	}>
	formComponent: React.FC<{
		elementInstance: FormElementInstance
		submitValue?: SubmitFunction
		isInvalid?: boolean
		defaultValue?: string
	}>
	fieldOptionsForm: React.FC<{
		elementInstance: FormElementInstance
	}>

	validate: (formElement: FormElementInstance, currentValue: any) => boolean
}

export type FormElementInstance = {
	id: string
	type: ElementsType
	extraAttributes?: Record<string, any>
}

type FormElementsType = {
	[key in ElementsType]: FormElement
}
export const FormElements: FormElementsType = {
	TextField: TextFieldFormElement,
	NumberField: NumberFieldFormElement,
	TextAreaField: TextareaFieldFormElement,
	DateField: DateFieldFormElement,
	TitleField: TitleFieldFormElement,
	SubTitleField: SubtitleFieldFormElement,
	ParagraphField: ParagraphFieldFormElement,
	SeparatorField: SeparatorFieldFormElement,
	SpacerField: SpacerFieldFormElement,
	SelectField: SelectFieldFormElement,
	CheckboxField: CheckboxFieldFormElement,
	RadioGroupField: RadioGroupFieldFormElement,
	SwitchField: SwitchFieldFormElement,
	FileField: FileFieldFormElement,
}
