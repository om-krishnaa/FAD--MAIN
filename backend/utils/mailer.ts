import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

if (
  !process.env.SMTP_USER ||
  !process.env.SMTP_PASS ||
  !process.env.SMTP_HOST ||
  !process.env.SMTP_PORT
) {
  throw new Error(
    "Please provide SMTP_USER, SMTP_PASS, SMTP_HOST, and SMTP_PORT in your .env file"
  );
}

// Create transporter instance
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Function to test email config
export const testEmailConfig = async (): Promise<boolean> => {
  try {
    console.log("\n🔧 === TESTING EMAIL CONFIGURATION ===");
    console.log(`📧 SMTP user: ${process.env.SMTP_USER}`);
    console.log("🔧 Verifying transporter...");

    await transporter.verify();

    console.log("✅ EMAIL CONFIGURATION IS VALID!");
    console.log("✅ Ready to send real emails!");
    console.log("🔧 === EMAIL TEST COMPLETE ===\n");

    return true;
  } catch (error: any) {
    console.error("\n❌ === EMAIL CONFIGURATION ERROR ===");
    console.error(`❌ Error: ${error.message}`);
    console.error("📧 Please check your SMTP credentials and App Password");
    console.error("❌ === EMAIL TEST FAILED ===\n");

    return false;
  }
};
