"use client";
import { DialogTitle } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { PostData } from "@/services/axios";
import {
  createUserFormSchema,
  CreateUserFormSchemaType,
} from "./createUserForm";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import InputText from "../../Inputs/InputText";
import InputSelect from "../../Inputs/InputSelect";

interface UpdateModalProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  userRefetch: () => void;
}

export default function CreateUser({
  setIsOpen,
  userRefetch,
}: UpdateModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateUserFormSchemaType>({
    resolver: zodResolver(createUserFormSchema),
  });

  function closeModal() {
    setIsOpen(false);
  }

  const onSubmit = (data: CreateUserFormSchemaType) => {
    PostData({
      url: `/usuario/usuarios`,
      data: { ...data },
      onSuccess: (response) => {
        console.log("Usuário criado com sucesso", response);
      },
      onError: (err) => {
        console.error("Erro ao criar usuário", err);
      },
    });
  };

  /* const onSubmit = async (data: CreateUserFormSchemaType) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/usuario/usuarios/`,
        {
          nome: data.nome,
          periodo: parseInt(data.periodo),
          cargo: data.cargo,
          setor: data.setor,
          rgm: data.rgm,
          username: data.username,
          email_institucional: data.email_institucional,
          telefone: data.telefone,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      userRefetch();
      toast.success("O Usuário cadastrado com sucesso:", response.data);
    } catch (error) {
      toast.error("Erro ao cadastrar o usuário");
      console.error(error);
    }
  };*/
  console.log(errors);
  return (
    <div>
      <DialogTitle>
        <div className="text-end text-lg font-medium leading-6 text-light-grey absolute right-4 top-4">
          <button
            type="button"
            className="mx-4 sm:mr-6 mt-7 2xl:mr-10 2xl:mt-10 inline-flex justify-center rounded-md border border-transparent bg-light-grey px-4 py-2 text-sm font-bold text-dark-purple hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={closeModal}
          >
            X
          </button>
        </div>
      </DialogTitle>
      <div className="flex mt-2">
        <div className="mx-auto sm:px-2 lg:py-2">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 mt-28 text-start md:flex md:flex-row items-center gap-x-10">
              <h2 className="max-[420px]:text-2xl font-semibold py-5 text-white text-3xl md:text-4xl -mt-10 md:-mt-20">
                Criar novo usuário
              </h2>
            </div>

            <div className="rounded-x relative mt-1 w-full">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-1">
                  <InputText
                    label="Nome"
                    placeholder="Digite o nome do usuário"
                    type="text"
                    error={errors.nome}
                    register={register("nome")}
                  />
                  <InputSelect
                    label="Periodo"
                    register={register("periodo")}
                    error={errors.periodo}
                  >
                    <option value="">Nenhum</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </InputSelect>
                  <InputSelect
                    label="Cargo"
                    register={register("cargo")}
                    error={errors.cargo}
                  >
                    <option value="">Nenhum</option>
                    <option value="GESTOR">Gestor</option>
                    <option value="IMERSIONISTA">Imersionista</option>
                    <option value="NOVATO">Novato</option>
                    <option value="TECH_LEADER">Tech Leader</option>
                    <option value="VETERANO">Veterano</option>
                  </InputSelect>
                  <InputSelect
                    label="Setor"
                    register={register("setor")}
                    error={errors.setor}
                  >
                    <option value="">Nenhum</option>
                    <option value="GESTAO">Gestão</option>
                    <option value="BACK">Back-end</option>
                    <option value="DADOS">Dados</option>
                    <option value="DEVOPS">DevOps</option>
                    <option value="FRONT">Front-end</option>
                    <option value="IA">Inteligência Artificial</option>
                    <option value="JOGOS">Jogos</option>
                    <option value="MOBILE">Mobile</option>
                    <option value="PO">Product Owner</option>
                    <option value="QA">Quality Assurance</option>
                    <option value="UIUX">UI/UX</option>
                  </InputSelect>
                  <InputText
                    label="RGM"
                    placeholder="Digite o RGM do usuário"
                    type="text"
                    error={errors.rgm}
                    register={register("rgm")}
                  />
                  <InputText
                    label="E-mail"
                    placeholder="Digite o E-mail do usuário"
                    type="email"
                    error={errors.username}
                    register={register("username")}
                  />
                  <InputText
                    label="E-mail Institucional"
                    placeholder="Digite o E-mail Instituicional do usuário"
                    type="email"
                    error={errors.email_institucional}
                    register={register("email_institucional")}
                  />
                  <InputText
                    label="Telefone"
                    placeholder="Digite o Telefone do usuário"
                    type="text"
                    error={errors.telefone}
                    register={register("telefone")}
                  />
                </div>
                <button
                  type="submit"
                  className="mt-5 bg-white py-5 px-12 xl:px-20 text-xl whitespace-nowrap text-light-purple font-extrabold rounded-md shadow-md hover:text-white hover:bg-yellow-400 active:bg-yellow-500 duration-200"
                >
                  CADASTRAR USUÁRIO
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
