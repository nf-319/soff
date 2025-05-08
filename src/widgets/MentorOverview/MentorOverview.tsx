import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import classnames from 'classnames/bind'
import style from './MentorOverview.module.scss'
import { } from "react-bootstrap"
import { Box } from '@mui/material';
import { MentorInfo } from './constants'
import { Pencil, Phone } from 'lucide-react';
import Image from 'next/image';
const cn = classnames.bind(style)

export const MentorOverview = () => {
    return (
        <Box component='section' className={cn("mentor_overview")}>
            <Card className={cn("mentor_overview__card")} sx={{ boxShadow: 'none', maxWidth: 345 }}>
                <CardContent className={cn("mentor_overview__card-content")}>
                    <Box className={cn("mentor_overview__card-content-titleWrap")}>
                        <Box className={cn("mentor_overview__card-content-titleWrap-titleBox")}>
                            <Typography variant='h6' color={'black'} className={cn("mentor_overview__card-content-titleWrap-titleBox-title")}>
                                Mening malumotlarim
                            </Typography>
                            <Pencil size={20} className='mentor_overview__card-content-titleWrap-titleBox-editor' />
                        </Box>
                        {/* <img className={cn("mentor_overview__card-content-titleWrap-avatar")} src="https://picsum.photos/id/237/300/300" alt="" /> */}
                        <Image className={cn("mentor_overview__card-content-titleWrap-avatar")} src={"https://picsum.photos/id/237/300/300"} width={120} height={120} alt='avatar' />
                    </Box>
                    <Box className={cn("mentor_overview__card-content-body")}>
                        {
                            MentorInfo.map((item, index) => {
                                return (
                                    <Box key={index} className={cn("mentor_overview__card-content-body-item")}>
                                        <item.icon size={20} />
                                        <Box>
                                            <Typography className={cn("mentor_overview__card-content-body-title")}>
                                                {item.title}
                                            </Typography>
                                            <Typography color={'black'} className={cn("mentor_overview__card-content-body-title")}>
                                                {item.value}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            })
                        }

                    </Box>
                    <Typography marginY={2.5} className={cn("mentor_overview__card-content-contact")}>
                        Kontakt
                    </Typography>
                    <Box className={cn("mentor_overview__card-content-contactbox")}>
                        <Phone />
                        <Typography color={'black'} className={cn("mentor_overview__card-content-body-title")}>
                            +998 90 123 45 67
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box >
    )
}

MentorOverview.displayName = 'MentorOverview'
