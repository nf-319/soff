import { Box, Card } from '@mui/material'
import HeadingFilter from './HeaderFilter'
import CardStats from './CardsStats'
import FeedBacksList from './FeedBacksList'

const ThoughtsPageContent = () => {
  return (
    <>
      <Card
        sx={{
          boxShadow: 'none',
          padding: 5,
          border: '1px solid lightgray',
          display: 'flex',
          flexDirection: 'column',
          gap: 5
        }}
      >
        <HeadingFilter />
        <CardStats />
      </Card>
      <FeedBacksList />
    </>
  )
}

export default ThoughtsPageContent
