import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

type InputFieldProps = {
  id: string;
  label: string;
  type?: 'text' | 'password';
  register: UseFormRegisterReturn;
  error?: FieldError;
  disabled?: boolean;
  className?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = 'text',
  register,
  error,
  disabled = false,
  className,
}) => {
  return(
    <div className='relative col-span-2 md:col-span-1 w-full z-10'>

      <input 
        type={type}
        id = {id}
        placeholder=''
        disabled={disabled}
        {...register}
        className={twMerge(
          'peer w-full px-4 py-2 bg-white/37 text-lg md:text-xl rounded-lg border border-[#D9D9D9] -z-10',
          'placeholder:text-[#1E1E1EE5]/90 text-primary-5 focus:outline-none focus:border-secondary-2',
          'disabled:text-gray-700 disabled:border-gray-800 disabled:bg-gray-300 disabled:pointer-events-none'
        )}
      />

      <label 
        htmlFor={id} 
        className={twMerge(
          'absolute text-white text-xs md:text-sm -top-2.5 md:-top-3.5 left-2 px-1 rounded-lg bg-primary-2 z-10',
          'peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-placeholder-shown:text-lg peer-placeholder-shown:text-[#1E1E1EE5]/90 peer-placeholder-shown:bg-transparent',
          'peer-focus:text-white peer-focus:text-xs md:peer-focus:text-sm peer-focus:-top-2.5 peer-focus:md:-top-3.5 peer-focus:left-2 peer-focus:bg-primary-2',
          'pointer-events-none transition-all',
          'nth-2:border nth-2:border-[#D9D9D9] peer-placeholder-shown:nth-2:border-transparent peer-focus:nth-2:border-secondary-2',
          className
      )}>
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

export default InputField;