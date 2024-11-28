import { useNavigate } from 'react-router-dom';

interface props {
  title?: string | null;
  message?: string;
}

export default function Notfound({ title, message = 'Go back Home' }: props) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full h-full min-h-[300px]  pt-5 justify-center place-items-center">
      <h2 className="text-red-500 text-[40px]">{title || 'page not found'}</h2>
      <button
        className="cursor-pointer py-2 px-4 rounded-sm shadow border-0 bg-blue-400 text-white"
        onClick={() => navigate('/')}
      >
        {message}
      </button>
    </div>
  );
}
