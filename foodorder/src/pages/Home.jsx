import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Categorycomp from './Categorycomp'
import Foodcomp from './Foodcomp'
import Recommendations from '../Components/Recommendations'
import Food from '../Components/Food'
import { getUserEmail } from '../utils/localStorage'

const Home = () => {
  const [cart, setCart] = useState([])
  const [quantities, setQuantities] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userEmail, setUserEmail] = useState(() => getUserEmail() || null);

  useEffect(() => {
    // Load user email from localStorage if available
    const savedEmail = getUserEmail();
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  return (
    <>
      <Navbar 
        cart={cart} 
        setCart={setCart} 
        quantities={quantities} 
        setQuantities={setQuantities}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setUserEmail={setUserEmail}
      />
      {userEmail && (
        <Recommendations
          userEmail={userEmail}
          allFoodItems={Food}
          cart={cart}
          setCart={setCart}
          quantities={quantities}
          setQuantities={setQuantities}
        />
      )}
      <Categorycomp setSelectedCategory={setSelectedCategory} />
      <Foodcomp
        cart={cart}
        setCart={setCart}
        quantities={quantities}
        setQuantities={setQuantities}
        selectedCategory={selectedCategory}
      />
    </>
  )
}

export default Home