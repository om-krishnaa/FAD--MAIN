export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const generateResetToken = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
