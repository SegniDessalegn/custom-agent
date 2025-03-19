"use client";

import React from "react";
import AvailableTimes from "./CustomTools/AvailableTimes";
import Confirmation from "./CustomTools/Confirmation";

type Props = {
  tool: string;
  output: string;
};

const toolColors: { [key: string]: string } = {
  get_weather: "bg-blue-900/10 text-blue-800",
  get_dealership_address: "bg-red-900/10 text-red-800",
  check_appointment_availability: "bg-yellow-900/10 text-yellow-800",
  schedule_appointment: "bg-green-900/10 text-green-800",
};

const Tools = ({ tool, output }: Props) => {
  const colorClass = toolColors[tool.trim()] || "bg-blue-900/10 text-blue-800";

  if (tool.trim() === "check_appointment_availability") {
    return (
      <div className={`p-4 border-l-4 rounded-lg ${colorClass} shadow-md`}>
        <h3 className="text-lg font-bold">{tool.replaceAll("_", " ")}</h3>
        <p className="mt-2 text-gray-400">
          <AvailableTimes times={output} />
        </p>
      </div>
    );
  }

  if (tool.trim() === "schedule_appointment") {
    return (
      <div className={`p-4 border-l-4 rounded-lg ${colorClass} shadow-md`}>
        <h3 className="text-lg font-bold">{tool.replaceAll("_", " ")}</h3>
        <p className="mt-2 text-gray-400">
          <Confirmation confirmationData={output} />
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 border-l-4 rounded-lg ${colorClass} shadow-md`}>
      <h3 className="text-lg font-bold">{tool.replaceAll("_", " ")}</h3>
      <p className="mt-2 text-gray-400">{output}</p>
    </div>
  );
};

export default Tools;
