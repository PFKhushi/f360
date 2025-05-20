import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

//CORRIGIR COMPONENTE - SE BASEAR NO FUNCIONAMENTO DO COMPONENTE INPUTFIELD

type TextareaFieldProps = {
    id:string;
    label: string;
    placeholder?: string;
    register: UseFormRegisterReturn;
    error?: FieldError;
    rows?: number;
};

const TextareaField: React.FC<TextareaFieldProps> = ({
    id,
    label,
    placeholder = '',
    register,
    error,
    rows = 2,
}) => {
    return(
        <div className='relative col-span-2 w-full'>
            <label 
                htmlFor={id} 
                className='text-white text-[24px] font-roboto inline-block mb-2 '
            >
                {label}
            </label>

            <textarea
                id={id}
                placeholder={placeholder}
                {...register}
                rows={rows}
                className='w-full text-black bg-white/20 text-[20px] font-roboto rounded-lg px-4 py-2 border border-white focus:outline-none'
            />

            {error && (
                <span className='absolute italic text-secondary-1 text-xs md:text-sm -bottom-4 md:-bottom-5 right-0'>
                {error.message}
                </span>
            )}
        </div>
    );
};


export default TextareaField;