import { useState, useEffect } from 'react'
import * as petService from './services/petService';
import PetList from './components/PetList/PetList';
import PetDetail from './components/PetDetail/PetDetail';
import PetForm from './components/PetForm/PetForm';
import './App.css'

const App = () => {
  const [pets, setPets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const fetchedPets = await petService.index();
        // Don't forget to pass the error object to the new Error
        if (fetchedPets.err) {
          throw new Error(fetchedPets.err);
        }
        setPets(fetchedPets);
      } catch (err) {
        // Log the error object
        console.log(err);
      }
    };
    fetchPets();
  }, []);

  const handleSelect = (pet) => {
    setSelected(pet)
  }

  const handleFormView = (pet) => {
    if (!pet._id) setSelected(null);
    setIsFormOpen(!isFormOpen);
  };

  const handleAddPet = async (formData) => {
    try {
      // Call petService.create, assign return value to newPet
      const newPet = await petService.create(formData);

      if (newPet.err) {
        throw new Error(newPet.err);
      }
  

      setPets([newPet, ...pets]);
       // Close the form after we've added the new pet
    setIsFormOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

// src/App.jsx

const handleUpdatePet = async (formData, petId) => {
  try {
    const updatedPet = await petService.update(formData, petId);

    // handle potential errors
    if (updatedPet.err) {
      throw new Error(updatedPet.err);
    }

    const updatedPetList = pets.map((pet) => (
      // If the _id of the current pet is not the same as the updated pet's _id,
      // return the existing pet.
      // If the _id's match, instead return the updated pet.
      pet._id !== updatedPet._id ? pet : updatedPet
    ));
    // Set pets state to this updated array
    setPets(updatedPetList);
    // If we don't set selected to the updated pet object, the details page will
    // reference outdated data until the page reloads.
    setSelected(updatedPet);
    setIsFormOpen(false);
  } catch (err) {
    console.log(err);
  }
};


  return (
    // src/App.jsx

    <>
      <PetList
        pets={pets}
        handleSelect={handleSelect}
        handleFormView={handleFormView}
        isFormOpen={isFormOpen}
      />
      {/* Pass handleUpdatePet to PetForm */}
      {isFormOpen ? (
        <PetForm
          handleAddPet={handleAddPet}
          selected={selected}
          handleUpdatePet={handleUpdatePet}
        />
      ) : (
        <PetDetail selected={selected} handleFormView={handleFormView}/>
      )}
    </>

  ); 
};

export default App;
