import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner, Card, Container, FloatingLabel } from 'react-bootstrap';
import { getTicketById, createTicket, updateTicket } from '../../services/ticketService';
import { getClientes } from '../../services/clienteService';
import { ticketSchema } from '../../utils/validationSchemas';
import { Formik } from 'formik';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { TicketCreateDTO } from '../../dtos/ticketDTO';
import './TicketForm.scss';

const statusOptions = [
  { value: 'ABERTO', label: 'Aberto' },
  { value: 'EM_ANDAMENTO', label: 'Em andamento' },
  { value: 'RESOLVIDO', label: 'Resolvido' },
  { value: 'FECHADO', label: 'Fechado' }
];

const priorityOptions = [
  { value: 'BAIXA', label: 'Baixa' },
  { value: 'MEDIA', label: 'Média' },
  { value: 'ALTA', label: 'Alta' },
  { value: 'URGENTE', label: 'Urgente' }
];

const categoryOptions = [
  { value: 'SUPORTE', label: 'Suporte' },
  { value: 'BUG', label: 'Bug' },
  { value: 'MELHORIA', label: 'Melhoria' },
  { value: 'DUVIDA', label: 'Dúvida' }
];

const TicketForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [initialValues, setInitialValues] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'MEDIA',
    status: 'ABERTO',
    categoria: 'SUPORTE',
    clienteId: ''
  });

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await getClientes();
        setClientes(data);
      } catch (err) {
        setError('Erro ao carregar clientes');
      }
    };

    fetchClientes();

    if (id) {
      const fetchTicket = async () => {
        try {
          setLoading(true);
          const ticket = await getTicketById(id);
          setInitialValues({
            titulo: ticket.titulo,
            descricao: ticket.descricao,
            prioridade: ticket.prioridade,
            status: ticket.status,
            categoria: ticket.categoria,
            clienteId: ticket.clienteId?.toString() || ''
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchTicket();
    }
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      const ticketData = TicketCreateDTO.fromForm(values);
      
      if (id) {
        await updateTicket(id, ticketData);
      } else {
        await createTicket(ticketData);
      }
      navigate('/tickets');
    } catch (err) {
      setError(err.message || 'Erro ao salvar ticket');
    } finally {
      setLoading(false);
    }
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
            {id ? 'Editar Ticket' : 'Criar Novo Ticket'}
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
            validationSchema={ticketSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ handleSubmit, handleChange, values, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <FloatingLabel controlId="titulo" label="Título" className="mb-3">
                      <Form.Control
                        type="text"
                        name="titulo"
                        value={values.titulo}
                        onChange={handleChange}
                        isInvalid={touched.titulo && !!errors.titulo}
                        placeholder="Título"
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.titulo}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </div>
                  
                  <div className="col-md-6">
                    <FloatingLabel controlId="clienteId" label="Cliente" className="mb-3">
                      <Form.Select
                        name="clienteId"
                        value={values.clienteId}
                        onChange={handleChange}
                        isInvalid={touched.clienteId && !!errors.clienteId}
                        disabled={loading || clientes.length === 0}
                      >
                        <option value="">Selecione um cliente</option>
                        {clientes.map(cliente => (
                          <option key={cliente.id} value={cliente.id}>
                            {cliente.nomeCompleto}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.clienteId}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </div>
                  
                  <div className="col-md-4">
                    <FloatingLabel controlId="categoria" label="Categoria" className="mb-3">
                      <Form.Select
                        name="categoria"
                        value={values.categoria}
                        onChange={handleChange}
                        isInvalid={touched.categoria && !!errors.categoria}
                        disabled={loading}
                      >
                        {categoryOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </div>
                  
                  <div className="col-md-4">
                    <FloatingLabel controlId="prioridade" label="Prioridade" className="mb-3">
                      <Form.Select
                        name="prioridade"
                        value={values.prioridade}
                        onChange={handleChange}
                        isInvalid={touched.prioridade && !!errors.prioridade}
                        disabled={loading}
                      >
                        {priorityOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </div>
                  
                  <div className="col-md-4">
                    <FloatingLabel controlId="status" label="Status" className="mb-3">
                      <Form.Select
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        isInvalid={touched.status && !!errors.status}
                        disabled={loading && !id}
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </div>
                  
                  <div className="col-12">
                    <FloatingLabel controlId="descricao" label="Descrição" className="mb-3">
                      <Form.Control
                        as="textarea"
                        name="descricao"
                        value={values.descricao}
                        onChange={handleChange}
                        isInvalid={touched.descricao && !!errors.descricao}
                        placeholder="Descreva o problema ou solicitação"
                        style={{ height: '150px' }}
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.descricao}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </div>
                </div>
                
                <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/tickets')}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={loading}
                    className="d-flex align-items-center gap-2"
                  >
                    {loading ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      <>
                        <FiSave /> Salvar
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

export default TicketForm;