import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ReactTooltip from 'react-tooltip';

import { AuthContextProvider } from './contexts/AuthContext';

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from "./pages/Room";
import { AdminRoom } from './pages/AdminRoom';
import { ResponseQuestion } from './pages/ResponseQuestion';

import './styles/variables.scss';
import './styles/global.scss';

function App() {

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <AuthContextProvider>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/rooms/new" exact component={NewRoom} />
            <Route path="/rooms/:id" exact component={Room} />
            <Route path="/admin/rooms/:id" exact component={AdminRoom} />
            <Route path="/admin/rooms/response/:roomId/:questionId" exact component={ResponseQuestion} />
          </Switch>
        </AuthContextProvider>
      </BrowserRouter>

      <ReactTooltip />
    </>
  );
}

export default App;