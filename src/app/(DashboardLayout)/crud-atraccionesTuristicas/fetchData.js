export async function fetchData(url, _data) {
    const { images, contacts, ...data } = _data
    try {
        console.log('dara', data)
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(response)
            throw new Error(`Network response was not ok: ${errorData.message || 'Unknown error'}`);
        }
        const responseAtrac = await response.json()
        const attraction_id = responseAtrac.attraction.attraction_id


        if (contacts) {
            const response = await fetch('http://localhost:9000/sit/atraccion-contacto/agregar', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({contacts, entity_id: attraction_id})
            });
            console.log(await response.json())

            if (!response.ok) {
                const response = await fetch('http://localhost:9000/sit/atraccion/eliminar/' + attraction_id, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log(await response.json())

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Network response was not ok: ${errorData.message || 'Unknown error'}`);
                }
            }
        }

        if (images.length !== 0) {
            const formData = new FormData();
            images.forEach((file) => {
                formData.append('images', file); // 'images' es la clave que esperas en el backend
            });
            const response = await fetch('http://localhost:9000/sit/atraccion/agregar-imagenes/' + attraction_id, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (!response.ok) {
                console.log(response)
                const response = await fetch('http://localhost:9000/sit/atraccion/eliminar/' + attraction_id, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const errorData = await response.json();
                throw new Error(`Network response was not ok: ${errorData.message || 'Unknown error'}`);
            }

        }

        return responseAtrac;

    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
