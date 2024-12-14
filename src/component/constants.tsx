export const postUserProfile = async () => {
  const bodyParams = {
    fullName: 'John Doe', // Ensure this field is properly formatted.
    gender: 'male', // Check for accepted values ('male', 'female', etc.).
    age: 30, // Age should be a number within the accepted range.
    location: 'New York, USA', // Ensure proper formatting if location has constraints.
    email: 'johndoe2311124223223@example.com', // Validate email format.
    phoneNumber: '+1234567890', // Ensure the phone number format matches the server's expectations.
    isPhoneVerified: true, // This should be a boolean.
    isProfileComplete: false, // This should be a boolean.
  };

  try {
    const response = await fetch('https://ndc.gidis.tech/api/user-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyParams),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from server:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('User Profile Response:', data);
    return data;
  } catch (error) {
    console.error('Error posting user profile:', error);
    throw error;
  }
};
