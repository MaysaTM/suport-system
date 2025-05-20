import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Card, Container, Spinner, Alert, Form, Pagination } from 'react-bootstrap';
import { 
  FiPlus, FiSearch, FiAlertCircle, FiCheckCircle, FiClock, 
  FiFilter, FiX, FiCalendar, FiUser, FiTrash2 
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getTickets, deleteTicket, filtrarTickets 
} from '../../services/ticketService';
import { TicketFilterDTO } from '../../dtos/ticketFilterDTO';
import { TicketResponseDTO } from '../../dtos/ticketDTO';
import ConfirmationModal from '../ConfirmationModal';
import './TicketList.scss';

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

const TicketList = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    prioridade: '',
    categoria: '',
    dataInicio: '',
    dataFim: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        const data = await getTickets();
        setTickets(TicketResponseDTO.toList(data));
        setError(null);
      } catch (err) {
        setError(err.message || 'Erro ao carregar tickets');
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };
    loadTickets();
  }, []);

  const handleDeleteClick = (id) => {
    setTicketToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteTicket(ticketToDelete);
      setTickets(prev => prev.filter(t => t.id !== ticketToDelete));
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message || 'Erro ao excluir ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const filterDTO = new TicketFilterDTO(filters);
      const filteredData = await filtrarTickets(filterDTO);
      setTickets(TicketResponseDTO.toList(filteredData));
    } catch (err) {
      setError(err.message || 'Erro ao filtrar tickets');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    try {
      setLoading(true);
      setFilters({
        status: '',
        prioridade: '',
        categoria: '',
        dataInicio: '',
        dataFim: ''
      });
      const data = await getTickets();
      setTickets(TicketResponseDTO.toList(data));
    } catch (err) {
      setError(err.message || 'Erro ao resetar filtros');
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.clienteNome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const LoadingSpinner = () => (
    <div className="d-flex justify-content-center my-5">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-5">
      <FiUser size={48} className="text-muted mb-3" />
      <h5>Nenhum ticket encontrado</h5>
      <p className="text-muted">
        {searchTerm ? 'Tente ajustar sua busca' : 'Crie seu primeiro ticket'}
      </p>
      <Button variant="primary" onClick={() => navigate('/tickets/novo')}>
        <FiPlus /> Criar Ticket
      </Button>
    </div>
  );

  return (
    <Container className="py-4">
      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar exclusão"
        message="Tem certeza que deseja excluir este ticket? Todas as informações associadas serão perdidas."
        confirmText="Excluir Ticket"
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Tickets</h2>
        <Button
          variant="primary"
          onClick={() => navigate('/tickets/novo')}
          className="d-flex align-items-center gap-2"
        >
          <FiPlus /> Novo Ticket
        </Button>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
          <div className="position-relative w-50">
            <FiSearch className="position-absolute top-50 translate-middle-y ms-3" />
            <Form.Control
              type="search"
              placeholder="Buscar tickets..."
              className="ps-5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant={showFilters ? 'secondary' : 'outline-secondary'}
            onClick={() => setShowFilters(!showFilters)}
            className="d-flex align-items-center gap-2"
          >
            {showFilters ? <FiX /> : <FiFilter />}
            {showFilters ? 'Ocultar Filtros' : 'Filtrar'}
          </Button>
        </Card.Header>

        {showFilters && (
          <Card.Body className="border-top">
            <div className="row g-3">
              <div className="col-md-3">
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos os status</option>
                  {Object.entries(statusBadges).map(([value, { text }]) => (
                    <option key={value} value={value}>{text}</option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-md-3">
                <Form.Select
                  name="prioridade"
                  value={filters.prioridade}
                  onChange={handleFilterChange}
                >
                  <option value="">Todas as prioridades</option>
                  {Object.entries(priorityBadges).map(([value, { text }]) => (
                    <option key={value} value={value}>{text}</option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-md-3">
                <Form.Select
                  name="categoria"
                  value={filters.categoria}
                  onChange={handleFilterChange}
                >
                  <option value="">Todas as categorias</option>
                  <option value="SUPORTE">Suporte</option>
                  <option value="BUG">Bug</option>
                  <option value="MELHORIA">Melhoria</option>
                </Form.Select>
              </div>
              <div className="col-md-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <FiCalendar />
                  </span>
                  <Form.Control
                    type="date"
                    name="dataInicio"
                    placeholder="De"
                    value={filters.dataInicio}
                    onChange={handleFilterChange}
                  />
                  <Form.Control
                    type="date"
                    name="dataFim"
                    placeholder="Até"
                    value={filters.dataFim}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
              <div className="col-12 d-flex justify-content-end gap-2">
                <Button variant="outline-secondary" onClick={resetFilters}>
                  Limpar
                </Button>
                <Button variant="primary" onClick={applyFilters}>
                  Aplicar
                </Button>
              </div>
            </div>
          </Card.Body>
        )}
      </Card>

      {loading ? (
        <LoadingSpinner />
      ) : filteredTickets.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <Card className="border-0 shadow-sm">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Título</th>
                    <th>Cliente</th>
                    <th>Status</th>
                    <th>Prioridade</th>
                    <th>Categoria</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>
                        <Link to={`/tickets/${ticket.id}`} className="fw-bold text-decoration-none">
                          {ticket.titulo}
                        </Link>
                        <div className="small text-muted">
                          #{ticket.id} • {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        {ticket.clienteNome && (
                          <Link to={`/clientes/${ticket.clienteId}`} className="text-decoration-none">
                            {ticket.clienteNome}
                          </Link>
                        )}
                      </td>
                      <td>
                        <Badge bg={statusBadges[ticket.status]?.variant} className="d-flex align-items-center gap-1">
                          {statusBadges[ticket.status]?.icon}
                          {statusBadges[ticket.status]?.text}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={priorityBadges[ticket.prioridade]?.variant}>
                          {priorityBadges[ticket.prioridade]?.text}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg="light" text="dark">
                          {ticket.categoria}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          as={Link}
                          to={`/tickets/${ticket.id}`}
                        >
                          Ver
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(ticket.id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.Prev />
              <Pagination.Item active>{1}</Pagination.Item>
              <Pagination.Next />
            </Pagination>
          </div>
        </>
      )}
    </Container>
  );
};

export default TicketList;