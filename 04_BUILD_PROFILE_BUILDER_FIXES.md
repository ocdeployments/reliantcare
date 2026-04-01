# 04_BUILD_PROFILE_BUILDER_FIXES.md
# Fix the profile builder navigation and rebuild all steps.
# ReliantCareNetwork — Profile Builder

---

## Pre-flight

Read before writing any code:
- 00_AGENT_INSTRUCTIONS.md
- 01_PROJECT_CONTEXT.md
- 02_DESIGN_SYSTEM.md

Schema v2 must be applied before starting (03_BUILD_SCHEMA_V2.md).

One file only:
```
app/(caregiver)/profile/build/page.js
```

---

## Known Bugs to Fix First

### B03 — Step index offset
Clicking Background opens References.
Clicking References opens Review.
Cause: STEP_ORDER array uses 4.5 as a value — floating point
comparison is unreliable.
Fix: Replace value-based navigation with index-based.

### B04 — Review shown as sidebar step
Review should never appear as a step in the sidebar.
Replace with a "Submit profile →" gold button.
Only activates when all required steps are complete.

### B05 — Sidebar steps not clickable
Completed steps must be clickable to jump back.
Current step: highlighted, not clickable.
Future steps: greyed, not clickable.

---

## Step Navigation Fix

Replace existing step system with this exactly:

```javascript
const STEPS = [
  { index: 0, id: 'identity',       label: 'Identity basics',    desc: 'Name, photo, bio' },
  { index: 1, id: 'services',       label: 'Services',           desc: 'What you offer' },
  { index: 2, id: 'availability',   label: 'Availability',       desc: 'When and where' },
  { index: 3, id: 'certifications', label: 'Certifications',     desc: 'Your credentials' },
  { index: 4, id: 'background',     label: 'Background check',   desc: 'Security clearance' },
  { index: 5, id: 'references',     label: 'References',         desc: 'Who vouches for you' },
];

const [currentStep, setCurrentStep] = useState(0);

const goNext = () => {
  if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1);
};

const goBack = () => {
  if (currentStep > 0) setCurrentStep(s => s - 1);
};

const goToStep = (index) => {
  if (index < currentStep) setCurrentStep(index);
};

const renderStep = () => {
  switch(currentStep) {
    case 0: return <Step1Identity />;
    case 1: return <Step2Services />;
    case 2: return <Step3Availability />;
    case 3: return <Step4Certifications />;
    case 4: return <Step4BBackground />;
    case 5: return <Step5References />;
    default: return <Step1Identity />;
  }
};
```

---

## Step 2 — Services, Specialties, Credentials

Three sections. All structured — no free text except
optional "other" fields with 300 char limit.

### Section A — Services (11 collapsible categories)
Personal Care · Mobility · Nutrition · Medication ·
Household · Companionship · Dementia · Complex Care ·
Safety · Transportation · Technology

Each category expands to show checkboxes.
Show count of selected items on collapsed category header.
Gold accent on selected items.

### Section B — Clinical Specialties (chips)
Dementia/Alzheimer's · Parkinson's · Memory care ·
Palliative · Post-hospital · Stroke · Mobility/transfers ·
Medication management · Complex personal care ·
Behavioural support · Diabetes · Mental health ·
Paediatric · Acquired brain injury · Bariatric ·
Hospice · Wound care awareness

Royal blue accent on selected specialties.

### Section C — Professional Credentials (checkboxes)
PSW · RN · LPN/LVN · CNA · HHA ·
Nursing student · OT Assistant · PT Assistant ·
Social Worker · Hospital Support ·
No formal credential · Other

Gold accent on selected credentials.

Honesty note at bottom — gold warning box:
"Be honest about your specialties. Agencies score whether
your skills matched your profile claims.
Overstating will reduce your trust score."

---

## Step 3 — Availability

### Status selector (radio, required)
- Available now (can start within 2 weeks) — green dot
- Open to opportunities (currently employed) — amber dot
- Available from [date] — blue dot
- Not currently available — grey dot

If "Open to opportunities" selected — show notice period dropdown:
Immediately · 1 week · 2 weeks · 1 month · Flexible

If "Available from" selected — show date picker.

### Placement types (checkboxes)
Permanent · Regular part-time · Casual/relief shifts ·
Live-in care · Overnight care · Respite care ·
Block booking · Weekend specialist

### Days and hours
Day toggles: Mon Tue Wed Thu Fri Sat Sun
Each selected day shows: From [time] To [time] + Flexible checkbox
Times: 30-minute increments, 05:00–23:30

### Preferences (toggles)
- Open to urgent placements
- Available for live-in
- Have own vehicle

