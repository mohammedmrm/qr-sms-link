import classnames from 'classnames';
import React, { forwardRef } from 'react';

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string; label: string }[];
  placeholder?: string;
  label?: string;
  error?: any;
};

const Select = forwardRef<HTMLSelectElement, Props>(
  ({ error, label, name, placeholder, options, ...rest }: Props, ref) => {
    return (
      <div className="flex flex-col grow min-w-40 gap-2">
        <label className="text-slate-600" htmlFor={name}>
          {label || placeholder}
        </label>
        <select
          ref={ref}
          className={classnames(
            'p-3 border-2 rounded text-sm shadow outline-none focus:outline-none focus:border-b-blue-500 w-full',
            {
              'border-2 shadow-lg border-red-600 focus:border-b-red-600': !!error,
              'disabled:bg-gray-200 w-full border-0 rounded bg-white': true,
            }
          )}
          {...rest}
        >
          <option value={''}>---Selezionare---</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

export default Select;
