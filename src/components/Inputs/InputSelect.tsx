/* eslint-disable @typescript-eslint/no-explicit-any */

interface InputTextProps {
  label: string
  children: React.ReactNode
  valueDefault?: string
  register: any
  error?: any
}

export default function InputText({
  label,
  children,
  valueDefault,
  register,
  error,
}: InputTextProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-bold text-xl md:text-2xl">{label}</p>
      <select
        className="w-64 md:w-72 lg:w-96 h-9 rounded-md text-gray-800 p-2 font-semibold"
        defaultValue={valueDefault}
        {...register}
      >
        {children}
      </select>
      {error && (
        <span className="text-red-500 xl:text-sm text-md font-semibold ml-1">
          {error.message}
        </span>
      )}
    </div>
  )
}
