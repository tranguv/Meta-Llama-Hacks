"use client";
import React from 'react';
import { Input } from '@/components/ui/input';

const SignInPage = () => {

    function onSubmit(values: any) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    }

    return (
        <div className='flex min-h-screen justify-center'>
            <div className='flex flex-col w-[400px] m-8 shadow-lg border-black'>
                <div className='px-10 py-4'>
                    <h1 className='text-3xl text-center p-4'>Sign In</h1>
                    <div className='flex flex-col gap-4 mt-4'>

                        <form onSubmit={onSubmit} className="space-y-8">
                            <Input type='email' placeholder='Email' />
                            <Input type='password' placeholder='Password' />
                            <button type='submit' className='bg-black w-full text-white p-2 rounded-md'>Log In</button>
                        </form>
                        <div className='text-right text-sm '>
                            <a href='/forgot-password'>Forgot password</a>
                        </div>
                        <h2 className="w-full text-center border-b border-black leading-[0.1em] my-[10px_0_20px] mt-4 text-xs">
                            <span className="bg-[rgb(243,244,246)] px-2 text-slate-400">OR CONTINUE WITH</span>
                        </h2>
                        <button className='bg-white text-black p-2 rounded-md'>Googlr</button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SignInPage;
