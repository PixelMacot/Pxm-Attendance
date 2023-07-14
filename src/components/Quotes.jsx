import React from 'react'
import './quote.css'
const Quotes = ({ quote }) => {
    console.log(quote)
    return (
        <>
            <div className="">
                <div className="relative">
                    <blockquote>{quote.text}</blockquote>
                    <cite>{quote.author}</cite>
                </div>
            </div>
        </>
    )
}

export default Quotes