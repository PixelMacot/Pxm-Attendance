import React, { useEffect, useState } from 'react'
import { quotes } from '../../jsonfiles/quotes'

const Quotes = () => {
    const [num, setNum] = useState(0);

    const randomNumberInRange = (min, max) => {
        return Math.floor(Math.random()
            * (max - min + 1)) + min;
    };
    const handleClick = () => {
        setNum(randomNumberInRange(1, 100));
    };
    useEffect(() => {
        handleClick()
    }, [])

    return (
        <div className='quotes-wrapper '>
            <div className="quotes-container flex flex-col  ">
                <div className="quotes-message flex flex-col gap-5">
                    <div className="quote">
                        <blockquote className="text-sm md:text-xl italic font-semibold text-gray-900 dark:text-white">
                            <div className="w-[50px]">
                                <svg className="w-4 h-4 md:w-8 md:h-8 text-gray-400 dark:text-gray-600 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
                                    <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
                                </svg>
                            </div>
                            <p className="quote-text text-gray-900 ">{quotes[num].quote}</p>
                        </blockquote>
                    </div>
                    <div className="flex justify-between items-center">
                        <button onClick={handleClick}
                            className='bg-cyan-900 w-[140px] lg:w-[200px] p-2 lg:px-4 text-white text-sm lg:text-lg shadow-md rounded-md '
                        >
                            Generate quote
                        </button>
                        <div className="text-right test-lg">
                            - {quotes[num].author}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Quotes