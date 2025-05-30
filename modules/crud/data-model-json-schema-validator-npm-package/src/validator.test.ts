import SCHEMA__1_0 from '../../data-model-json-schema/1.0.json'
import { determineSchemaVersionFromDataModel, getSchema, getValidator, validate, validateAgainstSchema } from './validator'

describe('determineSchemaVersionFromDataModel', () => {
  it('should return 1.0', () => {
    expect(determineSchemaVersionFromDataModel({ spec_version: '1.0' })).toBe('1.0')
  })

  it('should return UNKNOWN for 2.0', () => {
    expect(determineSchemaVersionFromDataModel({ spec_version: '2.0' })).toBe('UNKNOWN')
  })

  it('should return UNKNOWN for {}', () => {
    expect(determineSchemaVersionFromDataModel({})).toBe('UNKNOWN')
  })

  it('should return UNKNOWN for []', () => {
    expect(determineSchemaVersionFromDataModel([])).toBe('UNKNOWN')
  })

  it('should return UNKNOWN for null', () => {
    expect(determineSchemaVersionFromDataModel(null)).toBe('UNKNOWN')
  })

  it('should return UNKNOWN for undefined', () => {
    expect(determineSchemaVersionFromDataModel(undefined)).toBe('UNKNOWN')
  })

  it('should return UNKNOWN for a random string (valid JSON)', () => {
    expect(determineSchemaVersionFromDataModel('"asddsadsaasd"')).toBe('UNKNOWN')
  })

  it('should return UNKNOWN for a random string (invalid JSON)', () => {
    expect(determineSchemaVersionFromDataModel('asddsadsaasd')).toBe('UNKNOWN')
  })
})

describe('getSchema', () => {
  it('should return schema for version 1.0', () => {
    expect(getSchema('1.0')).toBe(SCHEMA__1_0)
  })

  it('should throw error for unknown version', () => {
    expect(() => getSchema('UNKNOWN')).toThrow(/Unknown schema version/)
  })

  it('should throw error for a random string version', () => {
    expect(() => getSchema('asddsadsaasd')).toThrow(/Unknown schema version/)
  })
})

describe('getValidator', () => {
  it('should return the same compiled validator on subsequent calls', () => {
    const first = getValidator('1.0')
    const second = getValidator('1.0')

    expect(first).toBe(second)
  })

  it('should throw error on UNKNOWN version', () => {
    expect(() => getValidator('UNKNOWN' as any)).toThrow(/Unknown schema version/)
  })
})

describe('validateAgainstSchema', () => {
  it('should return valid result for a valid data model', () => {
    const schema = {
      type: 'object',
      properties: {
        property: {
          type: 'string'
        }
      },
      additionalProperties: false
    }

    const dataModel = {
      property: 'test',
    }

    const result = validateAgainstSchema(schema, dataModel)

    expect(result.valid).toBe(true)
    expect(result.errors).toBeUndefined()
  })

  it('should return invalid result with errors for an invalid data model', () => {
    const schema = {
      type: 'object',
      properties: {
        property: {
          type: 'string'
        }
      },
      additionalProperties: false
    }

    const dataModel = {
      property: 123
    }

    const result = validateAgainstSchema(schema, dataModel)

    expect(result.valid).toBe(false)
    expect(result.errors).not.toBeUndefined()
  })
})

