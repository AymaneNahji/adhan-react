/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Spin } from 'antd';
import './App.css';
import 'antd/dist/reset.css';
import React from 'react';
import { apiGetPrayers } from './serivces/api';
import { parseDateTime, parseTime } from './utils/functions';
import DaysCalendar from './components/DaysCalendar';
import PrayersCards from './components/PrayersCards';



function App() {

  const [dataIsloading, setDateIsLoading] = React.useState(false)

  const [days, setDays] = React.useState<API.PrayerDay[]>([])


  const [currentDay, setCurrentDay] = React.useState<API.PrayerDay>()

  const [prayers, setPrayers] = React.useState<API.Prayer[]>([]);

  const [currentPrayer, setCurrentPrayer] = React.useState<API.Prayer>()
  const [nextPrayer, setNextPrayer] = React.useState<API.Prayer>()

  const [dayNavigationIndex, setDayNavigationIndex] = React.useState<number>()

  const [currentDateTime, setCurrentDateTime] = React.useState(new Date())


  const isCurrentPrayer = (prayer: API.Prayer): boolean => {
    const dates = prayers.map(p => p.date)
    const now = new Date();
    let closestDate = dates[0];
    let closestDiff = Math.abs(now.getTime() - closestDate.getTime());

    for (let i = 1; i < dates.length; i++) {
      const diff = Math.abs(now.getTime() - dates[i].getTime());
      if (diff < closestDiff) {
        closestDiff = diff;
        closestDate = dates[i];
      }
    }

    return prayer.date == closestDate
  };


  const fetchData = async () => {

    const lastFetchDateTime = localStorage.getItem('lastFetchDateTime');
    const _oldDataText = localStorage.getItem('data');

    const oldData: API.GetPrayersResponse | undefined = _oldDataText ? JSON.parse(_oldDataText) : undefined
    const now = new Date();

    if (lastFetchDateTime && oldData) {
      const lastFetchDate = new Date(lastFetchDateTime);

      // Check if one month (30 days) has passed since the last fetch
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(now.getMonth() - 1);

      if (lastFetchDate >= oneMonthAgo) {
        console.log("Fetched recently; no need to fetch again.");
        setDays(oldData.data)

        return;
      }
    }



    // Perform the fetch and update the last fetch time
    // Get current month and year
    const month = now.getMonth() + 1; // getMonth() returns 0-11, so add 1
    const year = now.getFullYear();

    // Get latitude and longitude
    if (navigator.geolocation) {
      await navigator.geolocation.getCurrentPosition(
        async (position) => {
          setDateIsLoading(true)
          await apiGetPrayers({
            month,
            year,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }).then(res => {
            setDays(res.data.data)

            localStorage.setItem('data', JSON.stringify(res.data));
          })
            .finally(() => {
              setDateIsLoading(false)
            })
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
    // Your fetch logic here

    // Update last fetch time in localStorage
    localStorage.setItem('lastFetchDateTime', now.toISOString());
  }



  React.useEffect(() => {
    fetchData()
  }, [])

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  React.useEffect(() => {
    if (days) {
      const _prayers: API.Prayer[] = []
      days.forEach(d => {
        const {
          Lastthird,
          Firstthird,
          Imsak,
          Midnight,
          Sunset,
          ...timings
        } = d.timings
        _prayers.push(...Object.keys(timings).map((key) => {
          //@ts-ignore
          const _date = parseDateTime(`${d.date.gregorian.date} ${timings[key].slice(0, 5)}`)


          return ({
            name: key,
            //@ts-ignore
            time: timings[key],
            date: _date
            // time: (timings[key] || '').split(' ')[0]
          })
        }))

      })

      setPrayers(_prayers)

    }
  }, [days])





  React.useEffect(() => {

    const current = prayers.find(p => isCurrentPrayer(p))
    setCurrentPrayer(current)

  }, [prayers, currentDateTime])

  React.useEffect(() => {
    if (currentPrayer) {
      const day = days.find(d => parseDateTime(d.date.gregorian.date).getDate() == currentPrayer.date.getDate())
      if (day)
        setDayNavigationIndex(days.indexOf(day))
      setCurrentDay(day)
      if (currentPrayer) {
        const currentIndex = prayers.indexOf(currentPrayer)
        if (currentIndex >= 0 && currentIndex < prayers.length) {
          setNextPrayer(prayers[currentIndex + 1])
        }
      }
    }
  }, [currentPrayer])

  if (dataIsloading)
    return <div className='h-screen w-full flex justify-center items-center'>
      <Spin tip="Loading" size="large" />
    </div>

  return (
    <div className='h-screen w-full flex flex-col lg:flex-row relative overflow-hidden'>
      <div className='bg-black absolute scale-x-110 w-full h-1/4 -z-10' style={{ borderRadius: '0 0 50% 50%' }}></div>
      <div className='flex  flex-col p-5 py-2 gap-4 items-start flex-1'>
        <span className='text-3xl text-white font-bold'>Prière</span>
        <span className=' text-white font-bold'>
          <span >L'heure de prière</span>
          {' '}
          <span className=' text-orange-500'>Casablanca</span>
        </span>
        <DaysCalendar
          days={days}
          currentPrayer={currentPrayer}
          nextPrayer={nextPrayer}
          dayNavigationIndex={dayNavigationIndex}
          goToNextDay={() => setDayNavigationIndex((dayNavigationIndex || 0) + 1)}
          goToPrevDay={() => setDayNavigationIndex((dayNavigationIndex || 0) - 1)}
          goToCurrentDay={() => {
            if (currentDay)
              setDayNavigationIndex(days.indexOf(currentDay))
          }}
          currentDayIndex={currentDay ? days.indexOf(currentDay) : undefined}
        />
        <div className='self-end hidden lg:flex h-24 bg-black w-full rounded-2xl text-white justify-center items-center'>
          Ads banner
        </div>
      </div>
      <div className=' flex lg:hidden h-24  bg-black mx-5 rounded-2xl text-white justify-center items-center'>
        Ads banner
      </div>
      <div className="flex-1 flex flex-col  justify-center items-center p-5">
        {
          currentDay &&
          <PrayersCards prayers={
            prayers.filter(p => (
              dayNavigationIndex ? p.date.getDate() == parseDateTime(days[dayNavigationIndex].date.gregorian.date).getDate() :
                p.date.getDate() == parseDateTime(currentDay.date.gregorian.date).getDate()
            ))
              .map(p => ({
                ...p,
                isCurrent: isCurrentPrayer(p)
              }))} />
        }

      </div>
    </div>
  )
}

export default App
