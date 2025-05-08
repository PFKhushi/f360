import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type InputFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'password';
  register: UseFormRegisterReturn;
  error?: FieldError;
};

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  placeholder = '',
  type = 'text',
  register,
  error,
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

        <input 
          type={type}
          id = {id}
          placeholder={placeholder}
          {...register}
          className='w-full bg-white/37 placeholder:text-[#1E1E1EE5]/90 text-[18px] md:text-xl rounded-lg px-4 py-2 border border-[#D9D9D9] focus:outline-none'
        />
      </div>

      {error && (
        <span className='absolute italic text-secondary-1 text-xs md:text-sm right-0'>
          {error.message}
        </span>
      )}
    </div>
  );
};

export default InputField;