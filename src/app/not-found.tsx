import ErrorPageComponent from '@/components/ErrorPage';

export default function NotFound() {
  return (
    <ErrorPageComponent 
      errorType="404"
      title="Pagina Non Trovata"
      message="La pagina che stai cercando non esiste o è stata spostata. Verifica l'URL o torna alla home."
    />
  );
}