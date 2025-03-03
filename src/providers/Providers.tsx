import { Provider } from 'react-redux'
import { QueryProvider } from './QueryProvider'
import { FC, PropsWithChildren } from 'react'
import { store } from 'src/store'



export const Providers: FC<PropsWithChildren> = ({ children }) => (
  <QueryProvider>
    <Provider store={store}>{children}</Provider>
  </QueryProvider>
)
