import { Box, Card, Checkbox, Radio, Typography } from '@mui/material'
import React from 'react'

export default function GroupFinanceTable() {
    return (
        <Card>
            <Box sx={{ padding: '5px 0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <Radio name='year_month' checked={true} />
                        <Typography>Yillik</Typography>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <Radio name='year_month' />
                        <Typography>Oylik</Typography>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <Checkbox name='comments' checked={false} />
                        <Typography>Izohlar</Typography>
                    </label>

                </Box>
            </Box>
            <Card sx={{ display: 'flex', p: '15px', gap: '5px' }}>

            </Card>
        </Card>
    )
}
