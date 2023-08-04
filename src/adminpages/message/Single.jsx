import React,{useState} from 'react'

const Single = ({ props }) => {
    const [show, setShow] = useState(false)
    console.log(props)
    return (
        <div>
            <div className="msg ">
                <div className=""
                onClick={()=>setShow(!show)}
                >
                {props.slice(0, 20)}...
                </div>
                {
                    show && (
                        <div className="absolute top-0 bg-white ">
                            {props}
                        </div>
                    )
                }
            </div>

        </div>
    )
}

export default Single