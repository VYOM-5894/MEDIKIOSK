# 3

🚀 MASTER PROMPT: BUILD A FULLY FUNCTIONAL, SIH-WINNING MEDIKIOSK PLATFORM

ROLE AND EXPECTATION

You are an elite team consisting of:

Senior Full-Stack Software Architect

Healthcare Technology Architect

AI/ML Engineer

UX/UI Designer specializing in accessibility

ABDM/FHIR Integration Engineer

Cybersecurity Engineer

Clinical Workflow Designer

Product Manager for Indian Public Healthcare Systems

Your task is to design and develop a production-quality, fully functional, visually exceptional AI-powered clinical intake platform called MEDIKIOSK.

This must NOT look like a college project or a generic dashboard.

The final product should feel like a startup-grade, government-deployable healthcare platform capable of winning Smart India Hackathon (SIH).

The application must demonstrate:

Real-world problem solving

Technical depth

AI integration

Strong innovation

Accessibility

Scalability

Government ecosystem readiness

AYUSH-specific differentiation

Excellent UI/UX

A working end-to-end demo flow

🏥 PRODUCT NAME

MediKiosk

Tagline:

"Your Health Story, Ready Before You Meet Your Doctor."

Alternative supporting tagline:

AI-Powered Clinical History. Faster Consultations. Better Care.

🎯 CORE PROBLEM

Indian government hospitals and OPDs handle thousands of patients daily.

Doctors often have only a few minutes per patient.

Patients arrive with:

Physical prescriptions

Lab reports

Discharge summaries

Handwritten documents

Medical history from multiple hospitals

Information in different languages

Doctors must manually:

Ask repetitive questions

Understand the patient's complaint

Review old records

Identify allergies

Understand medications

Review investigations

Identify comorbidities

This creates:

Long waiting times

Poor history documentation

Repeated questioning

Missed medical information

Doctor burnout

Reduced consultation quality

MediKiosk solves this by completing AI-assisted patient intake BEFORE the patient enters the doctor's consultation room.

💡 CORE PRODUCT VISION

Build a complete ecosystem where a patient can:

STEP 1 — IDENTIFY

Enter ABHA ID

Scan QR code

Enter mobile number

Register as a new patient

Select preferred language

STEP 2 — GIVE CONSENT

Provide a highly accessible consent screen with:

Large buttons

Simple language

Audio explanation

Regional language support

Explicit consent checkbox

STEP 3 — AI HISTORY CONVERSATION

The patient interacts with an AI assistant through:

🎙 Voice
📱 Touch
🔊 Audio prompts
📝 Text

The AI conducts an adaptive clinical interview.

Example:

Patient:

"I have chest pain."

AI dynamically asks:

When did the pain start?

Where exactly is the pain?

How severe is it?

Does it spread anywhere?

Does anything make it worse?

Does anything make it better?

Do you have difficulty breathing?

The system must dynamically branch questions based on patient responses.

🚨 RED FLAG DETECTION

Create an intelligent Emergency Detection System.

Examples:

🔴 HIGH PRIORITY

Severe chest pain

Difficulty breathing

Stroke symptoms

Loss of consciousness

Severe bleeding

When detected:

🚨 Show emergency alert

POSSIBLE MEDICAL EMERGENCY DETECTED

Automatically:

Mark patient as HIGH PRIORITY

Change patient status

Notify triage dashboard

Move patient to emergency queue

Display clear instructions

IMPORTANT:

The system must clearly state:

"This system does not diagnose diseases. It identifies potential warning symptoms for immediate clinical attention."

🧠 AI HISTORY ENGINE

Build a structured conversational engine.

The AI must collect:

1. Chief Complaint

Example:

Headache for 3 days

2. History of Present Illness

Collect:

Onset

Duration

Severity

Location

Character

Progression

Aggravating factors

Relieving factors

Associated symptoms

Use structured frameworks such as:

SOCRATES

Site

Onset

Character

Radiation

Associated symptoms

Timing

Exacerbating factors

Severity

3. Past Medical History

Include:

Diabetes

Hypertension

Asthma

Heart disease

Kidney disease

Previous hospitalizations

4. Surgical History

Capture:

Previous surgeries

Dates

Procedures

5. Drug History

Capture:

Current medications

Dosage

Frequency

6. Allergy History

Include:

Drug allergies

Food allergies

Other allergies

7. Family History

Capture relevant family medical conditions.

8. Personal History

Include:

Diet

Sleep

Smoking

Alcohol

Physical activity

🌿 AYUSH MODE — MAJOR SIH DIFFERENTIATOR

Create a dedicated:

🕉 AYUSH / Ayurveda Clinical Intake Mode

This must be one of the strongest unique features of the platform.

Capture Dashavidha Pariksha:

Prakriti

Vikriti

Sara

