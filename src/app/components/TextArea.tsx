import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

type TextareaFieldProps = {
    id:string;
    label: string;
    placeholder?: string;
    register: UseFormRegister<any>;
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
        <div className='col-span-2 w-full'>
            <label 
                htmlFor={id} 
                className='text-white text-[24px] font-roboto inline-block mb-2 '
            >
                {label}
            </label>

            <textarea
                id={id}
                placeholder={placeholder}
                {...register(id)}
                rows={rows}
                className='w-full text-black bg-white/20 text-[20px] font-roboto rounded-lg px-4 py-2 border border-white focus:outline-none'
            />
        </div>
    );
};


export default TextareaField;