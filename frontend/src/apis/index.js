const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const register = async (data) => {
  const response = await fetch(`${BACKEND_URL}/api/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if(response.status === 201 || response.status === 400) {
    return response.json();
  } else {
    throw new Error('Error registering user');
  }
};

export const login = async (data) => {
  const response = await fetch(`${BACKEND_URL}/api/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if(response.status === 200 || response.status === 400) {
    return response.json();
  } else {
    throw new Error('Error logging in user');
  }
};

export const fetchData = async (id) => {
  const response = await fetch(`${BACKEND_URL}/api/user/data/${id}`, {
    method: 'GET',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `${localStorage.getItem('token')}`,
    },
  });
  if(response.status === 200){
    return response.json();
  } else {
    throw new Error('Error fetching user');
  }
};


export const deleteFolder = async (id) => {
  const response = await fetch (`${BACKEND_URL}/api/user/folder/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${localStorage.getItem('token')}`,
    }
  })

  if(response.status === 200){
    return response.json();
  } else {
    throw new Error('Error updating address');
  }
};

export const deleteFile = async (id) => {
  const response = await fetch(`${BACKEND_URL}/api/user/file/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${localStorage.getItem('token')}`,
    }
  })

  if(response.status === 200){
    return response.json();
  } else {
    throw new Error('error deleting file')
  }
}


export const updateUser = async (data) => {
  const response = await fetch(`${BACKEND_URL}/api/user/update`, {
    method: 'PUT',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data)
  });
  if(response.status === 200 || response.status === 400){
    return response.json();
  } else {
    throw new Error('Error fetching user');
  }
};

export const createFolder = async (data) => {
  const response = await fetch(`${BACKEND_URL}/api/user/folder`, {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if(response.status === 201 || response.status === 400){
    return response.json();
  } else {
    throw new Error('Error Creating Folder');
  }
}

export const createFileWithoutFolder = async (data) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/withoutFolder`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error creating file');
    }
  } catch (error) {
    console.error('Error in API call:', error);
    throw error;
  }
};

export const createFile = async (id, data) => {
  const response = await fetch(`${BACKEND_URL}/api/user/file/${id}`,{
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data)
  });
  if(response.status === 201){
    return response.json();
  } else {
    throw new Error('Error Creating File');
  }
}

export const addFileData = async (id, data) => {
  const response = await fetch(`${BACKEND_URL}/api/user/fileData/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({data})
  });
  if(response.status === 200){
    return response.json();
  } else {
    throw new Error('Error creating form bot');
  }
}

export const fetchForm = async (id) => {
  const response = await fetch(`${BACKEND_URL}/api/user/fileData/${id}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if(response.status === 200){
    return response.json();
  } else {
    throw new Error('Error Fetching Form');
  }
}

export const submitFormData = async (id, data) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/submit-form/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    if(response.status === 201){
      return response.json();
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.log(error)
    throw new Error('Error submiting form')
  }
}

export const getFormResponses = async (id) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/form-responses/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      }
    });
    if(response.status === 200){
      return response.json()
    } else {
      throw new Error('Error getting form')
    }
  } catch (error) {
    throw new Error('Error Fetching Form Response')
  }
}

export const shareUser = async(data) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/shareduser`, {
      method : 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    if(response.status === 200){
      return response.json()
    } else {
      throw new Error('Invalid Format')
    }
  } catch (error) {
    console.log(error);
    throw new Error('Error sharing User')
  }
}

export const getSharedUser = async() => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/sharedusers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      },
  
    });
    if(response.status === 200){
      return response.json();
    } else {
      return
    }
  } catch (error) {
    throw new Error('Error getting shared user');
  }
}