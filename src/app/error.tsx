"use client";

import ErrorPageComponent from '@/components/ErrorPage';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPageComponent 
      errorType="generic"
      title="Qualcosa è andato storto"
      message="Si è verificato un errore imprevisto. Non preoccuparti, puoi riprovare o tornare alla home."
      showResetButton={true}
      onReset={reset}
    />
  );
}
