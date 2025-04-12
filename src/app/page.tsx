'use client';

import { useState } from 'react';
import { DynamicForm } from '@/components/DynamicForm';
import { FormData } from '@/types/form';

export default function Home() {
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const handleSubmit = (data: FormData) => {
    console.log('Dados do formulário:', data);
    setSubmittedData(data);
    // Aqui você pode implementar a lógica para enviar os dados para sua API
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Formulário Dinâmico
        </h1>
        
        {submittedData ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
            <p className="font-medium">Formulário enviado com sucesso!</p>
            <p className="text-sm mt-1">Os dados foram registrados em nosso sistema.</p>
            <button 
              onClick={() => setSubmittedData(null)}
              className="mt-2 text-sm text-green-700 underline hover:text-green-800"
            >
              Enviar outro formulário
            </button>
          </div>
        ) : (
          <DynamicForm onSubmit={handleSubmit} />
        )}
      </div>
    </main>
  );
}
