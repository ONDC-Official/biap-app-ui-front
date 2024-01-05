import React from 'react';
import useStyles from "./style";

import Typography from '@mui/material/Typography';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

import {ReactComponent as TimelineIcon} from '../../../assets/images/timeline.svg';


const OrderTimeline = () => {
    const classes = useStyles();
    const timeLineData = ["Ordered", "Preparing", "Out for delivery", "Arriving in 40 minutes"];
    return (
        <div>
            <Timeline
                sx={{
                    [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                    },
                }}
            >
                {
                    timeLineData.map((item, itemIndex) => (
                        <TimelineItem key={`timeline-index-${itemIndex}`}>
                            <TimelineSeparator>
                                <TimelineDot className={classes.timelineDot}>
                                    <TimelineIcon className={classes.timelineIcon} />
                                </TimelineDot>
                                {
                                    timeLineData.length-1 > itemIndex && (
                                        <TimelineConnector className={classes.dottedConnector} />
                                    )
                                }
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography component="div" variant="body" className={classes.timelineContentHeaderTypo}>
                                    {item}
                                    <Typography component="span" variant="body1" className={classes.timelineContentHeaderTimeTypo}>
                                        Saturday 30/04/23 at 4:30pm
                                    </Typography>
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    ))
                }
            </Timeline>
        </div>
    )

};

export default OrderTimeline;