### Client preference (dropdown)
No preference · Elderly 65+ · Younger adults ·
Paediatric · End-of-life · Single client · Multiple clients

### Location
City input + postal code input + radius slider (5–50 miles)

### Languages (chips)
English · Spanish · French · Tagalog · Mandarin ·
Hindi · Arabic · Portuguese · Other

---

## Step 4 — Certifications

Repeatable entries. Add/remove buttons.
Each entry:

1. Type (dropdown — 15 options):
   CPR & First Aid · PSW Certificate · CNA · HHA ·
   RN Licence · LPN/LVN · Dementia Care Training ·
   Palliative Care · Mental Health First Aid · Food Safe ·
   Medication Administration · Infection Control ·
   WHMIS · Occupational First Aid · Other

2. Issuing body (dropdown — changes based on type selected)

3. Certificate number (text input, optional)

4. Issue date (month/year picker)

5. Expiry date (month/year picker) OR "No expiry" checkbox

6. Upload proof (drag/drop area — PDF, JPG, PNG, max 10MB)
   Show: "Documents encrypted and stored privately.
   Agencies see verification status only."

---

## Step 5 — References

Repeatable entries. Max 5 references. Min 1 required.
Each entry:

1. Full name (text, max 60 chars)

2. Relationship (dropdown — 12 types):
   Former employer — agency ·
   Former employer — private family ·
   Current employer — agency ·
   Current employer — private family ·
   Direct supervisor ·
   Training supervisor/instructor ·
   Professional colleague ·
   Former client (self) ·
   Former client — family member ·
   Former client — legal guardian/POA ·
   Character reference — professional ·
   Character reference — community

   If client relationship selected — show info box:
   "Client references displayed as first name + last initial only.
   Admin reviews before publishing."

3. Organisation name (text, max 100 chars)

4. Duration known (dropdown):
   Less than 1 year · 1–2 years · 2–5 years · 5+ years

5. Preferred contact (dropdown):
   Email only · Phone only · Email or phone

6. Email (if email selected — validated)

7. Phone (if phone selected — (XXX) XXX-XXXX enforced)

8. Three consent checkboxes (all required before submitting):
   - "[Name] knows I am listing them as a reference"
   - "They agreed to be contacted by our platform"
   - "I understand false consent may result in suspension"

---

## Sidebar Rendering

```jsx
{STEPS.map((step) => (
  <div
    key={step.id}
    onClick={() => goToStep(step.index)}
    className={`flex items-center gap-3 p-3 rounded-xl transition-all
      ${currentStep === step.index
        ? 'bg-[#FDF6EC] border border-[#C9973A]/30 cursor-default'
        : step.index < currentStep
        ? 'hover:bg-white cursor-pointer'
        : 'cursor-not-allowed opacity-50'
      }`}>
    {step.index < currentStep
      ? <CheckCircle className="w-5 h-5 text-[#C9973A]" />
      : currentStep === step.index
      ? <div className="w-5 h-5 rounded-full flex items-center justify-center
          text-[10px] font-black text-white"
          style={{ background: 'linear-gradient(135deg, #C9973A, #E8B86D)' }}>
          {step.index + 1}
        </div>
      : <Circle className="w-5 h-5 text-[#CBD5E1]" />
    }
    <div>
      <div className={`text-[12px] font-bold
        ${currentStep === step.index ? 'text-[#92400E]'
          : step.index < currentStep ? 'text-[#0D1B3E]'
          : 'text-[#94A3B8]'}`}>
        {step.label}
      </div>
      <div className="text-[10px] text-[#94A3B8]">{step.desc}</div>
    </div>
  </div>
))}

{/* Submit button — not a step */}
<button
  onClick={handleSubmit}
  disabled={currentStep < STEPS.length - 1}
  className={`mt-2 w-full py-3 rounded-xl text-[12px] font-bold
    ${currentStep === STEPS.length - 1
      ? 'text-[#0D1B3E] hover:opacity-90 cursor-pointer'
      : 'opacity-30 cursor-not-allowed bg-[#F1F5F9] text-[#94A3B8]'
    }`}
  style={currentStep === STEPS.length - 1 ? {
    background: 'linear-gradient(135deg, #C9973A, #E8B86D)'
  } : {}}>
  Submit profile →
</button>
```

---

## Commit Sequence

One commit per fix. Never bundle.

```
fix: profile builder — index-based navigation, clickable sidebar
feat: profile builder step 2 — services, specialties, credentials
feat: profile builder step 3 — availability redesign
feat: profile builder step 4 — structured certifications
feat: profile builder step 5 — references with consent
```

---

*Last updated: March 2026 — ReliantCareNetwork*