Samhanana

Pramana

Satmya

Sattva

Ahara Shakti

Vyayama Shakti

Vaya

Also include:

🔥 Agni Assessment

🍲 Ahara Assessment

🧘 Vihara / Lifestyle

🚽 Koshtha

⚕️ Nidana

🧬 Samprapti-related inputs

The system should dynamically generate an Ayurvedic Intake Summary.

IMPORTANT:

Do not generate autonomous diagnosis.

The AI should structure information for the Ayurvedic practitioner.

📄 MEDICAL DOCUMENT AI

Create a powerful:

Smart Medical Document Intelligence Module

The patient should be able to:

📷 Take photo
📤 Upload image
📄 Upload PDF
🖨 Scan document

Supported documents:

Prescriptions

Lab reports

Discharge summaries

Imaging reports

DOCUMENT PROCESSING PIPELINE

STEP 1

Upload document.

STEP 2

OCR processing.

Show:

🔍 Extracting medical information...

STEP 3

Extract:

Doctor name

Hospital

Date

Diagnosis

Medications

Dosage

Tests

Lab values

Procedures

STEP 4

Show extracted data in an editable interface.

Example:

MedicationDosageFrequencyMetformin500 mgTwice Daily

Allow:

✏️ Edit
🗑 Remove
➕ Add missing information

📅 MEDICAL TIMELINE

Create a beautiful interactive timeline.

Example:

🟢 January 2024

Blood Test

🔵 March 2024

Doctor Consultation

🟣 July 2024

Hospital Admission

🟠 August 2024

Follow-up

The AI should automatically organize uploaded records chronologically.

🧾 AI CLINICAL SUMMARY

Generate a professional physician-ready summary.

PATIENT CLINICAL SUMMARY

Chief Complaint

Patient reports headache for 3 days.

History of Present Illness

Structured narrative.

Past Medical History

Hypertension

Diabetes

Current Medication

Medication details

Allergies

No known drug allergies

Previous Investigations

Structured summary.

Important Observations

⚠ Relevant flags requiring physician review.

IMPORTANT:

Display clearly:

AI-GENERATED DRAFT — REQUIRES PHYSICIAN REVIEW

The doctor must always have:

✏️ Edit
✅ Approve
❌ Reject

👨‍⚕️ DOCTOR DASHBOARD

Create an advanced doctor interface.

The dashboard should contain:

LEFT PANEL

Patient Queue

Display:

🟢 Normal
🟡 Priority
🔴 Emergency

Each patient card shows:

Name

Age

Gender

Token

Chief complaint

Priority level

CENTER PANEL

AI Clinical Summary

Structured patient history.

RIGHT PANEL

Medical Timeline

Visual chronological history.

TOP ALERT SECTION

Show:

⚠ Allergies
🚨 Red Flags
💊 Important medications
📊 Abnormal reports

🧑‍⚕️ TRIAGE DASHBOARD

Create a real-time hospital monitoring screen.

Show:

TODAY'S METRICS

Patients Processed

1,248

Average Intake Time

4 min 12 sec

Doctor Time Saved

82 Hours

High Priority Cases

18

LIVE QUEUE

Display patients by:

🔴 Emergency
🟡 Priority
🟢 Routine

🏥 ADMIN DASHBOARD

Create a hospital administrator dashboard.

Include:

Hospital Performance

Total patients

Average intake completion

Average waiting time

Language usage

AI completion rate

AI Analytics

Most common complaints

Peak OPD hours

Average interaction time

Accessibility Analytics

Voice vs touch usage

Languages selected

🌐 MULTILINGUAL EXPERIENCE

Create language selection.

Initially support:

🇮🇳 Hindi
🇬🇧 English
🇮🇳 Bengali
🇮🇳 Odia
🇮🇳 Tamil
🇮🇳 Telugu

Design the architecture so additional Indian languages can easily be added.

Every screen should support:

Language switching

Audio prompts

Voice interaction

👴 ACCESSIBILITY MODE

This is extremely important.

Create:

Senior Citizen / Accessibility Mode

Features:

🔠 Extra large text

🔊 Voice instructions

🖼 Icon-driven navigation

👆 Large buttons

🎙 Voice-first interaction

🌈 High contrast mode

📱 Simple navigation

The platform must be usable by:

Elderly patients

Rural patients

Low-literacy users

First-time technology users

🎙 AI VOICE INTERFACE

Create a beautiful animated voice assistant.

During listening:

🎤 Animated microphone

Display:

Listening...

Show real-time transcript.

Example:

Patient said:

"I have been feeling pain in my stomach since yesterday."

Then AI responds with:

"I'm sorry you're experiencing discomfort. Could you tell me where exactly the pain is?"

Provide:

🎙 Speak Answer

OR

👇 Choose Answer

