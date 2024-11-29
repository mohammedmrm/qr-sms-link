import { Err } from '@/types';

interface props {
  error?: Err | null;
  retryLabel?: string;
  onRetry?: () => any;
}
export default function Error({ error, retryLabel, onRetry }: props) {
  return (
    <div className="flex flex-col w-full h-full min-h-[300px]  pt-5 justify-center place-items-center">
      <h2 className="text-red-500">{error?.messaggioErrore || 'Errore'}</h2>
      {retryLabel && (
        <button
          className="cursor-pointer py-2 px-4 rounded-sm shadow border-0 bg-blue-400 text-white"
          onClick={onRetry}
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
