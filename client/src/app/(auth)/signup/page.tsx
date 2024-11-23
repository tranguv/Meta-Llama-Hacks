"use client";

import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

const SignUpPage = () => {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        dob: new Date(),
        username: "",
        password: "",
    });

    function onSubmit(values: any) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, dob: new Date(e.target.value) });
    };

    return (
        <div className='flex min-h-screen justify-center'>
            <div className='flex flex-col w-[400px] m-8 shadow-lg border-black'>
                <div className='px-10 py-4'>
                    <h1 className='text-3xl text-center p-4'>Sign Up</h1>
                    <div className='flex flex-col gap-4 mt-4'>
                        <form onSubmit={onSubmit} className="space-y-8">
                            <div className='flex flex-row gap-4'>
                                <Input type='text' placeholder='First Name' />

                                <Input type='text' placeholder='Last Name' />

                            </div>

                            <Input
                                className='w-full'
                                type='date'
                                placeholder='YYYY-MM-DD'
                                value={form.dob ? format(form.dob, 'yyyy-MM-dd') : ''}
                                onChange={onChange}

                            />

                            <Input type='email' placeholder='Email' />

                            <Input type='password' placeholder='Password' />

                            <button type='submit' className='bg-black w-full text-white p-2 rounded-md'>Sign Up</button>
                        </form>
                        <h2 className="w-full text-center border-b border-black leading-[0.1em] my-[10px_0_20px] mt-4 text-xs">
                            <span className="bg-[rgb(243,244,246)] px-2 text-slate-400">OR CONTINUE WITH</span>
                        </h2>
                        <button className='bg-white text-black p-2 rounded-md'>Googlr</button>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default SignUpPage;
