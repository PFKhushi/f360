import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type Option = {
  label: string;
  value: string | number;
};

type SelectFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  options: Option[];
  defaultValue?: string;
};

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  placeholder = '',
  register,
  error,
  options,
  defaultValue = '',
}) => {
  return(
    <div className='relative col-span-2 md:col-span-1 w-full'>
      
      <div className='flex flex-col gap-1 md:gap-2'>
        <label 
          htmlFor={id} 
          className='text-white text-[18px] md:text-xl'
        >
          {label}
        </label>

        <select
          id={id}
          defaultValue={defaultValue}
          {...register}
          className='w-full bg-white/37 text-[#1E1E1EE5]/90 text-[18px] md:text-xl rounded-lg px-3 py-2 border border-[#D9D9D9] focus:outline-none'
        >
          <option 
            value=""
            disabled
          >
            {placeholder}
          </option>
          {options.map((opt) => (
            <option 
              key={opt.value} 
              value={opt.value}
            >
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      
      {error && (
        <span className='absolute italic text-secondary-1 text-xs md:text-sm right-0'>
          {error.message}
        </span>
      )}
    </div>
  );
};

export default SelectField;