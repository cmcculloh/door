const getDailyReadings = async (apiUrl: string) => {
    const res = await fetch(
        `${apiUrl}/api/readings?date=${new Date().toISOString().slice(0, 10)}`
    );
    const data = await res.json();
    console.log('data', data)
    return data;

};

export default getDailyReadings;