import { FieldError } from 'react-hook-form';
interface InputTextProps {
  label: string;
  placeholder: string;
  type: string;
  register: any;
  error?: FieldError;
}

export default function InputText({
  label,
  placeholder,
  type,
  register,
  error,
}: InputTextProps) {
  return (
    <div>
      <p className="font-bold text-xl md:text-2xl mb-3">{label}</p>
      <input
        type={type}
        placeholder={placeholder}
        className="w-80 md:w-72 lg:w-96 h-9 rounded-md text-black p-2"
        {...register}
      />
        {error && <p className="text-red-500">{error.message}</p>} 
    </div>
  )
}
