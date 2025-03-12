const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/pets`;

const index = async () => {
    try {
        const res = await fetch(BASE_URL) // GET localhost:3000/pets response from API
        return res.json()
    } catch (err) {
        console.log(err)
    }

}
console.log(await index());


export {
    index, 
}

