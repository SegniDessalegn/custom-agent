"use client";

import React from "react";
import Appointment from "./CustomTools/Appointment";
import Confirmation from "./CustomTools/Confirmation";
import Address from "./CustomTools/Address";
import Weather from "./CustomTools/Weather";

type Props = {
  tool: string;
  output: string;
};

const toolComponents: Record<string, React.FC<{ output: string }>> = {
  check_appointment_availability: ({ output }) => <Appointment times={output} />,
  schedule_appointment: ({ output }) => <Confirmation confirmationData={output} />,
  get_dealership_address: ({ output }) => <Address address={output} />,
  get_weather: ({ output }) => <Weather output={output} />,
};

const Tools: React.FC<Props> = ({ tool, output }) => {
  const Component = toolComponents[tool];

  return Component ? (
    <Component output={output} />
  ) : (
    <div className="p-4 border-l-4 bg-blue-900/10 text-blue-800 shadow-md">
      <h3 className="text-lg font-bold">{tool.replaceAll("_", " ")}</h3>
      <p className="mt-2 text-gray-400">{output}</p>
    </div>
  );
};

export default Tools;