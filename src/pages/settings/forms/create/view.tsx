'use client'

import FormUi from '@/widgets/Form/formUi'
import { ReactNode } from 'react'
import BlankLayout from '@/@core/layouts/BlankLayout'

const View = () => <FormUi page />

View.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
export default View
