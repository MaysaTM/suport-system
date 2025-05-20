import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Card, Container, Spinner, Alert, Badge, Tab, Tabs } from 'react-bootstrap';
import { 
  FiArrowLeft, FiEdit, FiTrash2, FiUser, FiBriefcase, FiActivity,
  FiAlertCircle, FiCheckCircle, FiClock 
} from 'react-icons/fi';
import { getClienteCompleto, deleteCliente } from '../../services/clienteService';
import { ClienteDetalhadoDTO } from '../../dtos/clienteDetalhadoDTO';
import './ClienteView.scss';

const statusBadges = {
  ABERTO: { text: 'Aberto', variant: 'warning', icon: <FiAlertCircle /> },
  EM_ANDAMENTO: { text: 'Em Andamento', variant: 'primary', icon: <FiClock /> },
  RESOLVIDO: { text: 'Resolvido', variant: 'success', icon: <FiCheckCircle /> },
  FECHADO: { text: 'Fechado', variant: 'secondary', icon: <FiCheckCircle /> }
};

const priorityBadges = {
  BAIXA: { text: 'Baixa', variant: 'info' },
  MEDIA: { text: 'Média', variant: 'primary' },
  ALTA: { text: 'Alta', variant: 'warning' },
  URGENTE: { text: 'Urgente', variant: 'danger' }
};

const ClienteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('detalhes');

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        setLoading(true);
        const data = await getClienteCompleto(id);
        setCliente(new ClienteDetalhadoDTO(data));
        setError(null);
      } catch (err) {
        setError(err.message || 'Erro ao carregar cliente');
        setCliente(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente "${cliente?.nomeCompleto}"?`)) {
      try {
        setLoading(true);
        await deleteCliente(id);
        navigate('/clientes', { state: { success: 'Cliente excluído com sucesso' } });
      } catch (err) {
        setError(err.message || 'Erro ao excluir cliente');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="outline-primary" onClick={() => navigate('/clientes')}>
          Voltar para lista de clientes
        </Button>
      </Container>
    );
  }

  if (!cliente) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">Cliente não encontrado</Alert>
        <Button variant="outline-primary" onClick={() => navigate('/clientes')}>
          Voltar para lista de clientes
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button 
        variant="link" 
        onClick={() => navigate(-1)} 
        className="mb-3 d-flex align-items-center gap-2 text-secondary"
      >
        <FiArrowLeft /> Voltar
      </Button>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fs-4 fw-semibold">
          {cliente.nomeCompleto}
        </h2>
        <div className="d-flex gap-2">
          <Button
            variant="outline-danger"
            onClick={handleDelete}
            className="d-flex align-items-center gap-2"
          >
            <FiTrash2 /> Excluir
          </Button>
          <Button
            as={Link}
            to={`/clientes/${id}/editar`}
            variant="primary"
            className="d-flex align-items-center gap-2"
          >
            <FiEdit /> Editar
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="detalhes" title="Detalhes">
              <div className="row mt-3">
                <div className="col-md-8">
                  <div className="mb-4">
                    <h4 className="fs-6 fw-semibold mb-3">Informações Básicas</h4>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="small text-muted mb-1">E-mail</div>
                        <div>{cliente.email}</div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="small text-muted mb-1">Telefone</div>
                        <div>{cliente.telefone}</div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <Badge bg={cliente.tipoCliente === 'PESSOA_FISICA' ? 'info' : 'primary'}>
                          {cliente.tipoCliente === 'PESSOA_FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </Badge>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="small text-muted mb-1">Status</div>
                        <Badge bg={cliente.status === 'ATIVO' ? 'success' : 'secondary'}>
                          {cliente.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <div className="col-12 mb-3">
                        <div className="small text-muted mb-1">Documento ({cliente.tipoDocumento})</div>
                        <div>{cliente.documento}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="fs-6 fw-semibold mb-3">Histórico</h4>
                    <div className="border-start ps-3">
                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <strong>Cadastrado em</strong>
                          <span className="text-muted small">
                            {new Date(cliente.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <strong>Última atualização</strong>
                          <span className="text-muted small">
                            {new Date(cliente.updatedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="bg-light p-4 rounded">
                    <h4 className="fs-6 fw-semibold mb-3">Estatísticas</h4>
                    <ul className="list-unstyled">
                      <li className="mb-3 pb-2 border-bottom">
                        <div className="small text-muted mb-1">Total de Tickets</div>
                        <div className="fs-5 fw-bold">{cliente.quantidadeTickets}</div>
                      </li>
                      <li className="mb-3 pb-2 border-bottom">
                        <div className="small text-muted mb-1">Tickets Abertos</div>
                        <div className="fs-5 fw-bold">{cliente.ticketsAbertos}</div>
                      </li>
                    </ul>

                    {cliente.ultimosTickets.length > 0 && (
                      <>
                        <h4 className="fs-6 fw-semibold mb-3 mt-4">Últimos Tickets</h4>
                        <div className="list-group">
                          {cliente.ultimosTickets.map(ticket => (
                            <Link 
                              key={ticket.id} 
                              to={`/tickets/${ticket.id}`}
                              className="list-group-item list-group-item-action"
                            >
                              <div className="d-flex justify-content-between">
                                <span>{ticket.titulo}</span>
                                <Badge bg={statusBadges[ticket.status]?.variant}>
                                  {statusBadges[ticket.status]?.text}
                                </Badge>
                              </div>
                              <small className="text-muted">
                                {new Date(ticket.dataAbertura).toLocaleDateString()}
                              </small>
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Tab>

            <Tab eventKey="tickets" title="Tickets">
              <div className="mt-3">
                <h4 className="fs-6 fw-semibold mb-3">Todos os Tickets</h4>
                {cliente.quantidadeTickets > 0 ? (
                  <div className="list-group">
                    {/* Lista completa de tickets seria implementada aqui */}
                  </div>
                ) : (
                  <div className="text-center py-5 text-muted">
                    Nenhum ticket encontrado para este cliente
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClienteView;