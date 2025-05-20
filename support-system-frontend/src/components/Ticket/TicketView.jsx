import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Card, Container, Spinner, Alert, Badge, Tab, Tabs } from 'react-bootstrap';
import { FiArrowLeft, FiEdit, FiTrash2, FiAlertCircle, FiCheckCircle, FiClock, FiUser } from 'react-icons/fi';
import { getTicketById, deleteTicket } from '../../services/ticketService';
import './TicketView.scss';

const statusBadges = {
  ABERTO: { text: 'Aberto', variant: 'warning', icon: <FiAlertCircle /> },
  EM_ANDAMENTO: { text: 'Em Andamento', variant: 'primary', icon: <FiClock /> },
  RESOLVIDO: { text: 'Resolvido', variant: 'success', icon: <FiCheckCircle /> },
  FECHADO: { text: 'Fechado', variant: 'secondary', icon: <FiCheckCircle /> }
};

const priorityBadges = {
  baixa: { text: 'Baixa', variant: 'info' },
  media: { text: 'Média', variant: 'primary' },
  alta: { text: 'Alta', variant: 'warning' },
  urgente: { text: 'Urgente', variant: 'danger' }
};

const TicketView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('detalhes');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const data = await getTicketById(id);
        setTicket(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir o ticket "${ticket?.titulo}"?`)) {
      try {
        await deleteTicket(id);
        navigate('/tickets');
      } catch (err) {
        setError(err.message);
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
        <Button variant="outline-primary" onClick={() => navigate('/tickets')}>
          Voltar para lista de tickets
        </Button>
      </Container>
    );
  }

  if (!ticket) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">Ticket não encontrado</Alert>
        <Button variant="outline-primary" onClick={() => navigate('/tickets')}>
          Voltar para lista de tickets
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
          Ticket #{ticket.id}: {ticket.titulo}
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
            to={`/tickets/${id}/editar`}
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
                    <h4 className="fs-6 fw-semibold mb-3">Descrição</h4>
                    <div className="bg-light p-4 rounded">
                      {ticket.descricao || <span className="text-muted">Nenhuma descrição fornecida</span>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="fs-6 fw-semibold mb-3">Histórico</h4>
                    <div className="border-start ps-3">
                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <strong>Criado em</strong>
                          <span className="text-muted small">
                            {new Date(ticket.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="small text-muted">Por: Sistema</div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <strong>Última atualização</strong>
                          <span className="text-muted small">
                            {new Date(ticket.updatedAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="small text-muted">Por: Sistema</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="bg-light p-4 rounded">
                    <h4 className="fs-6 fw-semibold mb-3">Informações</h4>
                    <ul className="list-unstyled">
                      <li className="mb-3 pb-2 border-bottom">
                        <div className="small text-muted mb-1">Status</div>
                        <Badge bg={statusBadges[ticket.status]?.variant || 'secondary'} className="d-flex align-items-center gap-1">
                          {statusBadges[ticket.status]?.icon}
                          {statusBadges[ticket.status]?.text || ticket.status}
                        </Badge>
                      </li>
                      <li className="mb-3 pb-2 border-bottom">
                        <div className="small text-muted mb-1">Prioridade</div>
                        <Badge bg={priorityBadges[ticket.prioridade]?.variant || 'secondary'}>
                          {priorityBadges[ticket.prioridade]?.text || ticket.prioridade}
                        </Badge>
                      </li>
                      <li className="mb-3 pb-2 border-bottom">
                        <div className="small text-muted mb-1">Categoria</div>
                        <div className="text-capitalize">{ticket.categoria}</div>
                      </li>
                      <li className="mb-3 pb-2 border-bottom">
                        <div className="small text-muted mb-1">Cliente</div>
                        <Link to={`/clientes/${ticket.clienteId}`} className="text-decoration-none">
                          {ticket.clienteNome}
                        </Link>
                      </li>
                      <li className="mb-3 pb-2 border-bottom">
                        <div className="small text-muted mb-1">Responsável</div>
                        <div className="d-flex align-items-center gap-2">
                          <FiUser size={16} />
                          {ticket.responsavel || 'Não atribuído'}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Tab>

            <Tab eventKey="comentarios" title="Comentários">
              <div className="mt-3">
                <h4 className="fs-6 fw-semibold mb-3">Comentários</h4>
                <div className="text-center py-5 text-muted">
                  Nenhum comentário encontrado
                </div>
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TicketView;