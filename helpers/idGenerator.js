import { customAlphabet } from "nanoid";

const hexNanoid = customAlphabet("0123456789abcdef", 24);

export const generateUserId = () => hexNanoid();
