import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

type Option = {
    label: string;
    value: string;
};

type SelectFieldProps = {
    id: string;
    label: string;
    register: UseFormRegister<any>;
    error?: FieldError;
    options: Option[];
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
};

const SelectField: React.FC<SelectFieldProps> = ({
    id,
    label,
    register,
    error,
    options,
    defaultValue = '',
    onChange,
}) => {
    return(
        <div className='col-span-2 md:col-span-1 w-full'>
            <label 
                htmlFor={id} 
                className='text-white text-[24px] font-roboto inline-block mb-2'
            >
                {label}
            </label>

            <select
                id={id}
                defaultValue={defaultValue}
                {...register(id)}
                onChange={onChange}
                className='w-full text-black bg-white/20 text-[20px] font-roboto rounded-lg h-[47.6px] px-4 border border-white focus:outline-none'
            >
                <option 
                    value=""
                    disabled
                >
                Selecione um curso
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
            {error && (
                <span className='text-secondary-1 text-right block'>
                    {error.message}
                </span>
            )}
        </div>
    );
};

export default SelectField;