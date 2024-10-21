import { TUser } from "./user.interface";
import { User } from "./user.model";

const findLastUserId = async () => {
  const lastuser = await User.findOne({ role: "user" })
    .sort({ createdAt: -1 })
    .lean();

  return lastuser?.userId;
};

export const generateUserId = async (payload: TUser) => {
  let currentId = "0000"; // Set a default starting value
  const lastStudentId = await findLastUserId();
  let fname = payload.firstName.toLowerCase(); // Convert to lowercase to avoid case sensitivity issues
  let lname = payload.lastName.toLowerCase(); // Convert to lowercase to avoid case sensitivity issues

  // Limit first name and last name to first 3 and last 3 characters, respectively
  fname = fname.substring(0, 3);
  lname = lname.substring(Math.max(0, lname.length - 3));

  let lastNumber = 0; // Initialize lastNumber to handle NaN case

  if (lastStudentId) {
    const lastIdSubstring = lastStudentId.substring(
      fname.length + lname.length
    ); // Get the numeric part
    lastNumber = parseInt(lastIdSubstring, 10);
  }

  // If lastNumber is NaN or not a number, default it to 0
  if (isNaN(lastNumber)) {
    lastNumber = 0;
  }

  const nextNumber = lastNumber + 1;
  currentId = nextNumber.toString().padStart(4, "0");

  return `${fname}${lname}${currentId}`;
};
