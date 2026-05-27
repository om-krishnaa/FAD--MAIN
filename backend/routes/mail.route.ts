import { Router, Request, Response } from "express";
import { testEmailConfig } from "../utils/mailer";
import { sendVerificationEmail } from "../services/email.service";

const router = Router();

router.get("/verify-config", async (req: Request, res: Response) => {
  try {
    console.log("🧪 Testing Gmail connection...");
    await testEmailConfig();
    console.log("✅ Gmail connection successful!");

    res.json({
      success: true,
      message: "Gmail connection is working!",
    });
  } catch (error: any) {
    console.error("❌ Gmail connection failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Gmail connection failed: " + error.message,
      error: error.code,
    });
  }
});

router.post("/test-mail", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    console.log(`🧪 Testing email to: ${email}`);
    const testCode = "123456";
    const emailSent = await sendVerificationEmail(email, testCode);

    if (emailSent) {
      res.json({
        success: true,
        message: `✅ Test email sent successfully to ${email}!`,
        code: testCode,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "❌ Failed to send test email. Check server logs.",
      });
    }
  } catch (error: any) {
    console.error("❌ Test email error:", error.message);
    res.status(500).json({
      success: false,
      message: "Test email error: " + error.message,
    });
  }
});

module.exports = router;
