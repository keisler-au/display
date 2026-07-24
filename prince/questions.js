const QUESTIONS = [
    {
        question: "What is a purpose of a project (principle orientated)?",
        hint: "DP-BC",
        answer: "Deliver products that align with business case"
    },
    {
        question: "What are the characteristics of a project?",
        hint: "C-C-U-U-T",
        answer: "Change related\nCross-Functional\nUnique\nUncertain\nTemporary"
    },
    {
        question: "What does PM improve (reduce)?",
        hint: "5",
        answer: "Uncertainty - roles, approach \nEfficiency - inputs, outputs, product delivery\nQuality - products, benefits\nScope creep\nRisk management - project success"
    },
    {
        question: "What are the elements?",
        hint: "5P",
        answer: "People (center)\nProcesses (left)\nPractices (right)\nProject context\nPrinciples"
    },
    {
        question: "What is the purpose of the principles?",
        hint: "",
        answer: "Flexibility and Guidance - allow for tailoring as well as continuity"
    },
    {
        question: "What must role assignment be?",
        hint: "C-U-A",
        answer: "Clear, Understood, Accepted, (also, documented, within confines of PM framework)"
    },
    {
        question: "What are the primary stakeholder types? and how do they relate to the project management team?",
        hint: "PB=B-U-S",
        answer: "business, user, supplier - they form the project board"
    },
    {
        question: "What is the minimum number of stages a project should have and what are they?",
        hint: "",
        answer: "two - intial and then one futher stage"
    },
    {
        question: "What are the characteristics of a product?",
        hint: "IO-TI-D-C-T",
        answer: "Input or Output\nTangible or Intangible\nDescribable in advance\nCreateable\nTestable"
    },
    {
        question: "What are the types of products? Describe each briefly:",
        hint: "S-P-E-M",
        answer: "Specialised - Main deliverables that achieve benefit/business purpose\nProject - Total output of the project\nExternal - Project is dependent on but is outside it's control\nManagerial - for managing the project e.g., reports, approaches"
    },
    {
        question: "What does focusing on products improve (reduces)?",
        hint: "S-C-E-Q",
        answer: "Scope creep\nClosing a project\nEfficiency\nQuality - user satisfaction\n"
    },
    {
        question: "What is the difference between the Practices and the Processes definitions?",
        answer: "Practice - the way of doing things\nProcess - the things needing to be done"
    },
    {
        question: "What are the project contexts?",
        hint: "",
        answer: "Delivery method\nOrganisation\nCommercial\nScale\nSustainability requirements"
    },
    {
        question: "What are the management levels?",
        hint: "",
        answer: "Directing\nManaging\nDelivering"
    },
    {
        question: "What are the performance targets?",
        answer: "Scope\nTime\nCost\nBenefits\nQuality\nRisks\nSustainability\n"
    },
    {
        question: "What are the three core questions of the Change Management Approach?",
        hint: "",
        answer: "1. Where are we?\n2. Where are we going (what is the target)?\n3. How do we get there?"
    },
    {
        question: "What are the focus points for co-located teams’ communication?",
        hint: "M-R-IF",
        answer: "Multiple channels, formats\nReconnecting - team members who are disconnected from the project\nInformation Flow - monitoring it"
    },
    {
        question: "What are the focus points for remote teams’ communication?",
        hint: "E-UT-R",
        answer: "Explicit - clarity\nUnstructured time - no agenda, just share information\nRelationships - developing these"
    },
    {
        question: "What is the main focus for hybrid teams’ communication?",
        answer: "Ensure that the team does not develop separate groups (local and remote)"
    },
    {
        question: "What is a quiet phase?",
        answer: "Starting the project with a small team of key stakeholders before opening it up"
    },
    {
        question: "What is a risk of periodic feedback and what are mitigations for this risk?",
        answer: "Bias\n1. Develop key relationships\n2. Have an open communication environment"
    },
    {
        question: "What are the important considerations for effective teams? What is the consequence of these considerations?’",
        hint: "P-H-R-A-I-M-D",
        answer: "Power struggles - assigned authority may not reflect actual authority\nHierarchical tension - young project managers leading more senior staff\nRoles - project roles may differ from organisational roles\nAttention - competing attentions\nInfluence - required from the project manager\nMotivation - project manager may not have all the tools available (raising pay)\nDependencies - defining these and who is responsible for them"
    },
    {
        question: "What are the distinguishing characteristics of management and of leadership?",
        hint: "",
        answer: "Management - Directing, controlling, common goals\nLeadership - Motivation, persuasion, processes"
    },
    {
        question: "What are the main targets for the business case practice?",
        hint: "D-V-A",
        answer: "Desirable\nViable\nAchievable\n"
    },
    {
        question: "What is the best way to evaluate the business justification?",
        hint: "",
        answer: "Using the 7 performance targets"
    },
    {
        question: "What are the techniques for the business case practice?",
        hint: "O-A-MC",
        answer: "Options - gather information, create and explore options\nAssess\nMaintain and Confirm - alignment throughout project"
    },
    {
        question: "Who has the authority to direct the project?",
        hint: "",
        answer: "Project Board"
    },
    {
        question: "Who is accountable for the success of the project? Name three responsibilities:",
        hint: "",
        answer: "Project Board\n1. Ensure the project has the resources to succeed\n2. Set tolerances\n3. Ensure business strategy is reflected in business case"
    },
    {
        question: "What are the members needed to form a project board? What is the exception for smaller projects? Why is the exception recommended that way?’",
        hint: "",
        answer: "Project Executive\nSenior user\nSenior supplier\nProject Executive may also be user or supplier, but user cannot also be supplier, as that could be a conflict of interest"
    },
    {
        question: "Which management document needs to include sufficient information to enable the project board to confirm the business justification and authorize the project manager to initiate the project?",
        hint: "",
        answer: "Project Brief"
    },
    {
        question: "What management document ensures that the project’s outcomes are achieved and to confirm that the project’s benefits are realized?",
        hint: "",
        answer: "Benefits Management Approach"
    },
    {
        question: "Who makes up the project team?",
        hint: "",
        answer: "Project Board\nProject Manager\nTeam Manager\nProject Assurance\nProject Support"
    },
    {
        question: "Who is responsible for project assurance and project support?",
        hint: "",
        answer: "Project assurance - Each member of the project board is responsible for the project assurance associate with their respective area (business, user, supplier)\nProject suppport - Project manager, and making sure the services, integrations, and relationships that are necessary are there to support the project\nThese can be delegated"
    },
    {
        question: "What does the work breakdown structure form a link between?",
        hint: "",
        answer: "Product breakdown structure -> work breakdown structure -> work packages"
    },
    {
        question: "What are the components of a project to be transitioned into the organisational ecosystem? ",
        hint: "",
        answer: "People\nProdcuts\nLearning"
    },
    {
        question: "What are the plan types? Which one is optional?",
        hint: "",
        answer: "Stage\nTeam (optional)\nException\nProject"
    },
    {
        question: "When is the project product description created?",
        hint: "",
        answer: "Start of project - in the Project Brief"
    },
    {
        question: "What is the planning horizon?",
        hint: "",
        answer: "The amount of time in advance that you can plan with confidence"
    },
    {
        question: "What is the trade-off when having more stages?",
        hint: "",
        answer: "Control but more management"
    },
    {
        question: "What is one rule with stages?",
        hint: "",
        answer: "They don't overlap"
    },
    {
        question: "What is not recommended for work packages?",
        hint: "",
        answer: "That they span across stages"
    },
    {
        question: "Who uses the quality register?",
        hint: "",
        answer: "Project assurances (project board or their delegates) and Project manager "
    },
    {
        question: "What is the difference between project assurance and quality assurance?",
        hint: "",
        answer: "Quality assurance is at the product level"
    },
    {
        question: "What are the steps to quality management?",
        hint: "P-C-A",
        answer: "1. Planning - identifying, defining, agreeing\n2. Controlling - maintaining and executing on quality \n3. Approving - final acceptance process"
    },
    {
        question: "What are four types of qualitative risk analysis?",
        hint: "P-I-P-V",
        answer: "1. Impact (required)\n2. Probability (required)\n3. Velocity - how quickly the impact is realised after event occurs\n4. Proximity - how close in time it might occur"
    },
    {
        question: "What are the recommended risk response types?",
        hint: "S-P-A-R-T-A",
        answer: "Share\nPrepare contingencies (related to Reduce)\nAvoid\nReduce (mitigate)\nTransfer\nAccept"
    },
    {
        question: "What are the steps for risk management technique?",
        hint: "I-A-P-I-C",
        answer: "1.Identify\nAssess\n3.Plan\nImplement\nCommunicate"
    },
    {
        question: "What is the purpose of the issues practice?",
        hint: "",
        answer: "Controlling change"
    },
    {
        question: "What are the definitions and differences between problems, issues, risks, concerns, dis-benefit?",
        hint: "",
        answer: "Problems - an issue - has occurred and has immediate negative impact\nIssues - unplanned event that will/has occurred, impact is known\nRisks - might occur, impact is unknown\nConcerns - has/might occur, impact is uncertain \nDis-benefit - will occur, known negative benefit"
    },
    {
        question: "What is off-specification?",
        hint: "",
        answer: "Product didn't meet quality specifications - decide on whether to still accept it or not (without changing it)"
    },
    {
        question: "What are the issue management technique steps?",
        hint: "I-A-R-D-I",
        answer: "1.Identify\n2. Assess\n3. Recommend\n4. Decide\n5. Implement"
    },
    {
        question: "What is the trade-off when identifying more issues?",
        hint: "",
        answer: "Control and distraction"
    },
    {
        question: "What are the different categories of issues?",
        hint: "P-E-C-B-R-O",
        answer: "1. Problems\n2. External events\n3. Concerns\n4. Business Opportunity\n5. Request for Change\n6. Off-specification"
    },
    {
        question: "What are the two types of change control proposals (for products)?",
        hint: "",
        answer: "1. Change request - for the product, justification and reasoning\n2. Off-specification - failed to deliver on quality specifications, go or no go?"
    },
    {
        question: "What is the trade-off if the Project Board delegates change control?",
        hint: "",
        answer: "More efficient change review process, but changes may not align with business case"
    },
    {
        question: "What is a checkpoint report?",
        hint: "",
        answer: "A progress report from the Team Manager to the Project Manager, provided at the intervals specified in the Work Package Description"
    },
    {
        question: "What is the difference between a formal and informal log?",
        hint: "",
        answer: "Open and accessible to the project team - e.g., quality register"
    },
    {
        question: "What practice does the digital and data management approach belong to?",
        hint: "",
        answer: "Progress practice"
    },
    {
        question: "What are the practices?",
        hint: "",
        answer: "Business case\nOrganisation\nPlans\nRisk\nQuality\nIssues\nProgress"
    },
    {
        question: "What are the types of control and what are some examples?",
        hint: "",
        answer: "Event-driven - e.g., end of stage\nTime-drive - e.g., frequency of highlight or checkpoint reports"
    },
    {
        question: "What should be considered when forecasting?",
        hint: "",
        answer: "7 performance targets"
    },
    {
        question: "What is the escalation pipeline?",
        hint: "",
        answer: "Team manager -> Project manager -> Project board -> Business layer"
    },
    {
        question: "What are the primary uses for the PID?",
        hint: "",
        answer: "Resource for start phase and determine business justification\nReference for project board and project manager for monitoring and evaluating the project\nReference for new team members"
    },
    {
        question: "What are the different phases of the project and what roles are primarily responsible for them?",
        hint: "",
        answer: "Start - Project board\nInitial - Project manager\nControlling Stages - Team manager\nManage Stage Boundaries - Project manager\nClosing or Pausing the project - Project Manager"
    }
];
