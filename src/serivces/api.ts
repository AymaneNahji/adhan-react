// import axios from "axios"
// import axiosInterseptor from "../utils/axiosInterseptor"

import axiosInterceptor from "../utils/axiosInterseptor";

// export const apiGetPrayers = (params:API.GetPrayersParams)=>{
//     // return axios.get(`http://api.aladhan.com/v1/calendar?latitude=${params.latitude}&longitude=${params.longitude}&method=21&month=${params.month}&year=${params.year}`)
//     return axiosInterseptor.get<API.GetPrayersResponse>('http://api.aladhan.com/v1/calendar?method=21',{params})
// }

export const apiGetPrayers = (params: API.GetPrayersParams) => {
    return axiosInterceptor.get<API.GetPrayersResponse>(
      'http://api.aladhan.com/v1/calendar',
      {
        params: {
          ...params,
          method: 21
        }
      }
    );
  };