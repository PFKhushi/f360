interface InputTextProps {
  label: string
  children: React.ReactNode
}

export default function InputText({ label, children }: InputTextProps) {
  return (
    <div>
      <p className="font-bold text-xl md:text-2xl mb-3">{label}</p>
      <select className="w-80 md:w-72 lg:w-96 h-9 rounded-md text-gray-800 p-2">
        {children}
      </select>
    </div>
  )
}
