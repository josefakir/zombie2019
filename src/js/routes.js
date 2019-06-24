
import HomePage from '../pages/home.f7.html';
import DashboardPage from '../pages/dashboard.f7.html';
import SaludfinancieraPage from '../pages/saludfinanciera.f7.html';
import MetasPage from '../pages/metas.f7.html';
import MetaPage from '../pages/meta.f7.html';
import AgregarmetasPage from '../pages/agregarmetas.f7.html';
import RecordatoriosPage from '../pages/recordatorios.f7.html';
import ConfiguracionPage from '../pages/configuracion.f7.html';
import TareasdiariasPage from '../pages/tareasdiarias.f7.html';
import NotFoundPage from '../pages/404.f7.html';

var routes = [
  {
    path: '/',
    component: HomePage,
    beforeEnter: function(routeTo, routeFrom, resolve, reject){ 
      if(localStorage.getItem('auth') == null){ 
        this.app.loginScreen.open('#my-login-screen');
      } 
      resolve(); 
    }
  },
  {
    path: '/inicio/',
    component: DashboardPage,
  },
  {
    path: '/saludfinanciera/',
    component: SaludfinancieraPage,
  },
  {
    path: '/metas/',
    component: MetasPage,
  },
  {
    path: '/agregar-metas/',
    component: AgregarmetasPage,
  },
  {
    path: '/recordatorios/',
    component: RecordatoriosPage,
  },
  {
    path: '/configuracion/',
    component: ConfiguracionPage,
  },
  {
    path: '/meta/:id_meta',
    component: MetaPage,
  },
  {
    path: '/tareasdiarias/',
    component: TareasdiariasPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  }
];

export default routes;