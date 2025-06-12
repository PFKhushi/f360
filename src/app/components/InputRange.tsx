import { UseFormRegisterReturn } from "react-hook-form";

type InputRangeProps = {
  id: string,
  max: number,
  min: number,
  step: number,
  initialValue: number,
  register: UseFormRegisterReturn,
  className?: string
}

export default function InputRange({ id, max, min, step, initialValue = 0, register, className }: InputRangeProps) {
  return (
    <input
      id={id}
      type="range"
      step={step}
      min={min}
      max={max}
      value={initialValue}
      {...register}
      className={
        `appearance-none w-full mt-2 h-2 rounded-2xl cursor-pointer bg-white
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:h-4
        [&::-webkit-slider-thumb]:w-4
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-[#2C2C2C]
        [&::-moz-range-thumb]:bg-[#2C2C2C]
        [&::-moz-range-thumb]:rounded-full
        ${className}`
      }
    />
  );
}
