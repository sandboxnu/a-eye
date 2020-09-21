import React from "react";
import logo from './media/staticLogo.svg';

function Footer() {
    
    const scrollTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    return (
        <footer className="flex  flex-row justify-between bg-footer text-white absolute left-0 right-0 bottom-0 font-light font-opensans" id="footer-container">
           
            <div className='flex flex-row justify-between w-full p-4 ' id="content-container">
                <div className='flex flex-col justify-between text-left'id="left-content">
                    <div className="px-4 flex justify-left" href="/home" id="logo-container">
                        <img  src={logo} className="w-24 h-20 " alt="logo" />
                    </div>
                    <div className='px-8'>
                        A Sandbox Project
                    </div>
            
                </div>
                <div className='text-left flex flex-col justify-between' id=" right-content ">
                    <div className='font-bold uppercase mb-1'> Contact  </div>
                    <a className='mb-8 hover:text-teal-300 duration-300 ease-in-out' href='mailto:info@sandboxneu.com'> info@sandboxneu.com  </a>
                    <div> Hosted By Vercel  </div>
                </div>

            </div>
            <div className="flex bg-scroll w-3 sm:w-6 lg:w-20  justify-center  hover:text-teal-300 duration-300 ease-in-out" id="scroll-top-container" onClick={scrollTop}>
                 <svg class="w-6 h-6 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                </svg>
            </div>
        </footer>
         
    
    );
}

export default Footer;