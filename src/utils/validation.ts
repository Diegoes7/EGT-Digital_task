
// Function to validate the required fields, all in one place
export const validateField = (field: string, value: string) => {
  let errors: string[] = []

  // Regular expression for validating the phone number
  // const phoneRegex = /^(\+?[\d]{1,4})?[\s\-]?[0-9]{1,4}[\s\-]?[0-9]{1,4}[\s\-]?[0-9]{1,4}$/
  const phoneRegexWithCharacters = /^(\+?[0-9]{1,4}[\s-]?)?(\(?[0-9]{2,4}\)?[\s-]?){2,3}(x|ext)?\s?\d{1,6}$/i;



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
    case 'name':
      if (value.length < 5) errors.push('Username must be at least 5 characters.')
      break
    case 'phone':
      if (!value) {
        errors.push('Phone number is required.')
      } else if (!phoneRegexWithCharacters.test(value)) {
        errors.push('Phone number must be consisted of 6 or more digits and can add characters too.')
      }
      break
    // Add any other fields to validate...
    default:
      break
  }

  return errors
}


