'use client'
import React, { useState } from 'react'
import { PlaceholdersAndVanishInput } from './ui/PlaceholdersAndVanishInput';

const Connect = () => {
    const [email, setEmail] = useState('');

    const placeholders = [
        "Wanna build something amazing together?",
        "How does a website that wows your audience sound?",
        "Ready to turn your vision into a stunning website?",
        "What if your website became the talk of the internet?",
        "Lets craft a digital masterpiece for your brand  are you in?",
        "How about we make a website that leaves your competitors jealous?",
        "Whats stopping us from building the website of your dreams right now?",
        "Wanna create a website thats both functional and fabulous?",
        
      ];
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setEmail(e.target.value);
      };
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(e)
        if (!emailRegex.test(email)) {
  alert('Please enter a valid email address');
} else {
  console.log(`Form submitted with email: ${email}`);
  // Proceed with form submission logic (e.g., send data to a server)
  // Example
       
      };}
  return (
    <div>
         <div className="h-[40rem] flex flex-col justify-center bg-black  items-center px-4">
      <h2 className=" uppercase text-xl text-center sm:text-5xl dark:text-white text-white">
        want to connect..?
      </h2>
      <p className='mb-10 sm:mb-20  text-gray-300 '>
        Type in your mail and i&apos;ll get back to you .
      </p>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
      
    </div>
  )
}

export default Connect
