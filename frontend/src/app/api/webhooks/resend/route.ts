import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET!;

// Verify Resend webhook signature
function verifySignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("base64");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("resend-signature") || "";

    // Verify webhook signature
    if (RESEND_WEBHOOK_SECRET && !verifySignature(payload, signature, RESEND_WEBHOOK_SECRET)) {
      console.error("❌ Invalid Resend webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(payload);

    console.log("📧 Resend webhook received:", event.type);

    // Handle different email events
    switch (event.type) {
      case "email.sent":
        console.log("✅ Email sent:", event.data.id, "to:", event.data.to);
        break;

      case "email.delivered":
        console.log("📬 Email delivered:", event.data.id);
        break;

      case "email.opened":
        console.log("👀 Email opened:", event.data.id);
        break;

      case "email.clicked":
        console.log("🔗 Email link clicked:", event.data.id);
        break;

      case "email.bounced":
        console.error("⚠️ Email bounced:", event.data.id, "reason:", event.data.bounce?.message);
        break;

      case "email.complained":
        console.error("🚨 Email marked as spam:", event.data.id);
        break;

      case "contact.created":
        console.log("👤 Contact created:", event.data.email);
        break;

      case "contact.deleted":
        console.log("🗑️ Contact deleted:", event.data.email);
        break;

      default:
        console.log("📨 Unhandled Resend event:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Resend webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Handle GET requests (for webhook verification if needed)
export async function GET() {
  return NextResponse.json({ status: "Resend webhook endpoint active" });
}
