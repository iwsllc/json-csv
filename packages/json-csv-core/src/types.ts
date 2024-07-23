export type Field = {
	name: string
	label?: string
	transform?: (source: any) => string
}

export type FieldList = Field[]

export type ExportOptions = {
	fieldSeparator?: string
	fields: FieldList
	ignoreHeader: boolean
}
