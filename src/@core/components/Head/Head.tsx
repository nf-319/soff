import Head from 'next/head'
import { useAppSelector } from 'src/store'

export const MyHead = () => {
  const { companyInfo } = useAppSelector(state => state.user)

  return (
    <Head>
      <meta name='robots' content='noindex, nofollow' />
      <title>{`${companyInfo.training_center_name} - Taʼlim tizimini nazorat qilish platformasi`}</title>
      <link rel='shortcut icon' href={companyInfo.logo} />
    </Head>
  )
}
