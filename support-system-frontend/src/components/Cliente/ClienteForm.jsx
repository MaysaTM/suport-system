import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Card, Container, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getClienteById, createCliente, updateCliente } from '../../services/clienteService';
import { clienteSchema } from '../../utils/validationSchemas';
import { Formik } from 'formik';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { ClienteCreateDTO, ClienteResponseDTO } from '../../dtos/clienteDTO';
import './ClienteForm.scss';

const ClienteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialValues, setInitialValues] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipo: 'PESSOA_FISICA',
    documento: '',
    status: 'ATIVO'
  });

  useEffect(() => {
    if (id) {
      const fetchCliente = async () => {
        try {
          setLoading(true);
          const cliente = await getClienteById(id);
          const formData = ClienteResponseDTO.toForm(cliente);
          setInitialValues(formData);
        } catch (err) {
          setError(err.message || 'Erro ao carregar cliente');
        } finally {
          setLoading(false);
        }
      };
      fetchCliente();
    }
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      
      const clienteData = ClienteCreateDTO.fromForm(values);
      
      if (id) {
        await updateCliente(id, clienteData);
        navigate(`/clientes/${id}`, { state: { success: 'Cliente atualizado com sucesso' } });
      } else {
        await createCliente(clienteData);
        navigate('/clientes', { state: { success: 'Cliente cadastrado com sucesso' } });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erro ao salvar cliente');
    } finally {
      setLoading(false);
    }
  };

  const formatTelefone = (value = '') => {
    const nums = value.replace(/\D/g, '');
    if (nums.length <= 10) {
      return nums.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return nums.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatDocumento = (value = '', tipo) => {
    if (!value) return '';
    const nums = value.replace(/\D/g, '');
    
    if (tipo === 'PESSOA_FISICA') {
      return nums.length === 11 
        ? nums.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        : nums;
    }
    
    return nums.length === 14
      ? nums.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
      : nums;
  };

  return (
    <Container className="py-4">
      <Button 
        variant="link" 
        onClick={() => navigate(-1)} 
        className="mb-3 d-flex align-items-center gap-2 text-secondary"
      >
        <FiArrowLeft /> Voltar
      </Button>
      
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <h2 className="mb-0 fs-4 fw-semibold">
            {id ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
          </h2>
        </Card.Header>
        
        <Card.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          <Formik
            initialValues={initialValues}
            validationSchema={clienteSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ 
              handleSubmit, 
              handleChange, 
              handleBlur,
              values, 
              errors, 
              touched,
              setFieldValue,
              isValid,
              dirty
            }) => (
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="nome">
                      <Form.Label>Nome completo/Razão Social</Form.Label>
                      <Form.Control
                        type="text"
                        name="nome"
                        value={values.nome}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.nome && !!errors.nome}
                        placeholder="Digite o nome completo ou razão social"
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nome}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                 <Col md={6}>
                  <Form.Group controlId="email">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={(touched.email && !!errors.email) || error?.includes('e-mail já está cadastrado')}
                      placeholder="exemplo@dominio.com"
                      disabled={loading}
                    />
                    <Form.Control.Feedback type="invalid">
                      {error?.includes('e-mail já está cadastrado') 
                        ? 'Este e-mail já está em uso' 
                        : errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                  
                  <Col md={6}>
                    <Form.Group controlId="telefone">
                      <Form.Label>Telefone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefone"
                        value={formatTelefone(values.telefone)}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/\D/g, '');
                          setFieldValue('telefone', rawValue);
                        }}
                        onBlur={handleBlur}
                        isInvalid={touched.telefone && !!errors.telefone}
                        placeholder="(00) 00000-0000"
                        disabled={loading}
                        maxLength={15}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.telefone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group controlId="tipo">
                      <Form.Label>Tipo de Cliente</Form.Label>
                      <div className="d-flex gap-3">
                        <Form.Check
                          type="radio"
                          id="PESSOA_FISICA"
                          name="tipo"
                          label="Pessoa Física"
                          value="PESSOA_FISICA"
                          checked={values.tipo === 'PESSOA_FISICA'}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          inline
                          disabled={loading}
                        />
                        <Form.Check
                          type="radio"
                          id="PESSOA_JURIDICA"
                          name="tipo"
                          label="Pessoa Jurídica"
                          value="PESSOA_JURIDICA"
                          checked={values.tipo === 'PESSOA_JURIDICA'}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          inline
                          disabled={loading}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group controlId="documento">
                      <Form.Label>
                        {values.tipo === 'PESSOA_FISICA' ? 'CPF' : 'CNPJ'}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="documento"
                        value={formatDocumento(values.documento, values.tipo)}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/\D/g, '');
                          setFieldValue('documento', rawValue);
                        }}
                        onBlur={handleBlur}
                        isInvalid={touched.documento && !!errors.documento}
                        placeholder={values.tipo === 'PESSOA_FISICA' ? '000.000.000-00' : '00.000.000/0000-00'}
                        disabled={loading}
                        maxLength={values.tipo === 'PESSOA_FISICA' ? 14 : 18}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.documento}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {id && (
                    <Col md={6}>
                      <Form.Group controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          name="status"
                          value={values.status}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={loading}
                        >
                          <option value="ATIVO">Ativo</option>
                          <option value="INATIVO">Inativo</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  )}
                </Row>
                
                <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate(id ? `/clientes/${id}` : '/clientes')}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={loading || !isValid || (!dirty && id)}
                    className="d-flex align-items-center gap-2"
                  >
                    {loading ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      <>
                        <FiSave /> {id ? 'Atualizar' : 'Salvar'}
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClienteForm;