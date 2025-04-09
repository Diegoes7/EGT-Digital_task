
// Function to validate the required fields, all in one place

export const validateField = (field: string, value: string) => {
  let errors: string[] = []

  switch (field) {
    case 'username':
      if (!value) errors.push('Username is required.')
      if (value.length < 3) errors.push('Username must be at least 3 characters.')
      break
    case 'email':
      if (!value) errors.push('Email is required.')
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(value)) errors.push('Invalid email format.')
      break
    case 'street':
    case 'suite':
    case 'city':
      if (!value) errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`)
      break
    // Add any other fields to validate...
    default:
      break
  }

  return errors
}


