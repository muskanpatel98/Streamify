import React, { Suspense,useState,useEffect } from 'react'
import HistoryContent from '@/components/ui/HistoryContent';


const index = () => {
    
    return (
        <main className="flex-1 p-6">
            <div className="max-w-4xl">
                <h1 className="text-2xl font-bold mb-6">Watch History</h1>
                <Suspense fallback={<div>Loading...</div>}>
                    <HistoryContent/>
                </Suspense>
            </div>
        </main>
    )
}

export default index;