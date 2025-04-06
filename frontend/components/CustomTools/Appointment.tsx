import { FC } from 'react';

interface AvailableTimesProps {
  times: string;
}

const Appointment: FC<AvailableTimesProps> = ({ times }) => {
    const timeArray = times
    .replace(/[\[\]']/g, '')
    .split(',')
    .map((time) => time.trim());

  return (
    <div className={`p-4 border-l-4 bg-yellow-900/20 text-yellow-500 shadow-md`}>
      <h3 className="text-base font-bold">Available Time Slots</h3>
      <p className="mt-2 text-gray-400">
      <div className="flex flex-wrap gap-4 justify-start text-sm">
        {timeArray.map((time, index) => (
          <div key={index} className="flex items-center space-x-2 bg-yellow-900/50 text-yellow-200/50 px-4 py-1 rounded shadow-md">
            <span className="text-xs font-semibold">{time}</span>
          </div>
        ))}
    </div>
    </p>
    </div>
  );
};

export default Appointment;