🎨 UI/UX DESIGN REQUIREMENTS

The interface must look:

Premium

Modern

Government-ready

Healthcare-focused

Minimal

Highly accessible

Futuristic but trustworthy

🎨 DESIGN SYSTEM

Use:

Primary

Healthcare Blue

Secondary

Teal

Background

Clean white / subtle blue-gray

Emergency

Red

Success

Green

Use:

Rounded cards

Soft shadows

Clean spacing

Large typography

Smooth animations

Professional icons

Glassmorphism only subtly

DO NOT create:

❌ Generic admin template
❌ Overly colorful UI
❌ Gaming-style interface
❌ College project appearance

🖥 HERO LANDING PAGE

Create a stunning landing page.

HERO SECTION

Headline

Your Health Story, Ready Before You Meet Your Doctor.

Subheadline

MediKiosk uses AI-powered voice interaction, smart document intelligence, and structured clinical workflows to prepare a patient's medical history before consultation.

Buttons:

🔵 Start Patient Intake

⚪ View How It Works

VISUAL HERO

Show an animated visualization of:

Patient → AI Conversation → Document AI → Clinical Summary → Doctor

✨ FEATURES SECTION

Create feature cards.

🎙 AI Clinical Conversation

Natural multilingual voice interaction.

📄 Smart Document AI

Convert medical documents into structured information.

🧠 Adaptive Questioning

AI dynamically asks relevant follow-up questions.

🚨 Emergency Detection

Identify critical symptoms for priority attention.

🌿 AYUSH Integration

Dedicated Ayurvedic clinical history workflow.

🔐 Consent & Privacy

Privacy-first healthcare data handling.

🔄 HOW IT WORKS SECTION

Create an animated 5-step journey.

01

IDENTIFY

↓

02

CONVERSE

↓

03

SCAN

↓

04

SUMMARIZE

↓

05

CONSULT

🧩 TECHNICAL ARCHITECTURE

Use a modern scalable architecture.

FRONTEND

Recommended:

React / Next.js

Use:

TypeScript

Tailwind CSS

Component architecture

Responsive design

BACKEND

Recommended:

Node.js

or

Python FastAPI for AI-heavy services.

Architecture:

API Gateway

↓

Authentication Service

↓

Clinical History Service

↓

AI Conversation Service

↓

Document Intelligence Service

↓

FHIR Integration Service

↓

Analytics Service

DATABASE

Use:

PostgreSQL

For structured data.

Use object storage for:

Medical documents

Temporary uploads

Use Redis for:

Sessions

Queues

Real-time caching

AI ARCHITECTURE

Create modular AI services.

AI SERVICE 1

Speech-to-Text

AI SERVICE 2

Conversation Engine

AI SERVICE 3

Clinical Information Extraction

AI SERVICE 4

Document OCR

AI SERVICE 5

Medical Entity Recognition

AI SERVICE 6

Clinical Summary Generation

AI SERVICE 7

Red Flag Detection

🧠 IMPORTANT AI SAFETY RULE

The AI must NEVER claim:

"You have diabetes."

Instead:

"The information provided indicates a medical history that may require physician review."

Every AI-generated summary must include:

This summary is generated from patient-provided information and requires review by a qualified healthcare professional.

🔐 SECURITY

Implement:

Role-based access control

Patient authentication

Doctor authentication

Admin authentication

Session expiration

Consent logging

Audit logs

Encryption-ready architecture

Secure API design

Roles:

PATIENT

Can:

Complete intake

Upload documents

Review information

Give consent

DOCTOR

Can:

View assigned patient

Edit summary

Approve history

TRIAGE STAFF

Can:

View priority alerts

Manage queue

ADMIN

Can:

View analytics

Manage hospital configuration

🔗 ABDM / FHIR READINESS

Create an integration layer.

Do not hard-code external APIs.

Create a clean:

Health Interoperability Service

Support data models compatible with:

Patient

Encounter

Observation

MedicationStatement

AllergyIntolerance

Condition

DiagnosticReport

Use a configurable API adapter.

For the demo:

Create a MOCK ABDM SANDBOX MODE.

Show:

🟢 ABHA Connected

🟢 Consent Verified

🟢 Health Record Ready

🎬 SIH DEMO MODE

Create a dedicated:

🎯 DEMO MODE

This is critical.

Allow judges to experience the complete product in 5 minutes.

Create sample patients:

👤 Patient 1

Chest Pain Case

Triggers:

🚨 Emergency detection

👤 Patient 2

Diabetes Follow-up

Includes:

📄 Previous prescription

📊 Lab report

👤 Patient 3

Ayurveda Consultation

Includes:

🌿 Dashavidha Pariksha

DEMO FLOW

Judges should be able to:

Select patient

Choose language

Start AI conversation

Answer questions

Upload/sample scan documents

