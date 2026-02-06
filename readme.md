# Barite — Apartment & Society Management System

Barite is a full-stack, mobile-first apartment/society management platform.
It replaces WhatsApp chaos, Excel hell, and committee drama with a single,
auditable source of truth.

This project is built as a monorepo with:
- React Native (Expo) + TypeScript + Tailwind
- Backend API (Node.js)
- PostgreSQL (Vercel)
- Prisma ORM
- Role-based authentication
- Push notifications

This is not a toy app. Reliability > flash.

## Core Philosophy
• Boring, correct software beats clever bullshit
• Data models before UI
• Money + complaints are sacred
• Roles and permissions are enforced, not implied

## Core Modules (MVP)
Auth

- Phone-based authentication
- Role-based access control

Society Structure

- Society → Building → Flat
- Residents mapped to flats

Complaints / Issues

- Categories
- Status tracking
- Admin resolution flow

Expenses & Maintenance

- Monthly maintenance
- Expense ledger
- Payment status

Noticeboard

- Admin announcements
- Attachments

## Tech Stack
Frontend

- React Native (Expo)
- TypeScript
- Tailwind (NativeWind)

Backend

- Node.js
- NestJS (Express-compatible, opinionated, scalable)
- Prisma ORM

Database

- PostgreSQL (Vercel)

Auth & Notifications

- Firebase Auth (OTP)
- Firebase Cloud Messaging

## Status
Currently in active development.
Breaking changes expected until v1.0.
