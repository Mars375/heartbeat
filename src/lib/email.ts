import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendIncidentNotification(
  to: string[],
  incident: { title: string; severity: string; status: string; statusPageUrl: string }
) {
  if (to.length === 0) return;

  await resend.emails.send({
    from: "Heartbeat <notifications@heartbeat.dev>",
    to,
    subject: `[${incident.severity.toUpperCase()}] ${incident.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FB7185;">Incident: ${incident.title}</h2>
        <p><strong>Severity:</strong> ${incident.severity}</p>
        <p><strong>Status:</strong> ${incident.status}</p>
        <p><a href="${incident.statusPageUrl}" style="color: #10B981;">View Status Page</a></p>
      </div>
    `,
  });
}

export async function sendMonitorDownAlert(
  to: string[],
  monitor: { name: string; url: string },
  statusPageUrl: string
) {
  if (to.length === 0) return;
  await resend.emails.send({
    from: "Heartbeat <notifications@heartbeat.dev>",
    to,
    subject: `🔴 ${monitor.name} is down`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FB7185;">Monitor Alert: ${monitor.name}</h2>
        <p>Your monitor is currently <strong>down</strong>.</p>
        <p><strong>URL:</strong> ${monitor.url}</p>
        <p><a href="${statusPageUrl}" style="color: #10B981;">View Status Page →</a></p>
      </div>
    `,
  });
}

export async function sendVerificationEmail(to: string, verifyUrl: string) {
  await resend.emails.send({
    from: "Heartbeat <notifications@heartbeat.dev>",
    to,
    subject: "Verify your subscription",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Confirm your subscription</h2>
        <p>Click the link below to verify your email and receive status updates:</p>
        <p><a href="${verifyUrl}" style="color: #10B981; font-weight: bold;">Verify Email</a></p>
      </div>
    `,
  });
}
