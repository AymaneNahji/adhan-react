import React from 'react'
import { Button } from 'antd'
import { parseDateTime, parseTime } from '../utils/functions'
import prayerBg from '../assets/prayerBg.jpg'

type Props = {
    days: API.PrayerDay[],
    currentPrayer?: API.Prayer,
    nextPrayer?: API.Prayer,

    goToNextDay?: () => void;
    goToPrevDay?: () => void;
    goToCurrentDay?: () => void;

    dayNavigationIndex?: number;
    currentDayIndex?: number;
}

const DaysCalendar = (props: Props) => {

    const [currentDay, setCurrentDay] = React.useState<API.PrayerDay>()

    const [currentDateTime, setCurrentDateTime] = React.useState(new Date())

    const getCurrentDay = (_days = props.days) => {

        const now = new Date()

        return _days.find(d => {
            const dayDate = parseDateTime(d.date.gregorian.date)
            return dayDate.getDate() == now.getDate()
        })
    }

    const getTimer = () => {
        if (props.currentPrayer && props.nextPrayer) {

            // Parse last prayer time (e.g., 12:00)
            const lastPrayerTime = parseTime(props.currentPrayer.time);

            // Parse next prayer time (e.g., 14:00)
            const nextPrayerTime = parseTime(props.nextPrayer.time);

            // Calculate the time since the last prayer
            const timeSinceLastPrayer = new Date(currentDateTime.getTime() - lastPrayerTime.getTime());

            // Calculate the time until the next prayer
            const timeUntilNextPrayer = new Date(nextPrayerTime.getTime() - currentDateTime.getTime());

            // Format both as HH:MM:SS
            const timeSince = `${String(timeSinceLastPrayer.getUTCHours()).padStart(2, '0')}:${String(timeSinceLastPrayer.getUTCMinutes()).padStart(2, '0')}:${String(timeSinceLastPrayer.getUTCSeconds()).padStart(2, '0')}`;
            const timeUntil = `-${String(timeUntilNextPrayer.getUTCHours()).padStart(2, '0')}:${String(timeUntilNextPrayer.getUTCMinutes()).padStart(2, '0')}:${String(timeUntilNextPrayer.getUTCSeconds()).padStart(2, '0')}`;


            return {
                timeUntil,
                timeSince,
                useTimeUntil: timeSinceLastPrayer.getTime() < timeUntilNextPrayer.getTime()
            };
        }
        return {
            timeUntil: '--:--:--',
            timeSince: '--:--:--'
        };
    };

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDateTime(new Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    React.useEffect(() => {
        setCurrentDay(getCurrentDay())
    }, [props.days])

    return (
        <div className='bg-blue-500 p-1 flex-1 self-stretch rounded-2xl overflow-hidden flex flex-col justify-center items-center relative'>
            <div className='absolute  inset-0 gap-2 ' style={{ backgroundImage: `url(${prayerBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                {/* <img src={prayerBg} className='h-full w-full' /> */}
            </div>
            <div className='px-4 z-10  flex flex-col justify-center items-center gap-1'>
                {
                    props.currentPrayer && (
                        <>
                            <span>
                                {getTimer().useTimeUntil ? 'Il reste pour adhan :' : "Il s'est écoulé depuis l'adhan :"}
                            </span>
                            <span className='text-orange-500 font-bold text-4xl'>
                                {getTimer().useTimeUntil ? props.nextPrayer?.name : props.currentPrayer.name}
                            </span>
                            <span className=' font-bold text-3xl'>
                                {
                                    props.nextPrayer && (
                                        <span>
                                            {getTimer().useTimeUntil ? getTimer().timeUntil : getTimer().timeSince}
                                        </span>
                                    )
                                }
                            </span>
                        </>
                    )
                }
                <div className='flex items-center gap-8'>

                    <Button onClick={() => {
                        if (props.goToPrevDay)
                            props.goToPrevDay()
                    }} type='text' shape='circle' size='large' disabled={(props.dayNavigationIndex || 0) == 0}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </Button>

                    {
                        currentDay && (
                            <div className='flex-1 text-xl flex flex-col gap-2 items-center justify-center'>
                                <span className='font-bold'>
                                    {props.dayNavigationIndex ? props.days[props.dayNavigationIndex].date.hijri.date : currentDay.date.hijri.date}
                                </span>
                                <span>
                                    {props.dayNavigationIndex ? props.days[props.dayNavigationIndex].date.gregorian.date : currentDay.date.gregorian.date}
                                </span>
                            </div>
                        )
                    }

                    <Button onClick={() => {
                        if (props.goToNextDay)
                            props.goToNextDay()
                    }} type='text' shape='circle' size='large'  disabled={(props.dayNavigationIndex || 0) == props.days.length - 1}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </Button>
                </div>
                <div className='flex items-center justify-center relative'>
                    {
                        props.dayNavigationIndex != props.currentDayIndex &&
                        <Button onClick={() => {
                            if (props.goToCurrentDay)
                                props.goToCurrentDay()
                        }} type='text' shape='circle' size='large' className='absolute top-1' title='go to current day'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                            </svg>

                        </Button>
                    }
                </div>
            </div>
        </div>
    )
}

export default DaysCalendar