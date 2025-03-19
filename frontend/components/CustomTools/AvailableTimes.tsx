import { FC } from 'react';

interface AvailableTimesProps {
  times: string;
}

const AvailableTimes: FC<AvailableTimesProps> = ({ times }) => {
    const timeArray = times
    .replace(/[\[\]']/g, '')
    .split(',')
    .map((time) => time.trim());

  return (
      <div className="flex flex-wrap gap-4 justify-start">
        {timeArray.map((time, index) => (
          <div key={index} className="flex items-center space-x-2 bg-yellow-900/50 text-yellow-200/50 px-4 py-1 rounded-full shadow-md">
            <span className="text-sm font-semibold">{time}</span>
          </div>
        ))}
    </div>
  );
};

export default AvailableTimes;