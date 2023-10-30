// import { CheckboxFieldFormElement } from "./fields/CheckboxField";
// import { DateFieldFormElement } from "./fields/DateField";
// import { ParagprahFieldFormElement } from "./fields/ParagraphField";
// import { SelectFieldFormElement } from "./fields/SelectField";
// import { SeparatorFieldFormElement } from "./fields/SeparatorField";
// import { SpacerFieldFormElement } from "./fields/SpacerField";
// import { SubTitleFieldFormElement } from "./fields/SubTitleField";
// import { TextAreaFormElement } from "./fields/TextAreaField";
import { NumberFieldFormElement } from './fields/number-field'
import { TextFieldFormElement } from './fields/text-field'
import { TextareaFieldFormElement } from './fields/textarea-field'
// import { TitleFieldFormElement } from "./fields/TitleField";

export type ElementsType = 'TextField' | 'NumberField' | 'TextAreaField'
// | 'TitleField'
// | 'SubTitleField'
// | 'ParagraphField'
// | 'SeparatorField'
// | 'SpacerField'
// | 'DateField'
// | 'SelectField'
// | 'CheckboxField'

export type SubmitFunction = (key: string, value: string) => void

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

	validate: (formElement: FormElementInstance, currentValue: string) => boolean
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
	// TitleField: TitleFieldFormElement,
	// SubTitleField: SubTitleFieldFormElement,
	// ParagraphField: ParagprahFieldFormElement,
	// SeparatorField: SeparatorFieldFormElement,
	// SpacerField: SpacerFieldFormElement,
	// DateField: DateFieldFormElement,
	// SelectField: SelectFieldFormElement,
	// CheckboxField: CheckboxFieldFormElement,
}
