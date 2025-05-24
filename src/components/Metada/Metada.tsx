import { useAppSelector } from '@/store'
import Head from 'next/head'

type Props = {
  title?: string
}

export const Metadata = ({ title }: Props) => {
  const { companyInfo } = useAppSelector(state => state.user)

  return (
    <Head>
      <meta name='robots' content='noindex, nofollow' />
      {!title ? (
        <title>{`${companyInfo?.training_center_name} - Taʼlim tizimini nazorat qilish platformasi`}</title>
      ) : (
        <title>{`${title} | ${companyInfo?.training_center_name}`}</title>
      )}
      <meta
        name='description'
        content={`${companyInfo?.training_center_name} - Taʼlim tizimini nazorat qilish platformasi | ${title}`}
      />

      <link rel='shortcut icon' href={companyInfo?.logo} />
    </Head>
  )
}
