import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { store } from './app/store'
import { router } from './app/router'
<<<<<<< HEAD
import './styles/tokens.css'
import './styles/global.css'
import '@fontsource-variable/nunito'
=======
import { restaurarSessao } from './features/auth/authSlice'

store.dispatch(restaurarSessao())
>>>>>>> origin/develop

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
