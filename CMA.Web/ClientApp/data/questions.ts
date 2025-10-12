import { Question } from '../types.js';

export const questionsBank: Question[] = [
    // Existing questions
    { 
        id: 'q1', 
        exam_id: 'ex1', 
        sectionId: '1.2',
        question_text: 'What is the derivative of x^2?', 
        question_type: 'multiple_choice', 
        options: { 'A': '2x', 'B': 'x', 'C': 'x^2', 'D': '2' }, 
        correct_answer: 'A', 
        marks: 2, 
        difficulty: 'easy' 
    },
    { 
        id: 'q2', 
        exam_id: 'ex1', 
        sectionId: '1.3',
        question_text: 'What is the integral of 1/x?', 
        question_type: 'multiple_choice', 
        options: { 'A': 'x', 'B': 'ln(x)', 'C': '-1/x^2', 'D': '1' }, 
        correct_answer: 'B', 
        marks: 3, 
        difficulty: 'medium' 
    },
    { 
        id: 'q3', 
        exam_id: 'ex2', 
        question_text: 'What does E=mc^2 stand for?', 
        question_type: 'short_answer', 
        correct_answer: 'Energy equals mass times the speed of light squared', 
        marks: 5, 
        difficulty: 'easy' 
    },
    {
        id: 'q4',
        exam_id: 'ex1',
        sectionId: '1.1',
        question_text: 'What is the primary objective of general-purpose financial reporting?',
        question_type: 'multiple_choice',
        options: { 
            A: 'To report information that is useful to managers.', 
            B: 'To report financial information useful for making decisions about providing resources to the entity.', 
            C: 'To determine the exact market value of a company.', 
            D: 'To assist with tax compliance.' 
        },
        correct_answer: 'B',
        marks: 2,
        difficulty: 'easy'
    },
    {
        id: 'q5',
        exam_id: 'ex1',
        sectionId: '1.2',
        question_text: 'Which accounting equation represents the proprietary theory?',
        question_type: 'multiple_choice',
        options: { 
            A: 'Assets = Liabilities + Equity', 
            B: 'Assets - Liabilities = Equity', 
            C: 'Assets + Equity = Liabilities', 
            D: 'Revenues - Expenses = Income' 
        },
        correct_answer: 'B',
        marks: 2,
        difficulty: 'medium'
    },
     {
        id: 'q6',
        exam_id: 'ex1',
        sectionId: '1.5',
        question_text: 'Which of the following is NOT one of the three main activities in a Statement of Cash Flows?',
        question_type: 'multiple_choice',
        options: { 
            A: 'Operating Activities', 
            B: 'Investing Activities', 
            C: 'Financing Activities', 
            D: 'Auditing Activities' 
        },
        correct_answer: 'D',
        marks: 1,
        difficulty: 'easy'
    },
    
    // New questions for additional study units
    // Unit 2: Planning, Budgeting, and Forecasting
    {
        id: 'q7',
        exam_id: 'ex2',
        sectionId: '2.1',
        question_text: 'Which of the following is NOT a component of SWOT analysis?',
        question_type: 'multiple_choice',
        options: { 
            A: 'Strengths', 
            B: 'Weaknesses', 
            C: 'Opportunities', 
            D: 'Tactics' 
        },
        correct_answer: 'D',
        marks: 1,
        difficulty: 'easy'
    },
    {
        id: 'q8',
        exam_id: 'ex2',
        sectionId: '2.2',
        question_text: 'What is the primary difference between zero-based budgeting and traditional budgeting?',
        question_type: 'multiple_choice',
        options: { 
            A: 'Zero-based budgeting starts from zero each period', 
            B: 'Traditional budgeting is more accurate', 
            C: 'Zero-based budgeting only applies to capital budgets', 
            D: 'Traditional budgeting is used only for operating budgets' 
        },
        correct_answer: 'A',
        marks: 2,
        difficulty: 'medium'
    },
    {
        id: 'q9',
        exam_id: 'ex2',
        sectionId: '2.3',
        question_text: 'Which forecasting method uses a weighted average of past observations, with more weight given to recent data?',
        question_type: 'multiple_choice',
        options: { 
            A: 'Simple moving average', 
            B: 'Exponential smoothing', 
            C: 'Linear regression', 
            D: 'Delphi technique' 
        },
        correct_answer: 'B',
        marks: 2,
        difficulty: 'medium'
    },
    {
        id: 'q10',
        exam_id: 'ex2',
        sectionId: '2.5',
        question_text: 'Which capital budgeting method calculates the discount rate that makes the net present value of an investment equal to zero?',
        question_type: 'multiple_choice',
        options: { 
            A: 'Payback period', 
            B: 'Accounting rate of return', 
            C: 'Internal rate of return', 
            D: 'Profitability index' 
        },
        correct_answer: 'C',
        marks: 2,
        difficulty: 'medium'
    },
    
    // Unit 3: Performance Management
    {
        id: 'q11',
        exam_id: 'ex3',
        sectionId: '3.1',
        question_text: 'Which cost classification is based on whether costs change with the level of activity?',
        question_type: 'multiple_choice',
        options: { 
            A: 'Direct vs. indirect', 
            B: 'Fixed vs. variable', 
            C: 'Product vs. period', 
            D: 'Relevant vs. irrelevant' 
        },
        correct_answer: 'B',
        marks: 1,
        difficulty: 'easy'
    },
    {
        id: 'q12',
        exam_id: 'ex3',
        sectionId: '3.2',
        question_text: 'Which perspective of the Balanced Scorecard focuses on how customers see the organization?',
        question_type: 'multiple_choice',
        options: { 
            A: 'Financial perspective', 
            B: 'Customer perspective', 
            C: 'Internal business processes perspective', 
            D: 'Learning and growth perspective' 
        },
        correct_answer: 'B',
        marks: 1,
        difficulty: 'easy'
    },
    {
        id: 'q13',
        exam_id: 'ex3',
        sectionId: '3.3',
        question_text: 'What is the primary objective of transfer pricing?',
        question_type: 'multiple_choice',
        options: { 
            A: 'To maximize total company profits', 
            B: 'To minimize taxes in all jurisdictions', 
            C: 'To ensure each division shows the highest profit', 
            D: 'To comply with local regulations only' 
        },
        correct_answer: 'A',
        marks: 2,
        difficulty: 'medium'
    },
    {
        id: 'q14',
        exam_id: 'ex3',
        sectionId: '3.4',
        question_text: 'Which performance measure is calculated as Operating Income divided by Average Operating Assets?',
        question_type: 'multiple_choice',
        options: { 
            A: 'Residual Income', 
            B: 'Economic Value Added', 
            C: 'Return on Investment', 
            D: 'Profit Margin' 
        },
        correct_answer: 'C',
        marks: 1,
        difficulty: 'easy'
    },
    
    // Unit 4: Cost Management
    {
        id: 'q15',
        exam_id: 'ex4',
        sectionId: '4.1',
        question_text: 'What type of cost remains constant in total regardless of changes in activity level?',
        question_type: 'multiple_choice',
        options: { 
            A: 'Variable cost', 
            B: 'Fixed cost', 
            C: 'Mixed cost', 
            D: 'Step cost' 
        },
        correct_answer: 'B',
        marks: 1,
        difficulty: 'easy'
    },
    {
        id: 'q16',
        exam_id: 'ex4',
        sectionId: '4.2',
        question_text: 'Which costing system is most appropriate for a custom furniture manufacturer?',
        question_type: 'multiple_choice',
        options: { 
            A: 'Process costing', 
            B: 'Job-order costing', 
            C: 'Activity-based costing', 
            D: 'Standard costing' 
        },
        correct_answer: 'B',
        marks: 2,
        difficulty: 'easy'
    },
    {
        id: 'q17',
        exam_id: 'ex4',
        sectionId: '4.3',
        question_text: 'In activity-based costing, what is a cost driver?',
        question_type: 'multiple_choice',
        options: { 
            A: 'The total amount of costs in a cost pool', 
            B: 'A factor that causes costs to be incurred', 
            C: 'The allocation rate for overhead costs', 
            D: 'The total number of units produced' 
        },
        correct_answer: 'B',
        marks: 2,
        difficulty: 'medium'
    },
    {
        id: 'q18',
        exam_id: 'ex4',
        sectionId: '4.4',
        question_text: 'What variance measures the difference between actual and standard hours allowed, multiplied by the standard variable overhead rate?',
        question_type: 'multiple_choice',
        options: { 
            A: 'Variable overhead spending variance', 
            B: 'Variable overhead efficiency variance', 
            C: 'Fixed overhead spending variance', 
            D: 'Fixed overhead volume variance' 
        },
        correct_answer: 'B',
        marks: 2,
        difficulty: 'hard'
    },
    
    // Unit 5: Internal Controls
    {
        id: 'q19',
        exam_id: 'ex5',
        sectionId: '5.1',
        question_text: 'Which of the following is NOT one of the five components of the COSO internal control framework?',
        question_type: 'multiple_choice',
        options: { 
            A: 'Control environment', 
            B: 'Risk assessment', 
            C: 'Control activities', 
            D: 'Strategic planning' 
        },
        correct_answer: 'D',
        marks: 1,
        difficulty: 'easy'
    },
    {
        id: 'q20',
        exam_id: 'ex5',
        sectionId: '5.2',
        question_text: 'Which risk response strategy involves taking action to reduce the likelihood or impact of a risk?',
        question_type: 'multiple_choice',
        options: { 
            A: 'Risk avoidance', 
            B: 'Risk reduction', 
            C: 'Risk sharing', 
            D: 'Risk acceptance' 
        },
        correct_answer: 'B',
        marks: 1,
        difficulty: 'easy'
    },
    {
        id: 'q21',
        exam_id: 'ex5',
        sectionId: '5.4',
        question_text: 'According to the fraud triangle, which of the following is NOT one of the conditions that must be present for fraud to occur?',
        question_type: 'multiple_choice',
        options: { 
            A: 'Pressure', 
            B: 'Opportunity', 
            C: 'Rationalization', 
            D: 'Greed' 
        },
        correct_answer: 'D',
        marks: 2,
        difficulty: 'medium'
    },
    
    // Unit 6: Technology and Analytics
    {
        id: 'q22',
        exam_id: 'ex6',
        sectionId: '6.1',
        question_text: 'Which type of information system is designed to support middle management decision making?',
        question_type: 'multiple_choice',
        options: { 
            A: 'Transaction Processing System', 
            B: 'Management Information System', 
            C: 'Decision Support System', 
            D: 'Executive Information System' 
        },
        correct_answer: 'B',
        marks: 1,
        difficulty: 'easy'
    },
    {
        id: 'q23',
        exam_id: 'ex6',
        sectionId: '6.2',
        question_text: 'Which type of analytics answers the question "What should we do?"',
        question_type: 'multiple_choice',
        options: { 
            A: 'Descriptive analytics', 
            B: 'Diagnostic analytics', 
            C: 'Predictive analytics', 
            D: 'Prescriptive analytics' 
        },
        correct_answer: 'D',
        marks: 2,
        difficulty: 'medium'
    },
    {
        id: 'q24',
        exam_id: 'ex6',
        sectionId: '6.3',
        question_text: 'Which cybersecurity threat involves tricking users into revealing sensitive information through deceptive emails?',
        question_type: 'multiple_choice',
        options: { 
            A: 'Malware', 
            B: 'Phishing', 
            C: 'Ransomware', 
            D: 'DDoS' 
        },
        correct_answer: 'B',
        marks: 1,
        difficulty: 'easy'
    },
    {
        id: 'q25',
        exam_id: 'ex6',
        sectionId: '6.4',
        question_text: 'Which emerging technology uses a distributed ledger to record transactions across multiple computers?',
        question_type: 'multiple_choice',
        options: { 
            A: 'Artificial Intelligence', 
            B: 'Blockchain', 
            C: 'Internet of Things', 
            D: 'Cloud computing' 
        },
        correct_answer: 'B',
        marks: 1,
        difficulty: 'easy'
    }
];