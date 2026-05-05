import { sequelize } from "./database";
import { Role, Permission, User, InboxConversation, InboxMessage, InboxEmail, syncDatabase } from "../models";
import bcrypt from "bcryptjs";

const ALL_PERMISSIONS = [
  { name: "dashboard:read",    resource: "dashboard",    action: "read"  },
  { name: "employees:read",    resource: "employees",    action: "read"  },
  { name: "employees:write",   resource: "employees",    action: "write" },
  { name: "provisioning:read", resource: "provisioning", action: "read"  },
  { name: "provisioning:write",resource: "provisioning", action: "write" },
  { name: "settings:read",     resource: "settings",     action: "read"  },
  { name: "settings:write",    resource: "settings",     action: "write" },
  { name: "inbox:read",        resource: "inbox",        action: "read"  },
  { name: "inbox:write",       resource: "inbox",        action: "write" },
  { name: "payroll:read",      resource: "payroll",      action: "read"  },
  { name: "payroll:write",     resource: "payroll",      action: "write" },
  { name: "payslips:read",     resource: "payslips",     action: "read"  },
  { name: "people:read",       resource: "people",       action: "read"  },
];

async function seed() {
  await sequelize.authenticate();
  await syncDatabase();

  // Create all permissions
  const permissions = await Promise.all(
    ALL_PERMISSIONS.map((p) => Permission.findOrCreate({ where: { name: p.name }, defaults: p }))
  );
  const permissionInstances = permissions.map(([p]) => p);
  console.log("Permissions seeded");

  // Create superadmin role with all permissions
  const [superadminRole] = await Role.findOrCreate({
    where: { slug: "superadmin" },
    defaults: { name: "Super Admin", slug: "superadmin" },
  });
  await (superadminRole as any).setPermissions(permissionInstances);
  console.log("Superadmin role seeded");

  // Create initial superadmin user
  const passwordHash = await bcrypt.hash("Admin@123", 10);
  const [user, created] = await User.findOrCreate({
    where: { companyEmail: "admin@rhinontech.in" },
    defaults: {
      fullName: "Super Admin",
      personalEmail: "admin@rhinontech.in",
      companyEmail: "admin@rhinontech.in",
      passwordHash,
      roleId: superadminRole.id,
      department: "Engineering",
      joiningDate: new Date(),
      status: "active",
    },
  });

  if (created) {
    console.log("Superadmin user created:");
    console.log("  Email:    admin@rhinontech.in");
    console.log("  Password: Admin@123");
  } else {
    console.log("Superadmin user already exists");
  }
  await user.update({
    employmentType: "Full-Time",
    compensationType: "Salaried",
    workSchedule: "Standard (Mon-Fri)",
    workLocation: "Bengaluru",
    paymentFrequency: "Monthly",
    basicSalary: 90000,
    hra: 36000,
    ta: 6000,
    medicalAllowance: 2500,
    otherAllowances: 8000,
  });

  const supportPasswordHash = await bcrypt.hash("Support@123", 10);
  const [supportUser] = await User.findOrCreate({
    where: { companyEmail: "support@rhinontech.in" },
    defaults: {
      fullName: "Ishra Fatima",
      personalEmail: "ishra@rhinontech.in",
      companyEmail: "support@rhinontech.in",
      passwordHash: supportPasswordHash,
      roleId: superadminRole.id,
      department: "Support",
      joiningDate: new Date(),
      status: "active",
    },
  });
  await supportUser.update({
    employmentType: "Full-Time",
    compensationType: "Salaried",
    workSchedule: "Standard (Mon-Fri)",
    workLocation: "Hyderabad",
    paymentFrequency: "Monthly",
    basicSalary: 52000,
    hra: 20800,
    ta: 4000,
    medicalAllowance: 2000,
    otherAllowances: 5000,
  });

  const conversationSeeds = [
    {
      externalId: "RH-INBOX-1001",
      subject: "Need help connecting WhatsApp channel",
      status: "open" as const,
      priority: "high" as const,
      source: "Messenger",
      customerName: "Aarav Mehta",
      customerEmail: "aarav@projectmap.com",
      customerCompany: "Project Map",
      customerLocation: "Mumbai, India",
      language: "English",
      brand: "Rhinon",
      assignedToUserId: supportUser.id,
      teamInbox: "Customer Support",
      topics: ["WhatsApp", "Channels"],
      tags: ["integration", "new-customer"],
      copilotUsed: true,
      lastMessagePreview: "Can you confirm if the WhatsApp webhook is active on your side?",
      messages: [
        { senderType: "customer" as const, senderName: "Aarav Mehta", body: "Hi, I connected our WhatsApp Business number but messages are not showing in the inbox." },
        { senderType: "agent" as const, senderName: "Ishra Fatima", body: "Thanks Aarav. I am checking the webhook configuration now." },
        { senderType: "agent" as const, senderName: "Ishra Fatima", body: "Can you confirm if the WhatsApp webhook is active on your side?" },
      ],
    },
    {
      externalId: "RH-INBOX-1002",
      subject: "Billing invoice download failing",
      status: "in_progress" as const,
      priority: "normal" as const,
      source: "Email",
      customerName: "Neha Kapoor",
      customerEmail: "neha@northstar.io",
      customerCompany: "Northstar Labs",
      customerLocation: "Delhi, India",
      language: "English",
      brand: "Rhinon",
      assignedToUserId: null,
      teamInbox: "Billing",
      topics: ["Billing", "Invoices"],
      tags: ["invoice"],
      copilotUsed: false,
      lastMessagePreview: "The March invoice opens a blank page after I click download.",
      messages: [
        { senderType: "customer" as const, senderName: "Neha Kapoor", body: "The March invoice opens a blank page after I click download." },
        { senderType: "system" as const, senderName: "Rhinon", body: "Conversation routed to Billing." },
      ],
    },
    {
      externalId: "RH-INBOX-1003",
      subject: "API token rotation request",
      status: "resolved" as const,
      priority: "urgent" as const,
      source: "Web",
      customerName: "Kabir Shah",
      customerEmail: "kabir@finpilot.co",
      customerCompany: "Finpilot",
      customerLocation: "Bengaluru, India",
      language: "English",
      brand: "Rhinon",
      assignedToUserId: supportUser.id,
      teamInbox: "Technical Support",
      topics: ["API", "Security"],
      tags: ["security", "api"],
      copilotUsed: true,
      lastMessagePreview: "We rotated the token and invalidated the old key.",
      messages: [
        { senderType: "customer" as const, senderName: "Kabir Shah", body: "We need to rotate our production API token urgently." },
        { senderType: "agent" as const, senderName: "Ishra Fatima", body: "I have verified ownership. Generating a replacement token now." },
        { senderType: "agent" as const, senderName: "Ishra Fatima", body: "We rotated the token and invalidated the old key." },
      ],
    },
    {
      externalId: "RH-INBOX-1004",
      subject: "Trial workspace setup question",
      status: "closed" as const,
      priority: "low" as const,
      source: "Chat",
      customerName: "Sara Thomas",
      customerEmail: "sara@brightdesk.com",
      customerCompany: "Brightdesk",
      customerLocation: "Pune, India",
      language: "English",
      brand: "Rhinon",
      assignedToUserId: null,
      teamInbox: "Sales Support",
      topics: ["Trial", "Workspace"],
      tags: ["trial"],
      copilotUsed: false,
      lastMessagePreview: "Thanks, that clears it up.",
      messages: [
        { senderType: "customer" as const, senderName: "Sara Thomas", body: "Can I invite teammates during the trial?" },
        { senderType: "agent" as const, senderName: "Super Admin", body: "Yes. Trial workspaces can invite teammates from settings." },
        { senderType: "customer" as const, senderName: "Sara Thomas", body: "Thanks, that clears it up." },
      ],
    },
  ];

  for (const seedConversation of conversationSeeds) {
    const lastMessageAt = new Date();
    const { messages, ...conversationDefaults } = seedConversation;
    const [conversation] = await InboxConversation.findOrCreate({
      where: { externalId: seedConversation.externalId },
      defaults: {
        ...conversationDefaults,
        lastMessageAt,
      },
    });

    const messageCount = await InboxMessage.count({ where: { conversationId: conversation.id } });
    if (messageCount === 0) {
      await InboxMessage.bulkCreate(
        messages.map((message, index) => ({
          conversationId: conversation.id,
          senderType: message.senderType,
          senderName: message.senderName,
          body: message.body,
          createdAt: new Date(lastMessageAt.getTime() - (messages.length - index) * 60000),
          updatedAt: new Date(lastMessageAt.getTime() - (messages.length - index) * 60000),
        }))
      );
    }
  }
  console.log("Inbox seed data ready");

  const now = Date.now();
  const emailSeeds = [
    {
      threadKey: "mail-welcome-001",
      folder: "inbox" as const,
      fromName: "Priya Sharma",
      fromEmail: "priya@acmecloud.com",
      toEmails: ["admin@rhinontech.in"],
      subject: "Re: Welcome to Rhinon Tech workspace",
      body: "Hi team,\n\nThanks for setting up our workspace. Could you share the onboarding checklist and confirm whether SSO can be enabled during the trial?\n\nRegards,\nPriya",
      snippet: "Thanks for setting up our workspace. Could you share the onboarding checklist and confirm whether SSO can be enabled during the trial?",
      isRead: false,
      isStarred: true,
      hasAttachment: false,
      sentAt: new Date(now - 1000 * 60 * 14),
    },
    {
      threadKey: "mail-invoice-002",
      folder: "inbox" as const,
      fromName: "Neha Kapoor",
      fromEmail: "neha@northstar.io",
      toEmails: ["billing@rhinontech.in"],
      subject: "Invoice for March subscription",
      body: "Hello,\n\nCan you resend the March invoice? The download link in the billing page opens a blank page for our finance team.\n\nThanks,\nNeha",
      snippet: "Can you resend the March invoice? The download link in the billing page opens a blank page for our finance team.",
      isRead: false,
      isStarred: false,
      hasAttachment: true,
      sentAt: new Date(now - 1000 * 60 * 58),
    },
    {
      threadKey: "mail-security-003",
      folder: "inbox" as const,
      fromName: "Kabir Shah",
      fromEmail: "kabir@finpilot.co",
      toEmails: ["security@rhinontech.in"],
      subject: "API token rotation confirmation",
      body: "Hi Rhinon,\n\nWe rotated the production API token today. Please confirm the old token is fully invalidated from your side.\n\nKabir",
      snippet: "We rotated the production API token today. Please confirm the old token is fully invalidated from your side.",
      isRead: true,
      isStarred: false,
      hasAttachment: false,
      sentAt: new Date(now - 1000 * 60 * 144),
    },
    {
      threadKey: "mail-demo-004",
      folder: "sent" as const,
      fromName: "Super Admin",
      fromEmail: "admin@rhinontech.in",
      toEmails: ["sara@brightdesk.com"],
      subject: "Product demo follow up",
      body: "Hi Sara,\n\nThanks for joining the demo. I attached the workspace setup notes and pricing summary for your review.\n\nBest,\nSuper Admin",
      snippet: "Thanks for joining the demo. I attached the workspace setup notes and pricing summary for your review.",
      isRead: true,
      isStarred: false,
      hasAttachment: true,
      sentAt: new Date(now - 1000 * 60 * 230),
    },
    {
      threadKey: "mail-release-005",
      folder: "archive" as const,
      fromName: "Rhinon Product",
      fromEmail: "product@rhinontech.in",
      toEmails: ["admin@rhinontech.in"],
      subject: "May release notes",
      body: "The May release includes faster inbox search, improved permissions, and new billing exports.",
      snippet: "The May release includes faster inbox search, improved permissions, and new billing exports.",
      isRead: true,
      isStarred: false,
      hasAttachment: false,
      sentAt: new Date(now - 1000 * 60 * 60 * 22),
    },
  ];

  for (const email of emailSeeds) {
    await InboxEmail.findOrCreate({
      where: { threadKey: email.threadKey, folder: email.folder, fromEmail: email.fromEmail },
      defaults: email,
    });
  }
  console.log("Email inbox seed data ready");

  await sequelize.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