describe('validate', () => {
  it('should return valid for valid 1.0 dataModel', () => {
    const dataModel = {
      'spec_version': '1.0',
      'model': {
        'version': '1.0',
        'meta': {
          'description': 'My example dataModel',
          'created_by': 'John Doe'
        },
        'namespaces': [
          {
            'name': 'content',
            'meta': {
              'description': 'Namespace for content-related entities',
              'created_by': 'John Doe'
            },
            'entities': [
              {
                'name': 'Article',
                'fields': [
                  { 'name': 'id', 'type': 'integer', 'primary_key': true },
                  { 'name': 'title', 'type': 'string' },
                  { 'name': 'content', 'type': 'text' },
                  { 'name': 'published_at', 'type': 'datetime' }
                ]
              },
              {
                'name': 'Page',
                'fields': [
                  { 'name': 'id', 'type': 'integer', 'primary_key': true },
                  { 'name': 'title', 'type': 'string' },
                  { 'name': 'content', 'type': 'text' },
                  { 'name': 'published_at', 'type': 'datetime' }
                ]
              },
              {
                'name': 'Comment',
                'fields': [
                  { 'name': 'id', 'type': 'integer', 'primary_key': true },
                  { 'name': 'text', 'type': 'text' },
                  { 'name': 'created_at', 'type': 'datetime' },
                  { 'name': 'user_id', 'type': 'integer', 'foreign_key': true, 'references': 'interaction.User.id' },
                  { 'name': 'article_id', 'type': 'integer', 'foreign_key': true, 'references': 'content.Article.id' }
                ]
              },
              {
                'name': 'Category',
                'fields': [
                  { 'name': 'id', 'type': 'integer', 'primary_key': true },
                  { 'name': 'name', 'type': 'string' }
                ]
              },
              {
                'name': 'Tag',
                'fields': [
                  { 'name': 'id', 'type': 'integer', 'primary_key': true },
                  { 'name': 'name', 'type': 'string' }
                ]
              }
            ]
          },
          {
            'name': 'interaction',
            'meta': {
              'description': 'Namespace for interaction-related entities',
              'created_by': 'Alice Smith'
            },
            'entities': [
              {
                'name': 'User',
                'fields': [
                  { 'name': 'id', 'type': 'integer', 'primary_key': true },
                  { 'name': 'username', 'type': 'string' },
                  { 'name': 'email', 'type': 'string' }
                ]
              },
              {
                'name': 'Like',
                'fields': [
                  { 'name': 'id', 'type': 'integer', 'primary_key': true },
                  { 'name': 'created_at', 'type': 'datetime' },
                  { 'name': 'user_id', 'type': 'integer', 'foreign_key': true, 'references': 'interaction.User.id' },
                  { 'name': 'article_id', 'type': 'integer', 'foreign_key': true, 'references': 'content.Article.id' }
                ]
              }
            ]
          },
          {
            'name': 'media',
            'meta': {
              'description': 'Namespace for media-related entities',
              'created_by': 'Bob Johnson'
            },
            'entities': [
              {
                'name': 'Image',
                'fields': [
                  { 'name': 'id', 'type': 'integer', 'primary_key': true },
                  { 'name': 'url', 'type': 'string' },
                  { 'name': 'description', 'type': 'text' }
                ]
              },
              {
                'name': 'Video',
                'fields': [
                  { 'name': 'id', 'type': 'integer', 'primary_key': true },
                  { 'name': 'url', 'type': 'string' },
                  { 'name': 'description', 'type': 'text' }
                ]
              },
              {
                'name': 'Folder',
                'fields': [
                  { 'name': 'id', 'type': 'integer', 'primary_key': true },
                  { 'name': 'name', 'type': 'string' }
                ]
              },
              {
                'name': 'File',
                'fields': [
                  { 'name': 'id', 'type': 'integer', 'primary_key': true },
                  { 'name': 'url', 'type': 'string' },
                  { 'name': 'description', 'type': 'text' },
                  { 'name': 'folder_id', 'type': 'integer', 'foreign_key': true, 'references': 'media.Folder.id' }
                ]
              }
            ]
          }
        ],
        'relationships': [
          {
            'name': 'comments',
            'type': 'one-to-many',
            'from': 'content.Article',
            'to': 'content.Comment',
            'from_field': 'id',
            'to_field': 'article_id'
          },
          {
            'name': 'categories',
            'type': 'many-to-many',
            'from': 'content.Article',
            'to': 'content.Category',
            'from_field': 'id',
            'to_field': 'id',
            'through': 'content.ArticleCategory',
            'through_field_from': 'article_id',
            'through_field_to': 'category_id'
          },
          {
            'name': 'tags',
            'type': 'many-to-many',
            'from': 'content.Article',
            'to': 'content.Tag',
            'from_field': 'id',
            'to_field': 'id',
            'through': 'content.ArticleTag',
            'through_field_from': 'article_id',
            'through_field_to': 'tag_id'
          },
          {
            'name': 'likes',
            'type': 'one-to-many',
            'from': 'interaction.User',
            'to': 'interaction.Like',
            'from_field': 'id',
            'to_field': 'user_id'
          },
          {
            'name': 'articles',
            'type': 'many-to-many',
            'from': 'interaction.Like',
            'to': 'content.Article',
            'from_field': 'article_id',
            'to_field': 'id',
            'through': 'interaction.ArticleLike',
            'through_field_from': 'like_id',
            'through_field_to': 'article_id'
          },
        ]
      }
    }

    const result = validate(dataModel)

    expect(result.valid).toBe(true)
    expect(result.schemaVersion).toBe('1.0')
    expect(result.errors).toBeUndefined()
  })

  it('should return invalid with errors for invalid 1.0 dataModel', () => {
    const dataModel = {
      'spec_version': '1.0',
      'model': {
        'version': '1.0',
        'meta': {
          'description': 'My example dataModel',
          'created_by': 'John Doe'
        },
        'test': [
          {
            'name': 'User',
            'fields': [
              { 'name': 'id', 'type': 'integer', 'primary_key': true },
              { 'name': 'name', 'type': 'string' },
              { 'name': 'created_at', 'type': 'datetime' }
            ]
          }
        ]
      }
    }

    const result = validate(dataModel)

    expect(result.valid).toBe(false)
    expect(result.schemaVersion).toBe('1.0')
    expect(result.errors).not.toBeUndefined()
  })

  it('should return invalid for invalid dataModel', () => {
    const dataModel = {
      property: 'test'
    }

    const result = validate(dataModel)

    expect(result.valid).toBe(false)
    expect(result.schemaVersion).toBe('UNKNOWN')
  })
})
