import * as yup from 'yup';

export const clienteSchema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório').min(3, 'Mínimo 3 caracteres'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  telefone: yup.string()
    .required('Telefone é obrigatório')
    .matches(/^[0-9]+$/, 'Apenas números')
    .min(10, 'Mínimo 10 dígitos')
});

export const ticketSchema = yup.object().shape({
  titulo: yup.string().required('Título é obrigatório'),
  descricao: yup.string().required('Descrição é obrigatória'),
  status: yup.string().required('Status é obrigatório'),
  clienteId: yup.number().required('Cliente é obrigatório')
});