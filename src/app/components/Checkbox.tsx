import { UseFormRegisterReturn } from "react-hook-form";
import { FaCheck } from "react-icons/fa6";

type CheckboxProps = {
  id: string,
  label: string,
  checked: boolean,
  register: UseFormRegisterReturn,
  className?: string
}

export default function Checkbox({ id, checked = false, register, label, className }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={`flex flex-row items-center gap-2.5 dark:text-white light:text-black ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        className="peer hidden"
        checked={checked}
        {...register}
      />
      <div className="h-5 w-5 flex items-center justify-center rounded-[2px] border border-[#a2a1a851] light:bg-[#e8e8e8] dark:bg-[#2C2C2C] peer-checked:bg-[#6750A4] transition">
        {checked && <FaCheck className="text-white h-3.5 w-3.5" />}
      </div>
      {label}
    </label>
  );
}
