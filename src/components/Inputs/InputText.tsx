/* eslint-disable @typescript-eslint/no-explicit-any */
interface InputTextProps {
  label: string
  placeholder: string
  type: string
  register: any
  error?: any
}

export default function InputText({
  label,
  placeholder,
  type,
  register,
  error,
}: InputTextProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-bold text-xl md:text-2xl">{label}</p>
      <input
        type={type}
        placeholder={placeholder}
        className="w-80 md:w-72 lg:w-96 h-9 rounded-md text-black p-2"
        {...register}
      />
      {error && (
        <span className="text-red-500 xl:text-sm text-md font-semibold ml-1">
          {error.message}
        </span>
      )}
    </div>
  )
}
