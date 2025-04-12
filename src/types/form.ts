import { z } from "zod";

export type FormFieldType = 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'textarea';

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  options?: { label: string; value: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  placeholder?: string;
  description?: string;
  dependsOn?: {
    field: string;
    value: string | number | boolean;
  };
}

export type FormData = {
  [key: string]: string | number | boolean;
};

export const createFormSchema = (fields: FormField[]) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case 'text':
      case 'textarea': {
        let schema = z.string();
        if (field.validation?.min) {
          schema = schema.min(field.validation.min);
        }
        if (field.validation?.max) {
          schema = schema.max(field.validation.max);
        }
        if (field.validation?.pattern) {
          schema = schema.regex(new RegExp(field.validation.pattern));
        }
        fieldSchema = schema;
        break;
      }
      case 'email':
        fieldSchema = z.string().email();
        break;
      case 'number': {
        let schema = z.number();
        if (field.validation?.min !== undefined) {
          schema = schema.min(field.validation.min);
        }
        if (field.validation?.max !== undefined) {
          schema = schema.max(field.validation.max);
        }
        fieldSchema = schema;
        break;
      }
      case 'checkbox':
        fieldSchema = z.boolean();
        break;
      case 'select': {
        if (field.options) {
          fieldSchema = z.enum(field.options.map(opt => opt.value) as [string, ...string[]]);
        } else {
          fieldSchema = z.string();
        }
        break;
      }
      default:
        fieldSchema = z.string();
    }

    if (field.required) {
      schemaFields[field.name] = fieldSchema;
    } else {
      schemaFields[field.name] = fieldSchema.optional();
    }
  });

  return z.object(schemaFields);
}; 