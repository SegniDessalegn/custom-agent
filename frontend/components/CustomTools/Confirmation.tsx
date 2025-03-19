import { Check } from 'lucide-react';
import { FC } from 'react';

interface ConfirmationProps {
  confirmationData: string;
}

const Confirmation: FC<ConfirmationProps> = ({ confirmationData }) => {
  const sanitizedData = confirmationData.replace(/'/g, '"');
  const confirmationObj = JSON.parse(sanitizedData);

  return (
    <div className="max-w-md rounded-lg shadow-lg">
      <div className="space-y-4">
        <div className="flex justify-start gap-1">
          <span className="font-semibold text-gray-600">Confirmation ID:</span>
          <span className="text-gray-500">{confirmationObj.confirmacion_id}</span>
        </div>
        <div className="flex justify-start gap-1">
          <span className="font-semibold text-gray-600">Date:</span>
          <span className="text-gray-500">{confirmationObj.fecha || 'N/A'}</span>
        </div>
        <div className="flex justify-start gap-1">
          <span className="font-semibold text-gray-600">Time:</span>
          <span className="text-gray-500">{confirmationObj.hora}</span>
        </div>
        <div className="flex justify-start gap-1">
          <span className="font-semibold text-gray-600">Model:</span>
          <span className="text-gray-500">{confirmationObj.modelo}</span>
        </div>
        <div className="mt-4 p-3 w-fit bg-green-900/30 text-green-300/50 rounded-md flex gap-1">
          <Check />
          <span className="font-semibold">{confirmationObj.mensaje}</span>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;