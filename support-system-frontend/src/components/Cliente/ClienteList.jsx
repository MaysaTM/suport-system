import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Spinner, Alert, Pagination } from 'react-bootstrap';
import { 
  FiEdit, FiTrash2, FiPlus, FiToggleLeft, FiToggleRight, 
  FiUser, FiBriefcase, FiActivity 
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { 
  getClientes, deleteCliente, toggleStatusCliente 
} from '../../services/clienteService';
import { ClienteDetalhadoDTO } from '../../dtos/clienteDetalhadoDTO';
import ConfirmationModal from '../ConfirmationModal';
import './ClienteList.scss';

const ClienteList = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);

  useEffect(() => {
    const loadClientes = async () => {
      try {
        setLoading(true);
        const data = await getClientes();
        setClientes(data.map(c => new ClienteDetalhadoDTO(c)));
        setError(null);
      } catch (err) {
        setError(err.message || 'Erro ao carregar clientes');
        setClientes([]);
      } finally {
        setLoading(false);
      }
    };
    loadClientes();
  }, []);

  const handleDeleteClick = (id) => {
    setClienteToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteCliente(clienteToDelete);
      setClientes(prev => prev.filter(c => c.id !== clienteToDelete));
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message || 'Erro ao excluir cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      setLoading(true);
      await toggleStatusCliente(id);
      setClientes(prev => prev.map(c => 
        c.id === id ? { ...c, status: c.status === 'ATIVO' ? 'INATIVO' : 'ATIVO' } : c
      ));
    } catch (err) {
      setError(err.message || 'Erro ao alterar status');
    } finally {
      setLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="d-flex justify-content-center my-5">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-5">
      <FiUser size={48} className="text-muted mb-3" />
      <h5>Nenhum cliente cadastrado</h5>
      <p className="text-muted">Comece cadastrando seu primeiro cliente</p>
      <Button variant="primary" onClick={() => navigate('/clientes/novo')}>
        <FiPlus /> Cadastrar Cliente
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
        message="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
        confirmText="Excluir Cliente"
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Clientes</h2>
        <Button
          variant="primary"
          onClick={() => navigate('/clientes/novo')}
          className="d-flex align-items-center gap-2"
        >
          <FiPlus /> Novo Cliente
        </Button>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : clientes.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Documento</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Tickets</th>
                  <th className="text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map(cliente => (
                  <tr key={cliente.id}>
                    <td className="fw-bold">{cliente.nomeCompleto}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.documento}</td>
                    <td>
                      <Badge bg={cliente.tipoCliente === 'PESSOA_FISICA' ? 'info' : 'primary'}>
                        {cliente.tipoCliente === 'PESSOA_FISICA' ? (
                          <><FiUser className="me-1" /> PF</>
                        ) : (
                          <><FiBriefcase className="me-1" /> PJ</>
                        )}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={cliente.status === 'ATIVO' ? 'success' : 'secondary'}>
                        {cliente.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="light" text="dark">
                        <FiActivity className="me-1" />
                        {cliente.quantidadeTickets || 0}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          variant={cliente.status === 'ATIVO' ? 'outline-warning' : 'outline-success'}
                          size="sm"
                          onClick={() => handleToggleStatus(cliente.id)}
                          title={cliente.status === 'ATIVO' ? 'Desativar' : 'Ativar'}
                        >
                          {cliente.status === 'ATIVO' ? <FiToggleLeft /> : <FiToggleRight />}
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/clientes/${cliente.id}/editar`)}
                          title="Editar"
                        >
                          <FiEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(cliente.id)}
                          title="Excluir"
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
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

export default ClienteList;