import { SyllabusUnit } from '../types.js';

export const syllabusData: SyllabusUnit[] = [
  {
    id: 'unit1',
    title: 'Study Unit One: External Financial Statements',
    description: 'This study unit is the first of six on external financial reporting decisions. It discusses the basic concepts underlying financial accounting.',
    weight: '15%',
    sections: [
      {
        id: '1.1',
        title: 'Concepts of Financial Accounting',
        content: `## 1.1 Concepts of Financial Accounting
**The Objective of General-Purpose Financial Reporting:**
To report financial information that is useful in making decisions about providing resources to the reporting entity. The information relates to the entity’s economic resources and claims (financial position) and to changes in them.

**Key Uses:**
- Evaluate liquidity, solvency, financing needs.
- Understand the return on economic resources, its variability, and its components.
- Evaluate management performance.
- Predict future returns.

**Standard:**
Statements must be prepared in conformity with accounting principles that are generally accepted in the United States (GAAP). The CMA exam may also test on International Financial Reporting Standards (IFRS).

**Financial vs. Management Accounting:**
- **Financial Accounting:** Differs from management accounting. Primarily for external users.
- **Management Accounting:** Assists internal management with decision making, planning, and control.
`
      },
      {
        id: '1.2',
        title: 'Statement of Financial Position (Balance Sheet)',
        content: `## 1.2 Statement of Financial Position (Balance Sheet)
Reports the amounts of assets (items of value), liabilities (debt), and equity (net worth) at a moment in time. It helps users assess liquidity, financial flexibility, efficiency, capital structure, and risk.

**The Basic Accounting Equation:**
Assets = Liabilities + Stockholders' Equity

This equation is based on the **fund theory**. It can be rearranged to form the **proprietary theory**:
Assets – Liabilities = Stockholders' Equity

**Transaction Analysis:**
Every transaction has a dual effect, impacting at least two elements of the equation, which must always remain in balance.

**Elements of the Balance Sheet:**
- **Assets:** Resources controlled by the entity from past events, representing probable future economic benefits. Examples: inventory, accounts receivable, property, plant, and equipment (PPE).
- **Liabilities:** Present obligations from past events, expected to result in an outflow of economic benefits. Examples: loans payable, bonds payable, accounts payable.
- **Equity:** The residual interest in the assets after deducting all liabilities. Examples: common stock, preferred stock, retained earnings.
Assets and liabilities are separated into **current** and **noncurrent** categories.
`
      },
      {
        id: '1.3',
        title: 'Income Statement and Statement of Comprehensive Income',
        content: `## 1.3 Income Statement and Statement of Comprehensive Income
Reports the results of an entity’s operations over a period of time.

**The Income Equation:**
Income (Loss) = Revenues + Gains – Expenses – Losses

**Elements:**
- **Revenues:** Inflows from delivering goods, services, or other major operations.
- **Gains:** Increases in equity other than from revenues or owner investments.
- **Expenses:** Outflows or usage of assets from delivering goods, services, or other major operations.
- **Losses:** Decreases in equity other than from expenses or distributions to owners.

**Cost of Goods Sold (COGS):**
- **For a retailer:** Beginning inventory + Net purchases + Freight-in - Ending inventory.
- **For a manufacturer:** Involves calculating the cost of goods manufactured.

**Gross Profit:**
Net sales revenue - Cost of goods sold.
`
      },
      {
        id: '1.4',
        title: 'Statement of Changes in Equity and Equity Transactions',
        content: `## 1.4 Statement of Changes in Equity and Equity Transactions
**Statement of Changes in Equity:**
Presents a reconciliation for the accounting period of the beginning balance for each component of equity to the ending balance. Common changes include: Net income/loss, Distributions to owners (dividends), Issuance of common stock, and changes in other comprehensive income (OCI).

**Statement of Retained Earnings:**
A part of the statement of changes in equity. The reconciliation is:
Beginning RE + Net Income (or - Net Loss) - Dividends +/- Prior-period adjustments = Ending RE.

**Equity Transactions:**
- **Common and Preferred Stock:** Classes of stock representing ownership. Key terms are Authorized, Issued, and Outstanding.
- **Treasury Stock:** The entity’s own stock that was repurchased. It reduces shares outstanding.
`
      },
      {
        id: '1.5',
        title: 'Statement of Cash Flows',
        content: `## 1.5 Statement of Cash Flows
The primary purpose is to provide relevant information about the cash receipts and cash payments of an entity during a period. It helps users assess liquidity, solvency, and financial flexibility.

**Three Main Activities:**
1.  **Operating Activities:** Primarily derived from the principal revenue-producing activities. Generally result from transactions that enter into the determination of net income.
2.  **Investing Activities:** Represent expenditures made for resources intended to generate future income and cash flows (e.g., buying/selling PPE, acquiring/selling debt or equity of other entities).
3.  **Financing Activities:** Involve cash effects of transactions with the owners (equity) and creditors (debt).

The statement reconciles the beginning and ending balances of cash and cash equivalents.
`
      },
      {
        id: '1.6',
        title: 'Consolidation Accounting',
        content: `## 1.6 Consolidation Accounting
When one entity controls another, consolidated financial statements must be issued by the parent company.

**Key Concepts:**
- **Business Combination:** A transaction in which an acquirer obtains control of another business.
- **Control:** The direct or indirect ability to determine the direction of management and policies, usually through ownership of more than 50% of voting interests.
- **Parent & Subsidiary:** A parent is an entity with a controlling financial interest in one or more subsidiaries.
- **Acquisition Method:** Business combinations must be accounted for using this method, which involves recognizing and measuring identifiable assets, liabilities, and any noncontrolling interest at acquisition-date fair value.
- **Goodwill:** An intangible asset reflecting future economic benefits from assets that are not individually identified. It's the difference between the consideration transferred and the fair value of identifiable net assets acquired.
`
      }
    ]
  },
  {
    id: 'unit2',
    title: 'Study Unit Two: Planning, Budgeting, and Forecasting',
    description: 'This study unit covers the planning, budgeting, and forecasting processes essential for organizational success.',
    weight: '20%',
    sections: [
      {
        id: '2.1',
        title: 'Strategic Planning',
        content: `## 2.1 Strategic Planning
Strategic planning is the process of determining an organization's long-term goals and strategies for achieving them.

**Key Components:**
- Vision and mission statements
- SWOT analysis (Strengths, Weaknesses, Opportunities, Threats)
- Strategic objectives
- Strategy formulation and implementation

**Strategic Analysis Tools:**
- PEST analysis (Political, Economic, Social, Technological)
- Five Forces Analysis (Porter's Model)
- Value Chain Analysis
- Balanced Scorecard
`
      },
      {
        id: '2.2',
        title: 'Budgeting Concepts',
        content: `## 2.2 Budgeting Concepts
Budgeting is the process of creating plans for the acquisition and use of resources over a specified time period.

**Types of Budgets:**
- **Operating Budget:** Projects revenues and expenses for the primary operations
- **Capital Budget:** Plans for long-term asset acquisitions
- **Cash Budget:** Projects cash inflows and outflows
- **Financial Budget:** Projects financial position and results

**Budgeting Approaches:**
- Traditional budgeting (incremental)
- Zero-based budgeting (ZBB)
- Activity-based budgeting (ABB)
- Kaizen budgeting (continuous improvement)
`
      },
      {
        id: '2.3',
        title: 'Forecasting Techniques',
        content: `## 2.3 Forecasting Techniques
Forecasting is the process of predicting future events based on historical data and analysis.

**Quantitative Methods:**
- Time series analysis
- Moving averages
- Exponential smoothing
- Regression analysis

**Qualitative Methods:**
- Executive opinions
- Delphi technique
- Sales force composite
- Customer surveys

**Forecasting Accuracy:**
- Mean Absolute Deviation (MAD)
- Mean Squared Error (MSE)
- Tracking signals
`
      },
      {
        id: '2.4',
        title: 'Budgeting Methodologies',
        content: `## 2.4 Budgeting Methodologies
Different approaches to creating and managing budgets within an organization.

**Continuous/ Rolling Budgets:**
- Updated regularly (monthly/quarterly)
- Maintains a constant planning horizon

**Activity-Based Budgeting:**
- Focuses on activities that drive costs
- Aligns resources with value-added activities

**Kaizen Budgeting:**
- Incorporates continuous improvement
- Sets targets for cost reduction

**Flexible Budgeting:**
- Adjusts for different levels of activity
- Useful for performance evaluation
`
      },
      {
        id: '2.5',
        title: 'Capital Budgeting',
        content: `## 2.5 Capital Budgeting
Capital budgeting involves making long-term investment decisions in projects or assets.

**Evaluation Methods:**
- **Payback Period:** Time to recover initial investment
- **Accounting Rate of Return (ARR):** Average annual profit/initial investment
- **Net Present Value (NPV):** Present value of cash flows minus initial investment
- **Internal Rate of Return (IRR):** Discount rate that makes NPV equal to zero
- **Profitability Index:** Present value of cash flows/initial investment

**Risk Analysis:**
- Sensitivity analysis
- Scenario analysis
- Monte Carlo simulation
`
      }
    ]
  },
  {
    id: 'unit3',
    title: 'Study Unit Three: Performance Management',
    description: 'This study unit focuses on performance measurement and management systems.',
    weight: '20%',
    sections: [
      {
        id: '3.1',
        title: 'Cost Management',
        content: `## 3.1 Cost Management
Cost management involves planning and controlling the budgeted costs of activities.

**Cost Classifications:**
- By behavior: Fixed, Variable, Mixed
- By traceability: Direct, Indirect
- By relevance: Relevant, Irrelevant
- By function: Product, Period

**Costing Systems:**
- Job-order costing
- Process costing
- Activity-based costing (ABC)
`
      },
      {
        id: '3.2',
        title: 'Performance Measurement',
        content: `## 3.2 Performance Measurement
Performance measurement evaluates how well an organization or individual is achieving objectives.

**Key Performance Indicators (KPIs):**
- Financial metrics (ROI, ROE, EVA)
- Non-financial metrics (customer satisfaction, quality measures)
- Leading vs. lagging indicators

**Balanced Scorecard:**
- Financial perspective
- Customer perspective
- Internal business processes perspective
- Learning and growth perspective
`
      },
      {
        id: '3.3',
        title: 'Transfer Pricing',
        content: `## 3.3 Transfer Pricing
Transfer pricing refers to the pricing of goods and services between divisions of the same company.

**Transfer Pricing Methods:**
- Market-based prices
- Cost-based prices
- Negotiated prices
- Dual pricing

**Objectives:**
- Goal congruence
- Performance evaluation
- Resource allocation
- Tax planning
`
      },
      {
        id: '3.4',
        title: 'Investment Centers',
        content: `## 3.4 Investment Centers
Investment centers are responsibility centers where managers control revenues, costs, and investment decisions.

**Performance Measures:**
- Return on Investment (ROI)
- Residual Income (RI)
- Economic Value Added (EVA)

**ROI Formula:**
ROI = Operating Income / Average Operating Assets
ROI = Profit Margin × Asset Turnover

**Limitations:**
- May lead to suboptimal decisions
- Can discourage investments with returns below divisional ROI
`
      }
    ]
  },
  {
    id: 'unit4',
    title: 'Study Unit Four: Cost Management',
    description: 'This study unit covers cost measurement, accumulation, and allocation techniques.',
    weight: '15%',
    sections: [
      {
        id: '4.1',
        title: 'Cost Concepts and Classifications',
        content: `## 4.1 Cost Concepts and Classifications
Understanding different ways to categorize and analyze costs.

**By Function:**
- Production costs
- Selling costs
- Administrative costs

**By Behavior:**
- Fixed costs (remain constant in total)
- Variable costs (vary in total with activity)
- Mixed costs (have both fixed and variable components)

**By Traceability:**
- Direct costs (traceable to cost object)
- Indirect costs (not easily traceable)

**By Relevance:**
- Relevant costs (differ between alternatives)
- Sunk costs (past costs, not relevant)
- Opportunity costs (benefits foregone)
`
      },
      {
        id: '4.2',
        title: 'Cost Accumulation Systems',
        content: `## 4.2 Cost Accumulation Systems
Methods for collecting and assigning costs to cost objects.

**Job-Order Costing:**
- Used for unique, custom products
- Costs accumulated by job
- Appropriate for construction projects, custom furniture

**Process Costing:**
- Used for mass production of identical units
- Costs accumulated by process or department
- Appropriate for chemical processing, food production

**Hybrid Systems:**
- Combines elements of job-order and process costing
- Used when products have both common and unique features
`
      },
      {
        id: '4.3',
        title: 'Cost Allocation',
        content: `## 4.3 Cost Allocation
The process of assigning indirect costs to cost objects.

**Allocation Methods:**
- **Traditional costing:** Single overhead rate
- **Activity-based costing (ABC):** Multiple cost pools and drivers

**Steps in ABC:**
1. Identify activities
2. Assign resource costs to activities
3. Identify cost drivers
4. Calculate activity rates
5. Assign activity costs to products

**Benefits of ABC:**
- More accurate product costing
- Better understanding of cost drivers
- Improved decision making
`
      },
      {
        id: '4.4',
        title: 'Overhead Analysis',
        content: `## 4.4 Overhead Analysis
Analysis of indirect manufacturing costs.

**Types of Overhead:**
- Variable overhead (changes with production)
- Fixed overhead (remains constant)
- Mixed overhead (combination of both)

**Overhead Variances:**
- **Variable overhead:**
  - Spending variance
  - Efficiency variance
- **Fixed overhead:**
  - Spending variance
  - Volume variance

**Capacity Concepts:**
- Theoretical capacity
- Practical capacity
- Normal capacity
- Expected capacity
`
      }
    ]
  },
  {
    id: 'unit5',
    title: 'Study Unit Five: Internal Controls',
    description: 'This study unit covers internal control systems and risk management.',
    weight: '15%',
    sections: [
      {
        id: '5.1',
        title: 'Internal Control Framework',
        content: `## 5.1 Internal Control Framework
Internal control is a process designed to provide reasonable assurance regarding achievement of objectives.

**COSO Framework Components:**
1. Control Environment
2. Risk Assessment
3. Control Activities
4. Information and Communication
5. Monitoring Activities

**Control Objectives:**
- Effectiveness and efficiency of operations
- Reliability of financial reporting
- Compliance with applicable laws and regulations
`
      },
      {
        id: '5.2',
        title: 'Risk Management',
        content: `## 5.2 Risk Management
Risk management is the identification, assessment, and prioritization of risks.

**Risk Management Process:**
1. Risk identification
2. Risk assessment
3. Risk response
4. Risk monitoring

**Types of Risk:**
- Strategic risk
- Operational risk
- Financial risk
- Compliance risk

**Risk Response Strategies:**
- Risk avoidance
- Risk reduction/mitigation
- Risk sharing/transfer
- Risk acceptance
`
      },
      {
        id: '5.3',
        title: 'Business Continuity',
        content: `## 5.3 Business Continuity
Business continuity planning ensures an organization can continue operations during and after disruptions.

**Key Components:**
- Business impact analysis
- Recovery strategies
- Plan development
- Testing and maintenance

**Disaster Recovery:**
- Data backup and recovery
- Alternate processing sites
- Emergency response procedures
- Communication plans
`
      },
      {
        id: '5.4',
        title: 'Fraud Prevention and Detection',
        content: `## 5.4 Fraud Prevention and Detection
Fraud is intentional deception for personal gain.

**Types of Fraud:**
- Asset misappropriation
- Corruption
- Financial statement fraud

**Fraud Triangle:**
- Pressure/Motivation
- Opportunity
- Rationalization

**Prevention Measures:**
- Strong internal controls
- Segregation of duties
- Authorization procedures
- Regular reconciliations
- Employee screening
`
      }
    ]
  },
  {
    id: 'unit6',
    title: 'Study Unit Six: Technology and Analytics',
    description: 'This study unit covers information systems, data analytics, and technology in management accounting.',
    weight: '15%',
    sections: [
      {
        id: '6.1',
        title: 'Information Systems',
        content: `## 6.1 Information Systems
Information systems collect, process, store, and distribute information to support decision making.

**Types of Systems:**
- Transaction Processing Systems (TPS)
- Management Information Systems (MIS)
- Decision Support Systems (DSS)
- Executive Information Systems (EIS)

**Enterprise Resource Planning (ERP):**
- Integrated software solutions
- Centralized database
- Real-time information
- Cross-functional processes
`
      },
      {
        id: '6.2',
        title: 'Data Analytics',
        content: `## 6.2 Data Analytics
Data analytics involves examining data sets to draw conclusions and support decision making.

**Types of Analytics:**
- **Descriptive:** What happened?
- **Diagnostic:** Why did it happen?
- **Predictive:** What might happen?
- **Prescriptive:** What should we do?

**Tools and Techniques:**
- Data visualization
- Statistical analysis
- Machine learning
- Data mining
`
      },
      {
        id: '6.3',
        title: 'Cybersecurity',
        content: `## 6.3 Cybersecurity
Cybersecurity involves protecting information systems from intrusion, attack, and damage.

**Key Threats:**
- Malware
- Phishing
- Ransomware
- Insider threats
- DDoS attacks

**Security Controls:**
- Firewalls
- Encryption
- Access controls
- Intrusion detection systems
- Security awareness training
`
      },
      {
        id: '6.4',
        title: 'Emerging Technologies',
        content: `## 6.4 Emerging Technologies
New technologies that are transforming business operations and decision making.

**Key Technologies:**
- Artificial Intelligence (AI)
- Blockchain
- Internet of Things (IoT)
- Cloud computing
- Robotic Process Automation (RPA)

**Impact on Management Accounting:**
- Enhanced data processing capabilities
- Improved forecasting accuracy
- Automated routine tasks
- Real-time reporting
- Better decision support
`
      }
    ]
  }
];