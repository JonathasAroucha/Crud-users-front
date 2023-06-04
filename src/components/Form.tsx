import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

export interface User {
  id: number;
  nome: string;
  email: string;
  fone: string;
  data_nascimento: string;
}

interface FormProps {
  getUsers: () => void;
  onEdit: User | null;
  setOnEdit: (user: User | null) => void;
}

const FormContainer = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 10px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
`;

const InputArea = styled.div`
 display: flex;
  flex-direction: column;
`;

const Input = styled.input`
    width: 120%;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
`;

const Label = styled.label`
  // estilo omitido para maior clareza
`;

const Button = styled.button`
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #2c73d2;
  color: white;
  height: 42px;
`;

const Form: React.FC<FormProps> = ({ getUsers, onEdit, setOnEdit }) => {
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (onEdit) {
      const user = ref.current;

      if (user) {
        user.nome.value = onEdit.nome;
        user.email.value = onEdit.email;
        user.fone.value = onEdit.fone;
        user.data_nascimento.value = onEdit.data_nascimento;
      }
    }
  }, [onEdit]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = ref.current;

    if (!user) return;

    if (
      !user.nome.value ||
      !user.email.value ||
      !user.fone.value ||
      !user.data_nascimento.value
    ) {
      return toast.warn("Preencha todos os campos!");
    }

    if (onEdit) {
      await axios
        .put(`http://localhost:8080/${onEdit.id}`, {
          nome: user.nome.value,
          email: user.email.value,
          fone: user.fone.value,
          data_nascimento: user.data_nascimento.value,
        })
        .then(({ data }) => toast.success(data))
        .catch((error: AxiosError) => toast.error(String(error.response?.data)));
    } else {
      await axios
        .post("http://localhost:8080/", {
          nome: user.nome.value,
          email: user.email.value,
          fone: user.fone.value,
          data_nascimento: user.data_nascimento.value,
        })
        .then(({ data }) => toast.success(data))
        .catch((error: AxiosError) => toast.error(String(error.response?.data)));
    }

    if (user) {
      user.nome.value = "";
      user.email.value = "";
      user.fone.value = "";
      user.data_nascimento.value = "";
    }

    setOnEdit(null);
    getUsers();
  };

  return (
    <FormContainer ref={ref} onSubmit={handleSubmit}>
      <InputArea>
        <Label>Nome</Label>
        <Input name="nome" />
      </InputArea>
      <InputArea>
        <Label>E-mail</Label>
        <Input name="email" type="email" />
      </InputArea>
      <InputArea>
        <Label>Telefone</Label>
        <Input name="fone" />
      </InputArea>
      <InputArea>
        <Label>Data de Nascimento</Label>
        <Input name="data_nascimento" type="date" />
      </InputArea>

      <Button type="submit">SALVAR</Button>
    </FormContainer>
  );
};

export default Form;
