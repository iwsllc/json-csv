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
	/**
	 * Prefix `'` to a value starting with `=`, `+`, `-`, `@`, tab or CR, so a spreadsheet opening
	 * the file shows it as text instead of evaluating it as a formula (CSV injection). Quoting
	 * does not prevent this: the quotes are CSV syntax and are stripped on read. Plain numbers,
	 * including negatives, are left alone. Default `false`.
	 */
	escapeFormulas?: boolean
}
