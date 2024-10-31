'use client'
import { z } from 'zod';
import Image from 'next/image';
import InputText from '../Inputs/InputText';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    inputRGM: z.string().length(8, 'É necessário que o RGM contenha 8 dígitos.'),
    inputCurso: z.string().max(100,'É necessário que contenha no máximo 100 digitos').min(2,"Verifique o campo "),
    inputTelefone: z.string().max(17,'É necessário que contenha no máximo 17 digitos').min(8,"Verifique o campo"),
    inputCPF: z.string().length(11,'É necessário que o CPF contenha 11 dígitos.')

});

type FormProps = z.infer<typeof schema>

export default function AtualizarCadastro() {

    const { 
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormProps>({
        mode: 'all',
        resolver: zodResolver(schema)
    });

    console.log(errors)
  


    const handleForm = (data: FormProps) => {
        console.log(data);
    };

    return (
        <div className="pb-12">
          <form onSubmit={handleSubmit(handleForm)}>
            <div className="pt-8">
                <Image
                    src="/img/LOGO-ROXA-LETREIRO-HORIZONTAL1.png"
                    alt="Logo"
                    width={320}
                    height={147}
                    className="m-auto mt-8"
                />
             </div>
             <div className='flex flex-col md:flex-row justify-center items-center md:space-x-12 mt-14 space-y-16 md:space-y-0'>
                <div>
                  <InputText
                      label="RGM"
                      placeholder="Insira seu RGM"
                      type="text" 
                      register={register('inputRGM')} 
                  />
                  {errors.inputRGM?.message && <p className='mt-3 text-center text-red-700'>{errors.inputRGM.message}</p>}
              </div>
                <div>
                  <InputText
                    label="CPF"
                    placeholder="Insira seu CPF"
                    type="text"
                    register={register('inputCPF')}
                  />
                  {errors.inputCPF?.message && <p className='mt-3 text-center  text-red-700'>{errors.inputCPF.message}</p>}
                </div> 
            </div>
            <div className='flex flex-col md:flex-row justify-center items-center md:space-x-12 mt-14 space-y-16 md:space-y-0'>
               <div>
                  <InputText
                    label="Telefone"
                    placeholder="Insira seu telefone"
                    type="text"
                    register={register('inputTelefone')}
                  />
                  {errors.inputTelefone?.message && <p className='mt-3 text-center  text-red-700'>{errors.inputTelefone?.message}</p>}
               </div>
               <div>
                  <InputText
                     label="Curso"
                     placeholder="Insira seu Curso"
                     type="text"
                     register={register('inputCurso')}
                  />
                  {errors.inputCurso?.message && <p className='mt-3 text-center  text-red-700'>{errors.inputCurso.message}</p>}
                </div>   
            </div>
            <button type="submit" className="text-secondary font-bold text-xl bg-light-grey flex items-center justify-center m-auto p-4 rounded-md mt-28 md:w-60">
               ATUALIZAR
            </button>
          </form>
        </div>
    );
}
