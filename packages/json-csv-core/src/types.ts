export interface Field {
	name: string
	label?: string
	transform?: (source: unknown) => string
	/**
	 * @deprecated Please use `transform` instead
	 * @param source unknown value to be transformed
	 * @returns string transformed value
	 */
	filter?: (source: unknown) => string
	quoted?: boolean
}

export type FieldList = Field[]

export interface ExportOptions {
	fieldSeparator?: string
	fields: FieldList
	ignoreHeader: boolean
}
