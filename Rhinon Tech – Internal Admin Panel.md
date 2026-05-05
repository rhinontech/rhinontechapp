# Rhinon Tech – Internal Admin Panel (Product Spec)

## Overview
Build an internal admin panel for Rhinon Tech to manage employees, onboarding, access, and company operations.

This is NOT a public SaaS product.  
This is an internal "Company OS" to automate HR + IT workflows.

---

## Roles & Permissions

### Super Admin
- Full system access
- Create / delete admins
- Onboard employees
- Assign roles
- Trigger account provisioning (email, tools)

### Admin (HR / Ops)
- Onboard employees
- Manage employee data
- Cannot manage super admins

### Employee
- View own profile
- Submit requests (leave, etc. - future scope)

---

## Employee Onboarding Flow (Core Feature)

### Input Fields
- Name
- Personal email
- Role (Developer, Designer, etc.)
- Department
- Joining date

---

## System Actions (Automated)

When employee is created:

1. Generate company email  
- Example: firstname@rhinontech.in from aws route

2. Provision accounts (Phase 2)
- Google Workspace (Gmail)
- Slack
- GitHub org invite

3. Store employee data

4. Send onboarding email

---

## Employee Profile

Each employee record should include:

- Full name
- Role
- Department
- Work email
- Status (Active / Inactive)
- Joining date
- Assigned assets (future)
- Access logs (optional)

---

## Offboarding Flow

When an employee leaves:

- Disable company email
- Revoke tool access
- Mark employee as inactive
- Archive employee data

---

## IT / Access Management

Track:
- Tools assigned to each employee
- Account status (active / revoked)
- Provisioning history

---

## Admin Dashboard

Display:

- Total employees
- Active vs inactive employees
- Recent onboardings
- Pending actions

---

## MVP Scope (Phase 1)

Build only:

- Superadmin authentication
- Employee creation
- Employee database
- Email generation (mock)
- Basic dashboard

---

## Phase 2 (Integrations)

- Google Workspace API (email creation)
- Slack API (user invite)
- GitHub API (org invite)

---

## Tech Stack

### Backend
- Node.js (NestJS recommended)

### Frontend
- Next.js (React)

### Database
- PostgreSQL

---

## Core Modules

- `auth` → authentication & roles
- `employees` → employee management
- `provisioning` → account creation
- `admin` → dashboard & controls

---

## Security Requirements

- JWT-based authentication
- Role-Based Access Control (RBAC)
- Audit logs for admin actions

---

## Future Enhancements

- Leave management system
- Asset/device tracking
- Internal ticketing system (IT requests)
- Notifications & automation workflows

---

## Key Principles

- Keep it simple (internal use only)
- Automate repetitive tasks
- Avoid unnecessary complexity (no payroll/compliance for now)
- Build modular architecture

---

## Goal

Create a centralized system to:

- Manage employees
- Automate onboarding/offboarding
- Control access to company tools
- Reduce manual operational work