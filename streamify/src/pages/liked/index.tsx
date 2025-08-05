import React, { Suspense,useState,useEffect } from 'react'
import LikedContent from '@/components/ui/LikedContent';


const index = () => {
    
    return (
        <main className="flex-1 p-6">
            <div className="max-w-4xl">
                <h1 className="text-2xl font-bold mb-6">Liked videos</h1>
                <Suspense fallback={<div>Loading...</div>}>
                    <LikedContent/>
                </Suspense>
            </div>
        </main>
    )
}

export default index;