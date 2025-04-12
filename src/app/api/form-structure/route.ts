import { NextResponse } from 'next/server';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'textarea';
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

export async function GET() {
  const formStructure: FormField[] = [
    {
      name: 'nome',
      label: 'Nome Completo',
      type: 'text',
      required: true,
      placeholder: 'Digite seu nome completo',
      validation: {
        min: 3,
        max: 100,
      },
    },
    {
      name: 'email',
      label: 'E-mail',
      type: 'email',
      required: true,
      placeholder: 'seu.email@exemplo.com',
      validation: {
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      },
    },
    {
      name: 'idade',
      label: 'Idade',
      type: 'number',
      required: false,
      placeholder: 'Digite sua idade',
      validation: {
        min: 0,
        max: 120,
      },
    },
    {
      name: 'tipoUsuario',
      label: 'Tipo de Usuário',
      type: 'select',
      required: true,
      placeholder: 'Selecione o tipo de usuário',
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Usuário', value: 'user' },
        { label: 'Visitante', value: 'guest' },
      ],
    },
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'textarea',
      required: false,
      placeholder: 'Digite uma descrição sobre você',
      validation: {
        min: 10,
        max: 500,
      },
      dependsOn: {
        field: 'tipoUsuario',
        value: 'admin',
      },
    },
    {
      name: 'aceitaTermos',
      label: 'Aceito os termos de uso',
      type: 'checkbox',
      required: true,
      description: 'Você precisa aceitar os termos para continuar',
    },
  ];

  return NextResponse.json(formStructure);
} 