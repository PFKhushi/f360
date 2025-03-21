/* eslint-disable @typescript-eslint/no-explicit-any */
interface InputTextProps {
  label: string
  placeholder: string
  type: string
  register: any
  error?: any
  defaultValue?: any
}

export default function InputText({
  label,
  placeholder,
  type,
  register,
  error,
  defaultValue,
}: InputTextProps) {
  return (
    <div className="flex flex-col gap-2 justify-center items-start">
      <p className="font-bold text-xl md:text-2xl w-full text-left">{label}</p>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full max-w-64 sm:w-64 sm:max-w-none md:w-72 lg:w-96 h-9 rounded-md text-black p-2"
        defaultValue={defaultValue}
        {...register}
      />
      {error && (
        <span className="text-red-500 xl:text-sm text-md font-semibold ml-1 w-full max-w-64 md:max-w-none md:w-72 lg:w-96">
          {error.message}
        </span>
      )}
    </div>
  )
}
