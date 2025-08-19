'use client';

import { useState } from 'react';

const SweetIceSelector = () => {
    const [selectedSweet, setSelectedSweet] = useState('Bình thường');
    const [selectedIce, setSelectedIce] = useState('Bình thường');

    const options = ['Ít', 'Bình thường', 'Nhiều'];

    return (
        <div className="mt-4">
            <p className="font-semibold">Ngọt</p>
            <div className="flex space-x-2 mt-1">
                {options.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedSweet(s)}
                        className={`px-3 py-1 border rounded transition ${selectedSweet === s
                            ? 'bg-green-700 text-white border-green-600'
                            : 'text-gray-600 border-gray-300'
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <p className="font-semibold mt-3">Đá</p>
            <div className="flex space-x-2 mt-1">
                {options.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedIce(s)}
                        className={`px-3 py-1 border rounded transition ${selectedIce === s
                            ? 'bg-green-700 text-white border-green-600'
                            : 'text-gray-600 border-gray-300'
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SweetIceSelector;
