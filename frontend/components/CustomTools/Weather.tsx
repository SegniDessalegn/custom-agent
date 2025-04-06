import { CloudSun } from "lucide-react";
import React from "react";

type Props = {
  output: string;
};

const Weather = (props: Props) => {
  return (
    <div className="p-4 border-l-4 bg-blue-900/20 shadow-md">
      <h3 className="text-base font-bold text-blue-500">Weather Information</h3>
      <div className="mt-3 flex gap-3 items-center text-blue-300">
        <CloudSun className="size-7" />
        <div className="text-base">{props.output}</div>
      </div>
    </div>
  );
};

export default Weather;
