import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ClienteList from '../components/Cliente/ClienteList';
import ClienteForm from '../components/Cliente/ClienteForm';
import ClienteView from '../components/Cliente/ClienteView';
import TicketList from '../components/Ticket/TicketList';
import TicketForm from '../components/Ticket/TicketForm';
import TicketView from '../components/Ticket/TicketView';
import HomePage from '../pages/HomePage';
import NotFound from '../components/Layout/NotFound';
import SettingsPage from '../pages/configuracoes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Todas as rotas dentro deste Route terão o Layout */}
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        
        <Route path="clientes">
          <Route index element={<ClienteList />} />
          <Route path="novo" element={<ClienteForm />} />
          <Route path=":id" element={<ClienteView />} />
          <Route path=":id/editar" element={<ClienteForm />} />
        </Route>

        <Route path="tickets">
          <Route index element={<TicketList />} />
          <Route path="novo" element={<TicketForm />} />
          <Route path=":id" element={<TicketView />} />
          <Route path=":id/editar" element={<TicketForm />} />
        </Route>

        <Route path="configuracoes" element={<SettingsPage />} />
      </Route>

      {/* Rota 404 (sem Layout) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;