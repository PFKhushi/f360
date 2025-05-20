import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { IoChevronDown } from "react-icons/io5";

type Option = {
  label: string;
  value: string | number;
};

type SelectFieldProps = {
  id: string;
  label: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  isInvalidOption?: boolean;
  options: Option[];
  defaultValue?: string;
  className?: string;
};

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  register,
  error,
  isInvalidOption = false,
  options,
  defaultValue = '',
  className,
}) => {
  return(
    <div className='relative col-span-2 md:col-span-1 w-full'>
      
      <select
        id={id}
        defaultValue={defaultValue}
        {...register}
        className='peer appearance-none w-full bg-white/37 text-primary-6 text-[18px] md:text-xl rounded-lg px-3 py-2 pr-6 border border-[#D9D9D9] focus:outline-none focus:border-secondary-2'
      >
        <option 
          value=""
          disabled
        />
        {options.map((opt) => (
          <option 
            key={opt.value} 
            value={opt.value}
          >
            {opt.label}
          </option>
        ))}
      </select>

      <IoChevronDown className={twMerge(
        'absolute right-1 top-1/2 -translate-y-1/2 place-self-center pointer-events-none w-5 h-5',
        'rotate-90 peer-focus:rotate-0 transition',
      )}/>

      <label 
        htmlFor={id} 
        className={twMerge(
          'absolute text-white text-xs md:text-sm -top-2.5 md:-top-3.5 left-2 px-1 bg-primary-2 rounded-lg z-10',
          isInvalidOption && 'top-2 md:top-2 left-3 text-lg md:text-lg text-[#1E1E1EE5]/90 bg-transparent',
          'peer-focus:text-white peer-focus:text-xs md:peer-focus:text-sm peer-focus:-top-2.5 peer-focus:md:-top-3.5 peer-focus:left-2 peer-focus:bg-primary-2',
          'pointer-events-none transition-all',
          'nth-3:border nth-3:border-[#D9D9D9] peer-focus:nth-3:border-secondary-2',
          isInvalidOption && 'nth-3:border-transparent',
          className
        )}
      >
        <div className='absolute w-[calc(100%+4px)] h-full bg-inherit -left-0.5 -top-1.75 -z-10'/>
        <div className='absolute w-full h-full rounded-lg left-0'/>
        {label}
      </label>
      
      {error && (
        <span className='absolute italic text-secondary-1 text-xs md:text-sm -bottom-4 md:-bottom-5 right-0'>
          {error.message}
        </span>
      )}

    </div>
  );
};

export default SelectField;