import { Provider } from 'react-redux'
import { QueryProvider } from './QueryProvider'
import { FC, PropsWithChildren } from 'react'
import { store } from 'src/store'

import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'react-perfect-scrollbar/dist/css/styles.css'

export const Providers: FC<PropsWithChildren> = ({ children }) => (
  <QueryProvider>
    <Provider store={store}>{children}</Provider>
  </QueryProvider>
)
