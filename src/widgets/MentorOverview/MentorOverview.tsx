import { Box } from "@mui/material"
import classnames from 'classnames/bind'

import style from './MentorOverview.module.scss'

const cn = classnames.bind(style)

export const MentorOverview = () => {
    return (
        <Box component='section' className={cn("prent__list")}>mentor</Box>
    )
}

MentorOverview.displayName = 'MentorOverview'