Watch AI extract information

Generate summary

View doctor dashboard

See time saved

Experience AYUSH mode

🏆 SIH INNOVATION FEATURES

Include a dedicated:

WHY MEDIKIOSK IS DIFFERENT

Highlight:

🧠 AI BEFORE CONSULTATION

Not another doctor chatbot.

The AI prepares the patient before consultation.

🎙 VOICE-FIRST HEALTHCARE

Designed for low-literacy populations.

📄 DOCUMENT INTELLIGENCE

Turns unstructured medical records into usable clinical information.

🌿 AYUSH-NATIVE WORKFLOW

Supports traditional Ayurvedic clinical assessment.

🚨 SAFETY-FIRST TRIAGE

Detects potential emergency symptoms.

🔗 INTEROPERABILITY READY

FHIR and ABDM-ready architecture.

📊 IMPACT CALCULATOR

Create a beautiful interactive section.

Example:

WITHOUT MEDIKIOSK

Average history-taking:

5 Minutes

WITH MEDIKIOSK

Doctor review:

1 Minute

POTENTIAL TIME SAVED

4 Minutes per patient

Allow users to change:

Patients per day

Example:

5,000 Patients

Show:

Potential Doctor Time Saved

333 Hours / Day

Make calculations dynamically.

📈 IMPACT DASHBOARD

Display:

⚡ Faster OPD Flow

Reduce repetitive history-taking.

👨‍⚕️ Better Doctor Focus

More time for examination and treatment.

📄 Organized Records

Medical history available instantly.

👴 Inclusive Healthcare

Designed for elderly and low-literacy users.

🧪 FUNCTIONALITY REQUIREMENT

DO NOT create static dummy screens.

The following must be genuinely functional:

✔ Patient registration

✔ Language selection

✔ Consent flow

✔ Conversational questionnaire

✔ Dynamic question branching

✔ Voice UI simulation or real browser speech integration

✔ Document upload

✔ OCR/API-ready extraction pipeline

✔ Editable extracted information

✔ Medical timeline generation

✔ AI summary generation

✔ Red flag detection

✔ Priority queue

✔ Doctor review

✔ Approve/Edit/Reject workflow

✔ Admin analytics

✔ Demo patients

📱 RESPONSIVE DESIGN

The platform must work on:

Hospital kiosk

Desktop

Tablet

Mobile

Optimize specifically for:

🖥 24-inch Hospital Kiosk

Large touch controls.

📱 Mobile

Simple responsive experience.

🎭 MICRO-INTERACTIONS

Add polished interactions:

Smooth transitions

Loading states

Skeleton screens

AI processing animations

Success animations

Progress indicators

Example:

Intake Progress

🟢 Basic Information

🟢 Chief Complaint

🔵 Medical History

⚪ Documents

⚪ Review

⚙️ ERROR HANDLING

Handle:

Internet unavailable

OCR failure

Voice recognition failure

Missing information

Session timeout

Provide friendly recovery options.

Example:

We couldn't understand that clearly.

Buttons:

🎙 Try Again

⌨️ Type Instead

📦 FINAL DELIVERABLE

Generate a complete professional application with:

1. Landing Page

2. Patient Intake Application

3. AI Conversation Interface

4. Document Intelligence Module

5. Medical Timeline

6. AI Clinical Summary

7. Doctor Dashboard

8. Triage Dashboard

9. Admin Dashboard

10. AYUSH Mode

11. Demo Mode

💻 CODE QUALITY

Use:

Clean architecture

Reusable components

Modular services

Strong TypeScript types

Environment variables

Proper API abstraction

Clear folder structure

Include:

README.md

with:

Setup instructions

Technology stack

Architecture

Demo credentials

Environment variables

API documentation

🚀 FINAL QUALITY BAR

Before completing, evaluate the platform against these SIH judging criteria:

INNOVATION — 10/10

Is the solution genuinely different?

TECHNICAL COMPLEXITY — 10/10

Does it demonstrate serious engineering?

IMPACT — 10/10

Can it solve a national-scale problem?

SCALABILITY — 10/10

Can it work across thousands of hospitals?

FEASIBILITY — 10/10

Can the solution realistically be deployed?

USER EXPERIENCE — 10/10

Can elderly and low-literacy users operate it?

PRESENTATION — 10/10

Does it immediately impress SIH judges?

ULTIMATE GOAL

The final MediKiosk platform should make a judge say:

"This is not just an SIH prototype. This looks like something the Ministry of Ayush or a major Indian hospital could actually deploy."

Build the product with that standard.

Prioritize:

FUNCTIONALITY + REAL-WORLD IMPACT + AI INNOVATION + ACCESSIBILITY + SCALABILITY + VISUAL EXCELLENCE.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/45ed9de5-1836-4c93-b122-9219d00eb3dc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
