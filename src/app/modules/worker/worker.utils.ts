import { Worker } from "./worker.model";

// Function to generate a random 9-character alphanumeric string
const generateRandomInviteID = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Pool of characters to choose from
  let inviteID = "";

  // Generate a random string of 9 characters
  for (let i = 0; i < 9; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    inviteID += characters[randomIndex];
  }

  return inviteID;
};

const generateReferCode = async () => {
  let referID = ""; // Initialize the inviteID
  let isUnique = false;

  // Keep generating until a unique inviteID is found
  while (!isUnique) {
    const randomCode = generateRandomInviteID();
    referID = randomCode;

    // Check if the inviteID already exists in the database
    const existingCode = await Worker.findOne({ inviteID: referID }).lean();

    // If the inviteID doesn't exist, mark it as unique
    if (!existingCode) {
      isUnique = true;
    }
  }

  return referID;
};

export default generateReferCode;
