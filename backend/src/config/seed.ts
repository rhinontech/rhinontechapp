import { sequelize } from "./database";
import { Role, Permission, User, InboxConversation, InboxMessage, InboxEmail, Task, Attendance, syncDatabase } from "../models";
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

  // Superadmin — all permissions
  const [superadminRole] = await Role.findOrCreate({
    where: { slug: "superadmin" },
    defaults: { name: "Super Admin", slug: "superadmin" },
  });
  await (superadminRole as any).setPermissions(permissionInstances);
  console.log("Superadmin role seeded");

  // HR — manage team + payroll, no provisioning/settings
  const hrPermissions = permissionInstances.filter((p) =>
    ["dashboard:read", "employees:read", "employees:write", "people:read",
     "payroll:read", "payroll:write", "payslips:read", "inbox:read", "inbox:write"].includes(p.name)
  );
  const [hrRole] = await Role.findOrCreate({
    where: { slug: "hr" },
    defaults: { name: "HR", slug: "hr" },
  });
  await (hrRole as any).setPermissions(hrPermissions);
  console.log("HR role seeded");

  // Employee — own payslips + dashboard + read-only team directory
  const employeePermissions = permissionInstances.filter((p) =>
    ["dashboard:read", "payslips:read", "people:read"].includes(p.name)
  );
  const [employeeRole] = await Role.findOrCreate({
    where: { slug: "employee" },
    defaults: { name: "Employee", slug: "employee" },
  });
  await (employeeRole as any).setPermissions(employeePermissions);
  console.log("Employee role seeded");

  // Prabhat Patra — the one superadmin
  const passwordHash = await bcrypt.hash("Admin@123", 10);
  // Migrate from old admin@rhinontech.in if it exists
  let user = await User.findOne({ where: { companyEmail: "prabhat@rhinontech.in" } });
  if (!user) user = await User.findOne({ where: { companyEmail: "admin@rhinontech.in" } });
  if (!user) {
    user = await User.create({
      fullName: "Prabhat Patra",
      personalEmail: "prabhatpatra24@gmail.com",
      companyEmail: "prabhat@rhinontech.in",
      passwordHash,
      roleId: superadminRole.id,
      department: "Engineering",
      joiningDate: new Date("2024-05-06"),
      dateOfBirth: new Date("1994-05-06"),
      status: "active",
    });
    console.log("Superadmin user created: prabhat@rhinontech.in / Admin@123");
  } else {
    console.log("Superadmin user found — updating to prabhat@rhinontech.in");
  }
  await user.update({
    fullName: "Prabhat Patra",
    personalEmail: "prabhatpatra24@gmail.com",
    companyEmail: "prabhat@rhinontech.in",
    roleId: superadminRole.id,
    joiningDate: new Date("2024-05-06"),
    dateOfBirth: new Date("1994-05-06"),
    employmentType: "Full-Time",
    compensationType: "Salaried",
    workSchedule: "Standard (Mon-Fri)",
    workLocation: "Bengaluru",
    paymentFrequency: "Monthly",
    basicSalary: 20000,
    hra: 0,
    ta: 0,
    medicalAllowance: 0,
    otherAllowances: 0,
    pfEnabled: false,
    ptAmount: 0,
    tdsAmount: 0,
  });

  const supportPasswordHash = await bcrypt.hash("Support@123", 10);
  // Ishra may exist with old companyEmail "support@rhinontech.in" — migrate to ishra@rhinontech.in
  let supportUser = await User.findOne({ where: { personalEmail: "ishra@rhinontech.in" } });
  if (!supportUser) {
    supportUser = await User.findOne({ where: { companyEmail: "support@rhinontech.in" } });
  }
  if (!supportUser) {
    supportUser = await User.create({
      fullName: "Ishra Fatima",
      personalEmail: "ishra@rhinontech.in",
      companyEmail: "ishra@rhinontech.in",
      passwordHash: supportPasswordHash,
      roleId: employeeRole.id,
      department: "Support",
      joiningDate: new Date("2023-05-15"),
      dateOfBirth: new Date("1996-05-15"),
      status: "active",
    });
  }
  await supportUser.update({
    companyEmail: "ishra@rhinontech.in",
    personalEmail: "ishra@rhinontech.in",
    roleId: employeeRole.id,
    joiningDate: new Date("2023-05-15"),
    dateOfBirth: new Date("1996-05-15"),
    employmentType: "Full-Time",
    compensationType: "Salaried",
    workSchedule: "Standard (Mon-Fri)",
    workLocation: "Hyderabad",
    paymentFrequency: "Monthly",
    basicSalary: 15000,
    hra: 0,
    ta: 0,
    medicalAllowance: 0,
    otherAllowances: 0,
    pfEnabled: false,
    ptAmount: 0,
    tdsAmount: 0,
  });

  // Additional demo employees — startup salaries, no allowances, no PF/PT
  const demoEmployees = [
    {
      fullName: "Aarav Mehta",
      personalEmail: "aarav@rhinontech.in",
      companyEmail: "aarav@rhinontech.in",
      passwordHash: await bcrypt.hash("Demo@123", 10),
      roleId: employeeRole.id,
      department: "Product",
      joiningDate: new Date("2026-04-28"),
      dateOfBirth: new Date("1995-03-12"),
      status: "active" as const,
      employmentType: "Full-Time", compensationType: "Salaried",
      workSchedule: "Standard (Mon-Fri)", workLocation: "Bengaluru", paymentFrequency: "Monthly",
      basicSalary: 18000, hra: 0, ta: 0, medicalAllowance: 0, otherAllowances: 0,
      pfEnabled: false, ptAmount: 0, tdsAmount: 0,
    },
    {
      fullName: "Priya Nair",
      personalEmail: "priya@rhinontech.in",
      companyEmail: "priya@rhinontech.in",
      passwordHash: await bcrypt.hash("Demo@123", 10),
      roleId: employeeRole.id,
      department: "Design",
      joiningDate: new Date("2026-05-01"),
      dateOfBirth: new Date("1998-07-22"),
      status: "active" as const,
      employmentType: "Full-Time", compensationType: "Salaried",
      workSchedule: "Standard (Mon-Fri)", workLocation: "Mumbai", paymentFrequency: "Monthly",
      basicSalary: 16000, hra: 0, ta: 0, medicalAllowance: 0, otherAllowances: 0,
      pfEnabled: false, ptAmount: 0, tdsAmount: 0,
    },
    {
      fullName: "Kabir Shah",
      personalEmail: "kabir@rhinontech.in",
      companyEmail: "kabir@rhinontech.in",
      passwordHash: await bcrypt.hash("Demo@123", 10),
      roleId: employeeRole.id,
      department: "Engineering",
      joiningDate: new Date("2025-05-20"),
      dateOfBirth: new Date("1993-05-20"),
      status: "active" as const,
      employmentType: "Full-Time", compensationType: "Salaried",
      workSchedule: "Standard (Mon-Fri)", workLocation: "Bengaluru", paymentFrequency: "Monthly",
      basicSalary: 22000, hra: 0, ta: 0, medicalAllowance: 0, otherAllowances: 0,
      pfEnabled: false, ptAmount: 0, tdsAmount: 0,
    },
    {
      fullName: "Neha Kapoor",
      personalEmail: "neha@rhinontech.in",
      companyEmail: "neha@rhinontech.in",
      passwordHash: await bcrypt.hash("Demo@123", 10),
      roleId: employeeRole.id,
      department: "Finance",
      joiningDate: new Date("2024-08-10"),
      dateOfBirth: new Date("1997-11-03"),
      status: "active" as const,
      employmentType: "Full-Time", compensationType: "Salaried",
      workSchedule: "Standard (Mon-Fri)", workLocation: "Delhi", paymentFrequency: "Monthly",
      basicSalary: 17000, hra: 0, ta: 0, medicalAllowance: 0, otherAllowances: 0,
      pfEnabled: false, ptAmount: 0, tdsAmount: 0,
    },
    {
      fullName: "Rohan Desai",
      personalEmail: "rohan@rhinontech.in",
      companyEmail: "rohan@rhinontech.in",
      passwordHash: await bcrypt.hash("Demo@123", 10),
      roleId: employeeRole.id,
      department: "Sales",
      joiningDate: new Date("2026-05-05"),
      dateOfBirth: new Date("1999-09-18"),
      status: "active" as const,
      employmentType: "Full-Time", compensationType: "Salaried",
      workSchedule: "Standard (Mon-Fri)", workLocation: "Pune", paymentFrequency: "Monthly",
      basicSalary: 14000, hra: 0, ta: 0, medicalAllowance: 0, otherAllowances: 0,
      pfEnabled: false, ptAmount: 0, tdsAmount: 0,
    },
  ];

  for (const emp of demoEmployees) {
    const { employmentType, compensationType, workSchedule, workLocation, paymentFrequency,
            basicSalary, hra, ta, medicalAllowance, otherAllowances,
            pfEnabled, ptAmount, tdsAmount, roleId, ...defaults } = emp;
    const [demoUser] = await User.findOrCreate({ where: { companyEmail: emp.companyEmail }, defaults: { ...defaults, roleId } });
    await demoUser.update({ roleId, employmentType, compensationType, workSchedule, workLocation, paymentFrequency,
                            basicSalary, hra, ta, medicalAllowance, otherAllowances,
                            pfEnabled, ptAmount, tdsAmount });
  }
  console.log("Demo employees seeded");

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

  // Seed tasks
  const taskSeeds = [
    {
      title: "Cashbox reconciliation",
      description: "Prepare cashbox reconciliation and confirm variance before closing.",
      assigneeId: user.id,
      createdById: user.id,
      team: "Finance",
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      status: "Pending" as const,
    },
    {
      title: "Payroll salary audit",
      description: "Validate salary setup for employees with missing HRA or basic salary.",
      assigneeId: user.id,
      createdById: user.id,
      team: "Payroll",
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      status: "Pending" as const,
    },
    {
      title: "Attendance policy review",
      description: "Check regularization and overtime rules before publishing the work module.",
      assigneeId: supportUser.id,
      createdById: user.id,
      team: "People Ops",
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      status: "In progress" as const,
    },
    {
      title: "Onboarding checklist update",
      description: "Update the onboarding checklist to reflect the new SSO requirements.",
      assigneeId: supportUser.id,
      createdById: supportUser.id,
      team: "HR",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: "Done" as const,
    },
    {
      title: "Q2 expense report",
      description: "Compile Q2 expense report across all departments for finance review.",
      assigneeId: user.id,
      createdById: user.id,
      team: "Finance",
      dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      status: "In progress" as const,
    },
  ];

  for (const t of taskSeeds) {
    await Task.findOrCreate({
      where: { title: t.title, assigneeId: t.assigneeId },
      defaults: t,
    });
  }
  console.log("Tasks seeded");

  // Seed attendance records for current month
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const seedUserId of [user.id, supportUser.id]) {
    for (let d = 1; d <= today.getDate(); d++) {
      const date = new Date(today.getFullYear(), today.getMonth(), d);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isToday = d === today.getDate();

      if (isWeekend) continue;

      // For today, only add if user clocked in (skip so it's naturally absent)
      if (isToday) continue;

      const clockInHour = 8 + Math.floor(Math.random() * 2);
      const clockInMin = Math.floor(Math.random() * 30);
      const clockIn = new Date(date);
      clockIn.setHours(clockInHour, clockInMin, 0, 0);

      const workHours = 8 + Math.floor(Math.random() * 2);
      const clockOut = new Date(clockIn.getTime() + workHours * 60 * 60 * 1000);

      await Attendance.findOrCreate({
        where: { userId: seedUserId, date },
        defaults: {
          userId: seedUserId,
          date,
          clockIn,
          clockOut,
          status: "present",
        },
      });
    }
  }
  console.log("Attendance seeded");

  await sequelize.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
