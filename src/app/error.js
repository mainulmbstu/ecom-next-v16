'use client'

import { useRouter } from 'next/navigation';
import React, { startTransition } from 'react'

const Error = ({error, reset}) => {
  console.log(error);
  let router = useRouter()
  let reload = () => {
    startTransition(() => {
      router.refresh()
      reset()
    })
  }
  return (
    <div className=" h-screen flex justify-center items-center text-4xl text-center">
      <div>
        <h3>{error.message}</h3>
        <button onClick={reload} className='btn '>Retry</button>
      </div>
    </div>
  );
}

export default Error
