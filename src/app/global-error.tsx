"use client";

import ErrorPageComponent from '@/components/ErrorPage';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPageComponent 
      errorType="500"
      title="Errore Critico dell'Applicazione"
      message="Si è verificato un errore critico nell'applicazione. Il team tecnico è stato notificato e sta lavorando per risolvere il problema."
      showResetButton={true}
      onReset={reset}
    />
  );
}
