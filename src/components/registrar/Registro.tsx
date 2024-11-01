"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegistroFormSchemaType,
  registroFormSchema,
} from "./registerFormSchema";
import Image from "next/image";
import InputText from "../Inputs/InputText";

export default function Registro() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistroFormSchemaType>({
    resolver: zodResolver(registroFormSchema),
  });

  const onSubmit = async (data: RegistroFormSchemaType) => {};

  return (
    <div>
      <div className="flex flex-col gap-8 justify-center items-center p-8">
        <Image
          src="/img/LOGO-ROXA-LETREIRO-HORIZONTAL1.png"
          alt="LOGO"
          width={400}
          height={147}
          className=""
        />
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 p-2 mt-4 items-center">
          <InputText
            label="Nome Completo"
            placeholder="Digite seu nome completo"
            type="text"
            error={errors.nomeCompleto}
            {...register("nomeCompleto")}
          />
          <InputText
            label="Email"
            placeholder="Digite seu email"
            type="email"
            error={errors.email}
            {...register("email")}
          />
          <button className=" bg-white p-3 mt-4 text-light-purple font-extrabold rounded-md w-2/3 flex justify-center ">
            CADASTRE-SE
          </button>
        </form>
      </div>
    </div>
  );
}
