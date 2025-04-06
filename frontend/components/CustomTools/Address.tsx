"use client";

import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const LocationLink = ({address}: {address: string}) => {
  const googleMapsUrl = `https://www.google.com/maps?q=${address}`;

  return (
    <div className="p-4 border-l-4 bg-red-900/20 text-red-800 shadow-md">
      <h3 className="text-base font-bold">Dealership Location</h3>
      <div className="flex items-center">
      <MapPin className="size-7 text-red-500" />
      <Button asChild variant="link" className="w-fit p-2">
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
          5th Avenue, New York
        </a>
      </Button>
      </div>
    </div>
  );
};

export default LocationLink;