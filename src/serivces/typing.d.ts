declare namespace API {
    type GetPrayersParams = {
        latitude: number;
        longitude: number;
        month: number;
        year: number;
    }

    type PrayerDate = {
        date: string,
        format: string,
        day: string,
        weekday: {
            en: string,
            ar: string,
        },
        month: {
            number: number,
            en: string,
            ar: string,
        },
        year: string,
        designation: {
            abbreviated: string,
            expanded: string
        }
    }

    type PrayerDay = {
        date: {
            gregorian: PrayerDate,
            hijri: PrayerDate,
            timestamp: string;
        },
        timings: {
            Fajr: string; // value here it is the time of prayer like '00:00'
            Sunrise: string; // value here it is the time of prayer like '00:00'
            Dhuhr: string; // value here it is the time of prayer like '00:00'
            Asr: string; // value here it is the time of prayer like '00:00'
            Sunset: string; // value here it is the time of prayer like '00:00'
            Maghrib: string; // value here it is the time of prayer like '00:00'
            Isha: string; // value here it is the time of prayer like '00:00'
            Imsak: string; // value here it is the time of prayer like '00:00'
            Midnight: string; // value here it is the time of prayer like '00:00'   
            Lastthird: string; // value here it is the time of prayer like '00:00' 
            Firstthird: string; // value here it is the time of prayer like '00:00' 
        }
    }

    type GetPrayersResponse = {
        code: number;
        data: PrayerDay[]
    }

    type Prayer = { name: string; time: string, date:Date }
}