// Questions derived from prince2-index.md.
// The emphasis is on knowing the manual's map: chapter order, recurring
// structures, where definitions live, and what each chapter contains.
const QUESTIONS = [
    {
        topic: "Manual map",
        question: "What are the three main blocks of chapters in the manual, and which chapter numbers do they occupy?",
        hint: "People → Practices → Processes",
        answer: "People: chapter 1\nPractices: chapters 2–9 (introduction plus seven practices)\nProcesses: chapters 10–17 (introduction plus seven processes)"
    },
    {
        topic: "Manual map",
        question: "Name chapters 1–9 in order.",
        hint: "P, PI, B, O, P, Q, R, I, P",
        answer: "1. People\n2. Practices Introduction\n3. Business Case\n4. Organisation\n5. Plans\n6. Quality\n7. Risk\n8. Issues\n9. Progress"
    },
    {
        topic: "Manual map",
        question: "Name chapters 10–17 in order.",
        hint: "PI, S, D, I, C, M, M, C",
        answer: "10. Processes Introduction\n11. Starting\n12. Directing\n13. Initiating\n14. Controlling a Stage\n15. Managing Product Delivery\n16. Managing a Stage Boundary\n17. Closing a Project"
    },
    {
        topic: "Practice chapters",
        question: "What seven-section structure is repeated in each practice chapter (chapters 3–9)?",
        hint: "P-G-T-A-M-K-P",
        answer: "1. Purpose\n2. Guidance\n3. Techniques\n4. Applying the practice\n5. Management products\n6. Key roles\n7. Principles"
    },
    {
        topic: "Process chapters",
        question: "What six-section structure is repeated in each process chapter (chapters 11–17)?",
        hint: "O-C-A-A-R-P",
        answer: "1. Objectives\n2. Context\n3. Activities\n4. Applying\n5. Responsibilities\n6. Practices"
    },

    // Chapter 1 — People
    {
        topic: "Ch 1 · People",
        question: "What are the five main sections of the People chapter?",
        hint: "C, LSC, LST, C, People +",
        answer: "1. Context\n2. Leading successful change\n3. Leading successful teams\n4. Communication\n5. People + (connections to principles, practices, and processes)"
    },
    {
        topic: "Ch 1 · People",
        question: "Where in the manual are the organisational ecosystem and project ecosystem discussed?",
        hint: "Chapter and section",
        answer: "Chapter 1, People — section 1, Context."
    },
    {
        topic: "Ch 1 · People",
        question: "Which three subjects sit under ‘Leading successful change’ in the People chapter?",
        hint: "C-S-C",
        answer: "Change Management Approach\nStakeholders\nCulture"
    },
    {
        topic: "Ch 1 · People",
        question: "Which concepts and subsections help you navigate ‘Leading successful teams’?",
        hint: "Four concepts; three subsections",
        answer: "Concepts: collaboration, co-creation, leadership, and management.\nSubsections: leading across organisational boundaries; building effective teams; bringing the team together."
    },
    {
        topic: "Ch 1 · People",
        question: "Where are remote, co-located, and hybrid teams covered, and which management approach appears there?",
        hint: "People → ...",
        answer: "Chapter 1, People — section 4, Communication. It contains the Communication Management Approach."
    },
    {
        topic: "Ch 1 · People",
        question: "What does the final ‘People +’ section connect people to?",
        hint: "Three elements",
        answer: "Principles, practices, and processes."
    },

    // Chapter 2 — Practices Introduction
    {
        topic: "Ch 2 · Practices intro",
        question: "What are the three main sections of the Practices Introduction?",
        hint: "P-A-M",
        answer: "Practices\nApplying practices\nManagement products"
    },
    {
        topic: "Ch 2 · Practices intro",
        question: "Where should you look for the overview of the Project Initiation Document and project logs?",
        hint: "Before the individual practice chapters",
        answer: "Chapter 2, Practices Introduction — section 3, Management products."
    },

    // Chapter 3 — Business Case
    {
        topic: "Ch 3 · Business Case",
        question: "Which chapter contains the definitions of output, capability, outcome, benefit, dis-benefit, and business objective?",
        hint: "First practice chapter",
        answer: "Chapter 3, Business Case."
    },
    {
        topic: "Ch 3 · Business Case",
        question: "What does the Business Case chapter's Purpose section focus on?",
        hint: "D-V-A",
        answer: "Desirability, viability, and achievability (D-V-A)."
    },
    {
        topic: "Ch 3 · Business Case",
        question: "What are the three subsections of Business Case guidance, and what navigation cues sit beneath them?",
        hint: "Lifecycle, products, justification",
        answer: "Business case lifecycle — Mandate → Project Brief → Business Case\nAligning products — business objectives and tolerances\nEstablishing business justification — the seven performance targets"
    },
    {
        topic: "Ch 3 · Business Case",
        question: "What four techniques are listed in the Business Case chapter?",
        hint: "D-C-M-C",
        answer: "Develop\nCheck\nMaintain\nConfirm"
    },
    {
        topic: "Ch 3 · Business Case",
        question: "Which four management products are grouped under the Business Case practice?",
        hint: "PB, BC, BMA, SMA",
        answer: "Project Brief\nBusiness Case\nBenefits Management Approach\nSustainability Management Approach"
    },

    // Chapter 4 — Organisation
    {
        topic: "Ch 4 · Organisation",
        question: "Where should you look for the three project interests, organisational levels, team structure, and project roles?",
        hint: "Practice and section",
        answer: "Chapter 4, Organisation — section 2, Guidance."
    },
    {
        topic: "Ch 4 · Organisation",
        question: "What two mnemonic sequences identify the three project interests and four organisational levels in Organisation guidance?",
        hint: "B-U-S and C-D-M-D",
        answer: "Project interests: B-U-S (business, user, supplier).\nOrganisational levels: C-D-M-D."
    },
    {
        topic: "Ch 4 · Organisation",
        question: "What chain links the product view to assigned work in the Organisation chapter?",
        hint: "PBS → WBS → ...",
        answer: "Product breakdown structure → work breakdown structure → work packages."
    },
    {
        topic: "Ch 4 · Organisation",
        question: "Where is the project board's ability to establish a Change Authority noted?",
        hint: "Organisation → Applying",
        answer: "Chapter 4, Organisation — section 4, Applying the practice."
    },
    {
        topic: "Ch 4 · Organisation",
        question: "Which management products are listed for the Organisation practice?",
        hint: "One approach and two parts of the PID",
        answer: "Commercial Management Approach\nPID: Project Management Team Structure\nPID: Role Descriptions"
    },

    // Chapter 5 — Plans
    {
        topic: "Ch 5 · Plans",
        question: "What questions about products does the Purpose section of Plans answer, and what two benefits of planning does it identify?",
        hint: "What, who, how...",
        answer: "It defines what, who, how, when, and how much, as well as scope. Its two stated benefits are understanding and communication, and control."
    },
    {
        topic: "Ch 5 · Plans",
        question: "What are the five main topics under Plans guidance?",
        hint: "H-L-S-T-P",
        answer: "Planning horizon\nLevels of plans\nStages\nPlanning tolerances\nProduct-based planning"
    },
    {
        topic: "Ch 5 · Plans",
        question: "Which four levels/types of plan are indexed in the Plans chapter?",
        hint: "S-T-E-P",
        answer: "Stage, Team, Exception, and Project plans."
    },
    {
        topic: "Ch 5 · Plans",
        question: "Where are the number and length of stages and the handling of work packages discussed?",
        hint: "Plans → Guidance → ...",
        answer: "Chapter 5, Plans — Guidance → Stages."
    },
    {
        topic: "Ch 5 · Plans",
        question: "What four steps make up ‘Defining and analysing products’ within the Plans techniques?",
        hint: "PPD, PBS, PDs, PFD",
        answer: "Write a Project Product Description\nCreate a Product Breakdown Structure\nWrite Product Descriptions\nCreate a Product Flow Diagram"
    },
    {
        topic: "Ch 5 · Plans",
        question: "After defining products, what six further technique areas complete the Plans chapter's technique sequence?",
        hint: "Work, estimates, schedule, budget, risks, document",
        answer: "Organising work packages\nPreparing estimates\nPreparing a schedule\nPreparing the budget\nAnalysing risks\nDocumenting the plan"
    },
    {
        topic: "Ch 5 · Plans",
        question: "Which two management products are listed for the Plans practice?",
        hint: "Two descriptions",
        answer: "Project Product Description and Work Package Description."
    },

    // Chapter 6 — Quality
    {
        topic: "Ch 6 · Quality",
        question: "Which chapter contains user quality expectations, requirements, acceptance criteria, and quality specifications?",
        hint: "Practice chapter",
        answer: "Chapter 6, Quality — especially the Purpose and Guidance sections."
    },
    {
        topic: "Ch 6 · Quality",
        question: "What are the three top-level subjects under Quality guidance?",
        hint: "Plan, control, assure",
        answer: "Quality planning\nQuality control — the procedures\nQuality assurance — validation that the quality-control procedures worked"
    },
    {
        topic: "Ch 6 · Quality",
        question: "What six items are indexed beneath Quality planning?",
        hint: "Expectations, tolerances, products, sustainability, responsibilities, subordinate plans",
        answer: "User's quality expectations\nQuality tolerances\nDescribing products\nProduct sustainability requirements\nQuality responsibilities\nSubordinate plans (for example, testing)"
    },
    {
        topic: "Ch 6 · Quality",
        question: "Where are producer, reviewer, and acceptance authority discussed?",
        hint: "Quality → Guidance → ...",
        answer: "Chapter 6, Quality — Guidance → Quality planning → Quality responsibilities."
    },
    {
        topic: "Ch 6 · Quality",
        question: "What four technique areas are in the Quality practice?",
        hint: "P-C-A-S",
        answer: "Planning\nControlling quality\nAccepting products\nSupporting techniques, such as testing and prototyping"
    },
    {
        topic: "Ch 6 · Quality",
        question: "Which four management products are grouped under Quality?",
        hint: "PD, QMA, QR, PR",
        answer: "Product Description\nQuality Management Approach\nQuality Register\nProduct Register"
    },

    // Chapter 7 — Risk
    {
        topic: "Ch 7 · Risk",
        question: "Which chapter is the home for owner, action owner, probability, impact, proximity, velocity, exposure, appetite, budget, and tolerance?",
        hint: "Practice chapter",
        answer: "Chapter 7, Risk — section 2, Guidance."
    },
    {
        topic: "Ch 7 · Risk",
        question: "What are the four main topics under Risk guidance?",
        hint: "P-A-C-C",
        answer: "Planning\nAnalysis\nControl\nCulture"
    },
    {
        topic: "Ch 7 · Risk",
        question: "Where do cause, event, effect, threat, and opportunity appear in the manual?",
        hint: "Risk → Guidance → ...",
        answer: "Chapter 7, Risk — Guidance → Planning."
    },
    {
        topic: "Ch 7 · Risk",
        question: "Where are the S-P-A-R-T-A responses, risk owners/action owners, and risk budget grouped?",
        hint: "Risk guidance subsection",
        answer: "Chapter 7, Risk — Guidance → Control."
    },
    {
        topic: "Ch 7 · Risk",
        question: "Which four biases are listed under Risk culture?",
        hint: "O-L-G-P",
        answer: "Optimism\nLoss aversion\nGroupthink\nProximity"
    },
    {
        topic: "Ch 7 · Risk",
        question: "What five techniques make up the Risk practice sequence?",
        hint: "I-A-P-I-C",
        answer: "Identify\nAssess\nPlan\nImplement\nCommunicate"
    },
    {
        topic: "Ch 7 · Risk",
        question: "Which management products belong to the Risk practice?",
        hint: "Approach and register",
        answer: "Risk Management Approach and Risk Register."
    },

    // Chapter 8 — Issues
    {
        topic: "Ch 8 · Issues",
        question: "Which chapter contains the definitions of issue, change, and project baseline, and what is its stated purpose?",
        hint: "Practice chapter",
        answer: "Chapter 8, Issues. Its purpose is to control change."
    },
    {
        topic: "Ch 8 · Issues",
        question: "What are the five main topics under Issues guidance?",
        hint: "B-I-C-D-C",
        answer: "Baselines\nIssue resolution\nChange control\nDelegating authority for changes\nChange budget"
    },
    {
        topic: "Ch 8 · Issues",
        question: "Where are problem, concern, and business opportunity indexed?",
        hint: "Issues → Guidance → ...",
        answer: "Chapter 8, Issues — Guidance → Issue resolution."
    },
    {
        topic: "Ch 8 · Issues",
        question: "Where are request for change, off-specification, and concession indexed?",
        hint: "Issues → Guidance → ...",
        answer: "Chapter 8, Issues — Guidance → Change control."
    },
    {
        topic: "Ch 8 · Issues",
        question: "What five techniques make up the Issues practice sequence?",
        hint: "C-A-R-D-I",
        answer: "Capturing\nAssessing\nRecommending\nDeciding\nImplementing"
    },
    {
        topic: "Ch 8 · Issues",
        question: "What four decisions are indexed beneath the ‘Deciding’ issue technique?",
        hint: "A-R-E-M",
        answer: "Accept\nReject\nRequest an exception plan\nRequest more information"
    },
    {
        topic: "Ch 8 · Issues",
        question: "Which management products belong to the Issues practice?",
        hint: "Approach, register, report",
        answer: "Issue Management Approach\nIssue Register\nIssue Report"
    },

    // Chapter 9 — Progress
    {
        topic: "Ch 9 · Progress",
        question: "Which three terms anchor the Purpose section of the Progress chapter?",
        hint: "P-F-E",
        answer: "Progress, forecast, and exception."
    },
    {
        topic: "Ch 9 · Progress",
        question: "What are the seven topics under Progress guidance?",
        hint: "T-C-R-R-F-E-D",
        answer: "Tolerances and performance targets\nTypes of control\nReviewing progress and lessons\nReporting progress and lessons\nForecasting\nEscalating\nData and systems"
    },
    {
        topic: "Ch 9 · Progress",
        question: "Where are event-driven and time-driven controls explained?",
        hint: "Progress → Guidance → ...",
        answer: "Chapter 9, Progress — Guidance → Types of control."
    },
    {
        topic: "Ch 9 · Progress",
        question: "Where are project-, stage-, and work-package-level exceptions discussed?",
        hint: "Progress → Guidance → ...",
        answer: "Chapter 9, Progress — Guidance → Escalating."
    },
    {
        topic: "Ch 9 · Progress",
        question: "What is the seven-step technique sequence in the Progress chapter?",
        hint: "Issue → exception → decisions → plan → decision → implement → support",
        answer: "Raising an issue\nEscalating an exception\nDeciding on an exception report\nCreating an exception plan\nDeciding on an exception plan\nImplementing an exception plan\nSupporting techniques"
    },
    {
        topic: "Ch 9 · Progress",
        question: "Which supporting techniques are named in the Progress chapter?",
        hint: "Three visual/cadence tools",
        answer: "Dashboards, daily stand-ups, and burn charts."
    },
    {
        topic: "Ch 9 · Progress",
        question: "Which nine management products are collected under the Progress practice?",
        hint: "One approach, two logs, six reports",
        answer: "Digital and Data Management Approach\nDaily Log\nLessons Log\nCheckpoint Report\nHighlight Report\nLessons Report\nException Report\nEnd-of-Stage Report\nEnd-of-Project Report"
    },

    // Chapter 10 — Processes Introduction
    {
        topic: "Ch 10 · Processes intro",
        question: "Which three terms are introduced in the Processes Introduction?",
        hint: "P-T-PD",
        answer: "Process, trigger, and project definition."
    },

    // Chapter 11 — Starting
    {
        topic: "Ch 11 · Starting",
        question: "What is distinctive about the opening structure of the Starting process chapter?",
        hint: "Before Objectives",
        answer: "It begins with prerequisites, before the usual process sections of Objectives, Context, Activities, Applying, Responsibilities, and Practices."
    },
    {
        topic: "Ch 11 · Starting",
        question: "What are the six activities in the Starting process, in order?",
        hint: "Appoint, assess, prepare, appoint, plan, request",
        answer: "Appoint the Project Executive and Project Manager\nAssess previous lessons\nPrepare the Outline Business Case\nAppoint the project team\nPlan the initiation stage\nRequest project initiation"
    },
    {
        topic: "Ch 11 · Starting",
        question: "Which products are created while appointing the Project Executive/Manager, assessing lessons, and preparing the Outline Business Case?",
        hint: "One per activity",
        answer: "Daily Log\nLessons Log\nProject Product Description"
    },
    {
        topic: "Ch 11 · Starting",
        question: "During which Starting activity are the project approach selected and Project Brief assembled?",
        hint: "Activity 4",
        answer: "Appoint the project team. This activity creates the Project Brief."
    },
    {
        topic: "Ch 11 · Starting",
        question: "Which Starting activity creates the Initiation Stage Plan?",
        hint: "Activity 5",
        answer: "Plan the initiation stage."
    },

    // Chapter 12 — Directing
    {
        topic: "Ch 12 · Directing",
        question: "What is the key objective cue for the Directing process?",
        hint: "Authority",
        answer: "Authority to execute."
    },
    {
        topic: "Ch 12 · Directing",
        question: "What are the five activities in the Directing process?",
        hint: "Five authorise/direct decisions",
        answer: "Authorise initiation\nAuthorise the project\nAuthorise a stage or exception plan\nGive ongoing direction\nAuthorise project closure"
    },
    {
        topic: "Ch 12 · Directing",
        question: "In which Directing activity is the Project Initiation Document reviewed?",
        hint: "Activity 2",
        answer: "Authorise the project."
    },
    {
        topic: "Ch 12 · Directing",
        question: "What two role notes appear in the Applying section of Directing?",
        hint: "PE responsibility; PE/PM separation",
        answer: "The Project Executive is responsible for all Directing activities but may delegate their execution. The Project Executive and Project Manager roles must remain separate."
    },

    // Chapter 13 — Initiating
    {
        topic: "Ch 13 · Initiating",
        question: "Which registers/budgets and quality items are flagged at the start of Initiating activities?",
        hint: "Quality, risk, issue/change",
        answer: "Product Register, Product Descriptions, and quality specifications\nRisk Register and risk budget\nIssue Register and change budget"
    },
    {
        topic: "Ch 13 · Initiating",
        question: "What are the seven activities in the Initiating process?",
        hint: "Tailor, approaches, controls, plan, case, PID, authorise",
        answer: "Agree tailoring requirements\nAgree management approaches\nEstablish project controls\nPrepare the Project Plan\nPrepare the Full Business Case\nAssemble the Project Initiation Document\nRequest project authorisation"
    },
    {
        topic: "Ch 13 · Initiating",
        question: "In which process are the Full Business Case and assembled Project Initiation Document prepared?",
        hint: "Chapter 13",
        answer: "Initiating a Project — activities 5 and 6 respectively."
    },

    // Chapter 14 — Controlling a Stage
    {
        topic: "Ch 14 · Controlling a Stage",
        question: "What are the eight activities in Controlling a Stage?",
        hint: "Authorise, evaluate WP, capture, correct, receive, evaluate stage, report, escalate",
        answer: "Authorise a work package\nEvaluate work package status\nCapture issues and risks\nTake corrective action\nReceive completed work package\nEvaluate stage status\nReport highlights\nEscalate issues and risks"
    },
    {
        topic: "Ch 14 · Controlling a Stage",
        question: "Which process and activity create the Work Package Description?",
        hint: "Chapter 14, activity 1",
        answer: "Controlling a Stage — Authorise a work package."
    },
    {
        topic: "Ch 14 · Controlling a Stage",
        question: "Where should you look for evaluating both work-package status and overall stage status?",
        hint: "Same process, activities 2 and 6",
        answer: "Chapter 14, Controlling a Stage — activities 2 and 6."
    },

    // Chapter 15 — Managing Product Delivery
    {
        topic: "Ch 15 · Managing Product Delivery",
        question: "Which process focuses on the Team Plan, specialist products, and execution of work packages?",
        hint: "Chapter 15",
        answer: "Managing Product Delivery."
    },
    {
        topic: "Ch 15 · Managing Product Delivery",
        question: "What are the four activities in Managing Product Delivery?",
        hint: "A-E-E-N",
        answer: "Accept a work package\nExecute a work package\nEvaluate a work package\nNotify work package completion"
    },

    // Chapter 16 — Managing a Stage Boundary
    {
        topic: "Ch 16 · Managing a Stage Boundary",
        question: "What are the six activities in Managing a Stage Boundary?",
        hint: "Prepare two plans; update plan/case; evaluate; request",
        answer: "Prepare the next Stage Plan\nPrepare the Exception Plan\nUpdate the Project Plan\nUpdate the Business Case\nEvaluate the stage\nRequest the next stage"
    },
    {
        topic: "Ch 16 · Managing a Stage Boundary",
        question: "Which process brings together preparation of the next Stage Plan, updating the Project Plan and Business Case, and evaluating the stage?",
        hint: "Chapter 16",
        answer: "Managing a Stage Boundary."
    },

    // Chapter 17 — Closing a Project
    {
        topic: "Ch 17 · Closing a Project",
        question: "What are the four activities in Closing a Project?",
        hint: "Prepare, confirm, evaluate, request",
        answer: "Prepare planned or premature closure\nConfirm project acceptance\nEvaluate the project\nRequest project closure"
    },
    {
        topic: "Ch 17 · Closing a Project",
        question: "Where should you look for both planned and premature closure?",
        hint: "Final chapter, first activity",
        answer: "Chapter 17, Closing a Project — activity 1, Prepare planned/premature closure."
    },

    // Appendices
    {
        topic: "Appendices",
        question: "Where are management products listed alphabetically?",
        hint: "Appendix",
        answer: "Appendix A."
    }
];
