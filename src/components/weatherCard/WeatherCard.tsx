import './styles.css';
interface WeatherCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}
export const WeatherCard = ({ data }: WeatherCardProps) => {
  const temp = Math.round(data?.main?.temp);

  return (
    data && (
      <div className="card">
        {/* <img
          src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
          alt={data.weather[0].description}
        /> */}
        <img
          className="weatherIcon"
          src="../../../assets/icons8-cloud-50.png"
        />
        <div className="tempBlock">
          <div className="temp">
            {temp}
            <span style={{ fontSize: '22px' }}>ºC</span>
          </div>
          <p className="description">{data.weather[0].description}</p>
        </div>
        <p>feels like: {data.main?.feels_like}</p>
        <p>humidity: {data.main?.humidity}%</p>
      </div>
    )
  );
};
