import React from 'react'
import Category from '../Components/Category'

const Categorycomp = ({ setSelectedCategory }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Title centered above categories */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-3">🍽️ Categories</h2>
        <p className="text-gray-600 text-lg">Explore our delicious selection</p>
        <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-red-500 rounded mt-4 mx-auto"></div>
      </div>
      
      {/* Categories centered with good spacing */}
      <div className="flex flex-wrap gap-8 justify-center items-center">
        {Category.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedCategory(item.name)}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-110"
          >
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:from-orange-500 hover:to-red-500 flex flex-col items-center justify-center gap-3 w-28 h-28">
              <div className="text-4xl group-hover:scale-125 transition-transform duration-300">
                {item.image}
              </div>
              <h3 className="text-white font-bold text-center text-sm line-clamp-1">
                {item.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categorycomp