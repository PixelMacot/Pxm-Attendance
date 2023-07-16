import React from 'react'
import './quote.css'
const Quotes = ({ quote }) => {
    console.log(quote)
    return (
        <>
            <div className="">
                <div className="shadow-lg quote-container w-[90%] mx-auto rounded-sm p-10 my-5">
                    <div className="relative">
                        <blockquote>{quote.text}</blockquote>
                        <cite>{quote.author}</cite>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Quotes