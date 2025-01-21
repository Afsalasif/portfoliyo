import React from 'react'
// import { BackgroundGradientAnimation } from './ui/BackgroundGradientAnimation';
import { StarsBackground } from './ui/StarsBackground';
import { ShootingStars } from './ui/ShootingStars';
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";


function Landing() {
  // const socialLinks = [
  //   {
  //     id: 1,
  //     icon: <FaLinkedin />,
  //     name: "LinkedIn",
  //     url: "https://www.linkedin.com/in/your-profile/",  // Replace with your LinkedIn URL
  //   },
  //   {
  //     id: 2,
  //     icon: <FaGithub />,
  //     name: "GitHub",
  //     url: "https://github.com/your-profile",  // Replace with your GitHub URL
  //   },
  //   {
  //     id: 3,
  //     icon: <FaEnvelope />,
  //     name: "Email",
  //     url: "mailto:youremail@example.com",  // Replace with your email
  //   },
  // ];
  
    return (
      <div>
      
        <section className="h-screen flex flex-col justify-center items-center bg-black overflow-hidden">
          
          {/* Social handles */}
          <div className="absolute top-6 left-6 text-xs md:text-sm">Mohamed Afzal NA</div>
          <div className="absolute top-6 right-6 text-xs md:text-sm"></div>
    
          {/* Motion Design Studio Title */}
          {/* <div className="flex flex-col items-center text-center space-y-2"> */}
           
            <h1 className=" text-xl md:text-3xl lg:text-8xl font-doto uppercase text-white tracking-tight">
              building websites
            </h1>
            <h2 className="  text-xl md:text-3xl lg:text-6xl font-doto uppercase tracking-tight">
              <span className="text-red-500">the better way </span>
            </h2>
          {/* </div> */}
          
    
          {/* Large Background Text */}
       
          <StarsBackground />
          <ShootingStars/>
          
        </section>
        
        </div>
      );
}

export default Landing