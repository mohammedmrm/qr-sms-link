import { faCheck, faExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

type Props = {
  status: 'error' | 'warning' | 'success';
  children?: JSX.Element | JSX.Element[] | string | number;
  disableAnaimation?: boolean;
  showIcon?: boolean;
  bordered?: boolean;
};
export default function Pallino({ status, disableAnaimation, showIcon, bordered, children }: Props) {
  let pallino = '';
  let pallinoB = '';
  switch (status) {
    case 'error':
      pallino = 'text-red-500 ';
      pallinoB = 'border-red-500 border-2 text-red-500';
      break;
    case 'warning':
      pallino = 'text-yellow-500 ';
      pallinoB = 'border-yellow-500 border-2 text-yellow-600';
      break;
    case 'success':
      pallino = 'text-green-500 ';
      pallinoB = 'border-green-500 border-2 text-green-500';
      break;
    default:
      pallino = 'text-gray-500 ';
      pallinoB = 'border-gray-500 border-2 text-gray-500';
      break;
  }
  return (
    <div className="flex place-items-center">
      <span
        className={classNames(
          `flex font-extrabold text-xl h-6 w-6 m-1 p-3 mx-5 relative  place-items-center place-content-center rounded-full`,
          {
            [pallino]: !bordered,
            [pallinoB]: bordered,
          }
        )}
      >
        {showIcon && status == 'success' && <FontAwesomeIcon icon={faCheck} />}
        {showIcon && status == 'error' && <FontAwesomeIcon icon={faXmark} />}
        {showIcon && status == 'warning' && <FontAwesomeIcon icon={faExclamation} />}
        {!disableAnaimation && <span className={`h-5 w-5 ${pallino} absolute animate-ping rounded-full `}></span>}
      </span>
      <div className="text-slate-800">{children}</div>
    </div>
  );
}
