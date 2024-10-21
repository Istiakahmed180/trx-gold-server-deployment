import { Verification } from "./verification.model"; // Assuming you have a Verification model

const generateValidationCode = async () => {
  let validationCode = ''; // Initialize validation code

  // Generate a 6-digit random number
  const generateRandomNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  let isUnique = false;

  // Keep generating until a unique validation code is found
  while (!isUnique) {
    const randomCode = generateRandomNumber();
    validationCode = randomCode.toString();

    // Check if the validation code exists in the database
    const existingCode = await Verification.findOne({ code: validationCode }).lean();

    // If the code doesn't exist, set isUnique to true to exit the loop
    if (!existingCode) {
      isUnique = true;
    }
  }

  return validationCode;
};

export default generateValidationCode;
