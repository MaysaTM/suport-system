export const ClienteCreateDTO = {
  fromForm: (formData) => {
    const isPessoaFisica = formData.tipo === 'PESSOA_FISICA';
    
    return {
      nomeCompleto: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      tipo: formData.tipo, 
      [isPessoaFisica ? 'cpf' : 'cnpj']: formData.documento?.replace(/\D/g, '') || '',
      status: formData.status || 'ATIVO',
      dataCadastro: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString()
    };
  }
};

export const ClienteResponseDTO = {
  toForm: (apiData) => {
    const isPessoaFisica = apiData.tipo === 'PESSOA_FISICA'; 
    return {
      nome: apiData.nomeCompleto,
      email: apiData.email,
      telefone: apiData.telefone,
      tipo: apiData.tipo, 
      documento: isPessoaFisica ? apiData.cpf : apiData.cnpj,
      status: apiData.status,
      dataCadastro: apiData.dataCadastro,
      dataAtualizacao: apiData.dataAtualizacao
    };
  }
};