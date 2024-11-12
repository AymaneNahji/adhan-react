export const parseDateTime = (dateStr:string) => {
    const [day, month, year] = dateStr.split('-');
    return new Date(`${month}-${day}-${year}`);
  };

  export const parseTime = (time:string)=>{
    const [hour,minute] = time.split(':')
    const date = new Date()
    date.setHours(parseInt(hour),parseInt(minute),0,0)
    return date
  }