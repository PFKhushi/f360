import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

type InputFieldProps = {
    id: string;
    label: string;
    placeholder?: string;
    type?: string;
    register: UseFormRegister<any>;
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
        <div className='col-span-2 md:col-span-1 w-full'>
            <label 
                htmlFor={id} 
                className='text-white text-[24px] font-roboto inline-block mb-2'
            >
                {label}
            </label>

            <input 
                type={type}
                id = {id}
                placeholder={placeholder}
                {...register(id)}
                className='w-full text-black bg-white/20 text-[20px] font-roboto rounded-lg px-4 py-2 border border-white focus:outline-none '
            />

            {error && (
                <span className='text-secondary-1 text-right block min-h-[20px]'>
                    {error.message}
                </span>
            )}
        </div>
    );
};

export default InputField;