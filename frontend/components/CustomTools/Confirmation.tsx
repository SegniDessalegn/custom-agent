import { FC } from "react";

interface ConfirmationProps {
  confirmationData: string;
}

const Confirmation: FC<ConfirmationProps> = ({ confirmationData }) => {
  const sanitizedData = confirmationData.replace(/'/g, '"');
  const confirmationObj = JSON.parse(sanitizedData);

  return (
    <div className={`p-4 border-l-4 bg-green-900/20 text-green-500 shadow-md`}>
      <h3 className="text-base font-bold">Appointment Confirmed</h3>
      <div className="max-w-md rounded-lg shadow-lg text-sm">
        <div className="space-y-2 mt-1">
          <div className="flex justify-start gap-1">
            <span className="font-semibold text-gray-500">
              Confirmation ID:
            </span>
            <span className="text-gray-300">
              {confirmationObj.confirmacion_id}
            </span>
          </div>
          <div className="flex justify-start gap-1">
            <span className="font-semibold text-gray-500">Date:</span>
            <span className="text-gray-300">
              {confirmationObj.fecha || "N/A"}
            </span>
          </div>
          <div className="flex justify-start gap-1">
            <span className="font-semibold text-gray-500">Time:</span>
            <span className="text-gray-300">{confirmationObj.hora}</span>
          </div>
          <div className="flex justify-start gap-1">
            <span className="font-semibold text-gray-500">Model:</span>
            <span className="text-gray-300">{confirmationObj.modelo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
