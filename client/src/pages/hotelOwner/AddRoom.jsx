import React, { useState } from "react";
import Title from "../../components/Title";

const AddRoom = () => {
  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [inputs, setInputs] = useState({
    roomType: "",
    pricePerNight: 0,
    amenities: {
      "Free Wifi": false,
      "Free Breakfast": false,
      "Room Service": false,
      "Mountain View": false,
      "Pool Access": false,
    },
  });

  return (
    <div className="flex justify-center items-start min-h-full w-full">
      <form className="w-full max-w-3xl p-6 bg-white rounded shadow">
        <Title
          align="center"
          font="outfit"
          title="Add Room"
          subTitle="Fill in the details carefully—accurate room details, pricing, and amenities enhance the booking experience."
        />
        {/* Form Fields Go Here */}
      </form>
    </div>
  );
};

export default AddRoom;
