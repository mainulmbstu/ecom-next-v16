'use client'

import { useState } from "react"
import Swal from 'sweetalert2'

const Modal = ({ prp }) => {
    let mmm = () => {
        Swal.fire("SweetAlert2 is working!");
    }

    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            <button type="button" onClick={() => setIsOpen(true)}>Open Modal</button>

            <div className={isOpen ? " bg-gray-700/80 w-screen h-screen fixed top-0 grid justify-center items-center z-99" : 'scale-0 fixed'}>
                <div className={` transition-all duration-500  bg-base-300 shadow-sm shadow-sky-300 p-2  ${isOpen ? " opacity-100 " : ' opacity-0'}`}>
                    <div className="">
                        <h2>Modal Title</h2>
                        <h2>{prp}</h2>
                        <div className="mt-3">
                            <label className="block" htmlFor="name">
                                Product Name
                            </label>
                            <input
                                //   defaultValue={value?.name}
                                className="input-000"
                                type="text"
                                id="name"
                                name="name"
                                required
                                placeholder="Enter product name"
                            />
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)}>Close</button> <br />
                    <button onClick={mmm}>swal</button>
                </div>
            </div>

        </div>
    )
}

export default Modal
