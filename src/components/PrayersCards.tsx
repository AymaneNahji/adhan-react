
type Props = {
    prayers: (API.Prayer & { isCurrent: boolean })[]
}

const PrayersCards = (props: Props) => {


    return (
        <div className='grid grid-cols-3 gap-2 justify-center items-center'>
            {
                props.prayers.map((prayer, index) => (
                    <div key={index} className={`rounded-2xl shadow-black/25 flex flex-col gap-2 border-2 border-transparent p-4 ${prayer.isCurrent ? '!border-orange-500 shadow-lg text-orange-500' : ''}`}>
                        <div className='flex-1 flex justify-center items-center'>
                            <div className='rounded-full bg-gray-800 p-5'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-orange-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                                </svg>
                            </div>
                        </div>
                        <div className='flex-1 flex flex-col items-center font-semibold'>
                            <span>
                                {prayer.name}
                            </span>
                            <span>
                                {prayer.time}
                            </span>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default PrayersCards