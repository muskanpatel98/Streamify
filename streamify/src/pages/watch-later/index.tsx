import React, { Suspense,useState,useEffect } from 'react'
import WatchLaterContent from '@/components/ui/WatchLaterContent';


const index = () => {
    
    return (
        <main className="flex-1 p-6">
            <div className="max-w-4xl">
                <h1 className="text-2xl font-bold mb-6">Watch Later</h1>
                <Suspense fallback={<div>Loading...</div>}>
                    <WatchLaterContent/>
                </Suspense>
            </div>
        </main>
    )
}

export default index;