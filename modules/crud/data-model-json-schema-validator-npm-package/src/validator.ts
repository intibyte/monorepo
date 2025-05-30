import Ajv, { ValidateFunction, ErrorObject } from 'ajv'
import SCHEMA__1_0 from '../../data-model-json-schema/1.0.json'

type Schema = object
type DataModel = unknown
export type SchemaVersion = '1.0' | 'UNKNOWN'

export interface ValidationResult {
  valid: boolean
  schemaVersion: SchemaVersion
  errors?: ErrorObject[] | null
}

export function determineSchemaVersionFromDataModel (dataModel: DataModel): SchemaVersion {
  return (typeof dataModel === 'object' && dataModel !== null && (dataModel as any).spec_version === '1.0')
    ? '1.0'
    : 'UNKNOWN'
}

const SCHEMAS: Record<Exclude<SchemaVersion, 'UNKNOWN'>, Schema> = {
  '1.0': SCHEMA__1_0,
}

export function getSchema (schemaVersion: SchemaVersion | string): Schema {
  const schema = (SCHEMAS as Record<string, Schema>)[schemaVersion]
  if (!schema) {
    throw new Error('Unknown schema version')
  }

  return schema
}

const ajv = new Ajv({ allErrors: true })
const validatorCache = new WeakMap<Schema, ValidateFunction>()

const versionCache: Partial<Record<Exclude<SchemaVersion, 'UNKNOWN'>, ValidateFunction>> = {}

export function getValidator (schemaVersion: SchemaVersion): ValidateFunction {
  if (schemaVersion === 'UNKNOWN') {
    throw new Error('Unknown schema version')
  }

  let validateFn = versionCache[schemaVersion]
  if (!validateFn) {
    const schema = getSchema(schemaVersion)
    validateFn = ajv.compile(schema)
    versionCache[schemaVersion] = validateFn
  }

  return validateFn
}

export function validateAgainstSchema (schema: Schema, dataModel: DataModel): ValidationResult {
  let validateFn = validatorCache.get(schema)

  if (!validateFn) {
    validateFn = ajv.compile(schema)
    validatorCache.set(schema, validateFn)
  }

  const isValid = validateFn(dataModel)

  return {
    valid: Boolean(isValid),
    schemaVersion: determineSchemaVersionFromDataModel(dataModel),
    ...(isValid ? {} : { errors: validateFn.errors }),
  }
}

export function validate (dataModel: DataModel): ValidationResult {
  const schemaVersion: SchemaVersion = determineSchemaVersionFromDataModel(dataModel)

  if (schemaVersion === 'UNKNOWN') {
    return {
      valid: false,
      schemaVersion,
    }
  }

  const schema: Schema = getSchema(schemaVersion)

  return validateAgainstSchema(schema, dataModel)
}
