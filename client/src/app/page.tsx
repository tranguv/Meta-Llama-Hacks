import Image from "next/image";
import Navbar from "./components/Navbar";
import doctor from './Assets/doctor2.jpg';

export default function Home() {
  return (
    <div>
      <Navbar/>
      <div className="flex items-center justify-center p-[60px]">
        <div className="w-[180vh] h-[87vh] p-[2.5vh] m-[2vh] grid grid-cols-14 gap-4 ">
          <div className="col-start-1 col-end-14 bg-white rounded-[20px]">
          <Image 
              className="h-[100%] w-[32%] rounded-[20px]" 
              src={doctor} 
              alt="Doctor"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
