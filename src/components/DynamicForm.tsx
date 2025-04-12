'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField, FormData, createFormSchema } from '@/types/form';

interface DynamicFormProps {
  onSubmit: (data: FormData) => void;
}

export function DynamicForm({ onSubmit }: DynamicFormProps) {
  const [fields, setFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(createFormSchema(fields)),
  });

  // Observar valores dos campos para campos condicionais
  const formValues = useWatch({ control });

  useEffect(() => {
    const fetchFormStructure = async () => {
      try {
        const response = await fetch('/api/form-structure');
        if (!response.ok) {
          throw new Error('Erro ao carregar a estrutura do formulário');
        }
        const data = await response.json();
        // console.log(data)
        // console.log(createFormSchema(data))
        setFields(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormStructure();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p className="font-medium">Erro ao carregar o formulário</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const shouldShowField = (field: FormField) => {
    if (!field.dependsOn) return true;
    
    const dependentFieldValue = formValues[field.dependsOn.field];
    return dependentFieldValue === field.dependsOn.value;
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.name,
      ...register(field.name),
      placeholder: field.placeholder,
      className: 'w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
    };

    switch (field.type) {
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">{field.placeholder || 'Selecione uma opção'}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              {...commonProps}
              className="w-4 h-4 mr-2"
            />
            {field.description && (
              <span className="text-sm text-gray-500">{field.description}</span>
            )}
          </div>
        );
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={4}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      default:
        return (
          <input
            type={field.type}
            {...commonProps}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto p-4">
      {fields.map((field) => (
        shouldShowField(field) && (
          <div key={field.name} className="space-y-1">
            <label htmlFor={field.name} className="block text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
            {field.description && field.type !== 'checkbox' && (
              <p className="text-sm text-gray-500">{field.description}</p>
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-sm">
                {errors[field.name]?.message as string}
              </p>
            )}
          </div>
        )
      ))}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
} 