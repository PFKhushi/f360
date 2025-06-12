import { useForm } from "react-hook-form"
import SelectField from "./SelectField"
import ModalBase from "./shared/ModalBase"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import InputField from "./InputField"
import Checkbox from "./Checkbox"
import { MessageService } from "../services/message/MessageService"
import InputRange from "./InputRange"

type ModalFormProps = {
  openModal: boolean,
  setOpenModal: (open: boolean) => void
}

const modalFormschema = z.object({
  area1: z
    .string()
    .min(1, { message: 'Selecione uma área' }),
  area2: z
    .string()
    .min(1, { message: 'Selecione uma área' }),
  outro: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'}),

  nivel1: z.number(),
  nivel2: z.number(),

  js: z.boolean(),
  ts: z.boolean(),
  django: z.boolean(),
  react: z.boolean(),
  springboot: z.boolean(),
  next: z.boolean()
})

type ModalFormschema = z.infer<typeof modalFormschema>

export default function ModalForm({ openModal, setOpenModal }: ModalFormProps) {

  const{
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ModalFormschema>({
    resolver: zodResolver(modalFormschema),
  });

  const resetData = () => {
    reset({
      area1: '',
      area2: '',
      outro: '',
      nivel1: 0,
      nivel2: 0,
      js: false,
      ts: false,
      django: false,
      react: false,
      springboot: false,
      next: false
    });
  }

  const successMessage = () => {
    const message = new MessageService()
    message.success('Inscrição realizada com sucesso!')
  }

  const handleImmersion = (data: ModalFormschema) => {
    console.log("Dados: ", data)
    setOpenModal(false)
    successMessage()
    resetData()
  }

  return (
    <div>
      <ModalBase
        openModal={openModal}
        setOpenModal={setOpenModal}
        className='w-[500px] pt-3 rounded-[10px] bg-[#2C2C2C] text-white'
        viewCloseButton={true}
      >
        <form onSubmit={handleSubmit(handleImmersion)} className='px-10 flex flex-col items-center gap-4.5 text-[18px]'>
          <div className='w-62'>
            <picture>
              <img
                src="images/logos/branca-com-preenchimento/branco-com-preenchimento-letreiro-horizontal.png"
                alt="Logo Fábrica de Software"
                className='w-full h-full object-contain' 
              />
            </picture>
          </div>
          <p className='font-louis-george-cafe'>Venha participar do processo imersionista</p>
          <div className='bg-white h-[1px] w-full my-[-7px]'/>

          <div className="flex w-full justify-between pt-2">
            <div className="w-[49%]">
              <label className="font-[500]">1° opção de área</label>
              <div className="pt-4.5">
                <SelectField
                  className={`peer-focus:bg-[#2C2C2C] bg-[#2C2C2C] ${!watch().area1 && "bg-transparent"}`}
                  id = "area1"
                  label="Áreas de TI"
                  register={register('area1')}
                  error = {errors.area1}
                  isInvalidOption={!watch().area1}
                  defaultValue = ""
                  options = {[
                    {value: "front", label: "Front-end"},
                    {value: "back", label: "Back-end"},
                    {value: "AD", label: "Análise de Dados"},
                    {value: "jogos", label: "Jogos"},
                    {value: "mobile", label: "Mobile"},
                    {value: "PO", label: "Product Owner"},
                    {value: "QA", label: "QA"}
                  ]}
                />
              </div>
            </div>

            <div className="w-[49%]">
              <label className="font-[500]">2° opção de área</label>
              <div className="pt-4.5">
                <SelectField
                  className={`peer-focus:bg-[#2C2C2C] bg-[#2C2C2C] ${!watch().area2 && "bg-transparent"}`}
                  id = "area2"
                  label="Áreas de TI"
                  register={register('area2')}
                  error = {errors.area2}
                  isInvalidOption={!watch().area2}
                  defaultValue = ""
                  options = {[
                    {value: "front", label: "Front-end"},
                    {value: "back", label: "Back-end"},
                    {value: "AD", label: "Análise de Dados"},
                    {value: "jogos", label: "Jogos"},
                    {value: "mobile", label: "Mobile"},
                    {value: "PO", label: "Product Owner"},
                    {value: "QA", label: "QA"}
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between w-full">
            <div className="w-[46%]">
              <div className="flex justify-between">
                <label className="font-[500]">Nível (1° opção)</label>
                <p className="text-[11px]">{watch().nivel1 ? watch().nivel1 : 0}-4</p>
              </div>
              <InputRange
                id="nivel1"
                max={4}
                min={0}
                step={1}
                initialValue={watch().nivel1}
                register={register("nivel1", { valueAsNumber: true })}
              />
              <p className="w-full px-1 flex justify-between text-[13px]"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span></p>
            </div>

            <div className="w-[46%]">
              <div className="flex justify-between">
                <label className="font-[500]">Nível (2° opção)</label>
                <p className="text-[11px]">{watch().nivel2 ? watch().nivel2 : 0}-4</p>
              </div>
              <InputRange
                id="nivel2"
                max={4}
                min={0}
                step={1}
                initialValue={watch().nivel2}
                register={register("nivel2", { valueAsNumber: true })}
              />
              <p className="w-full px-1 flex justify-between text-[13px]"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span></p>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-start w-full">
            <label className="pl-1 font-[500]">Tecnologias:</label>
            
            <div className="flex w-full">
              <Checkbox
                id="js" 
                label="JavaScript" 
                checked={watch().js}  
                register={register('js')}
                className="w-[53%]"
              />

              <Checkbox
                id="ts" 
                label="TypeScript" 
                checked={watch().ts}  
                register={register('ts')}
              />
            </div>

            <div className="flex w-full">
              <Checkbox
                id="django" 
                label="Django (Python)" 
                checked={watch().django}  
                register={register('django')}
                className="w-[53%]"
              />

              <Checkbox
                id="react" 
                label="React (Javascript)" 
                checked={watch().react}  
                register={register('react')}
              />
            </div>

            <div className="flex w-full">
              <Checkbox
                id="springboot" 
                label="SpringBoot (Java)" 
                checked={watch().springboot}  
                register={register('springboot')}
                className="w-[53%]"
              />

              <Checkbox
                id="next" 
                label="Next.js" 
                checked={watch().next}  
                register={register('next')}
              />
            </div>

          </div>

          <div className="w-full mt-1">
            <InputField
              id="outro"
              type="text"
              label="Outras Tecnologias"
              register={register('outro')}
              className=" peer-focus:bg-[#2C2C2C] bg-[#2C2C2C]"
              error={errors.outro}
            />
          </div>
          
          <button
            type="submit"
            className='py-3 px-4 rounded-[13px] text-[16px] bg-secondary-2 hover:bg-secondary-1 cursor-pointer'
          >
            Inscrever-se
          </button>

        </form>
      </ModalBase>
      </div>
  )
}
