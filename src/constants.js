import CareerData from "./model/career"
import ProjectData from "./model/project"

// TAB CONSTANTS
const HOME = 'HOME'
const SKILLS = 'SKILLS'
const CAREER = 'CAREER'
const PROJECTS = 'PROJECTS'
const CONTACT = 'CONTACT'


// SOCIAL MEDIA LINKS
const facebookLink = ''
const linkedinLink = 'https://www.linkedin.com/in/agrawal-sumit/'
const githubLink = 'https://github.com/tech-sumit'
const instagramLink = 'https://www.instagram.com/mr.sumitagrawal/'
const twitterLink = ''


// PROJECTS DATA

const projectsData =[
    new ProjectData(
        14,
        'Service Infrastructure',
        '',
        'https://www.cloudwalker.tv/',
        `Built a highly scalable backend and android system app
        capable of diagnosing and fixing issues in devices having CloudTV OS.
        Optimized customer experience by enabling remote troubleshooting devices
        which reduced on-site support requests saving costs for the organization`,
        [
            'Android system app',
            'GoLang Microservices',
            'AWS IoT',
            'AWS SNS',
            'NodeJS',
            'ReactJS',
            'MongoDB',
            'AWS ECS'
        ]


    ),
    new ProjectData(
        13,
        'Cloudwalker AppStore',
        '',
        'https://cloudtvos.com/#app-store',
        `Developed both backend and App store for featuring
        OTT apps and other compatible Android TV applications`,
        [
            'Android app',
            'GoLang gRPC API gateway',
            'NodeJS',
            'ReactJS',
            'MongoDB',
            'AWS ECS'
        ]
    ),
    
    new ProjectData(
        12,
        'Enterprise CMS',
        '',
        'https://cloudtvos.com/#cde',
        `Built low latency, highly scalable CMS for content creation &
        delivery for CloudTV OS`,
        [
           'Android system app',
           'GoLang REST APIs',
           'NodeJS',
           'ReactJS',
           'MongoDB,',
           'Redis Cache',
           'AWS ECS'
        ]
    ),
    new ProjectData(
        11,
        'LMS',
        '',
        'https://www.cloudwalker.tv/',
        `It is a License Manager & authentication application combination. Its role &
        policy mechanism is similar to IAM policies of AWS Cloud. The auth app is used
        to log in to the system on a QRCode scan. This system is provided to partner
        manufacturers which can upload the sheets to activate licenses for Smart TVs
        manufactured by them`,
        [
           'GoLang microservices',
           'NATS messaging',
           'NodeJS',
           'ReactJS',
           'MongoDB,',
           'AWS ECS'
        ]
    ),
    new ProjectData(
        10,
        'Data Analytics platform',
        '',
        'https://www.cloudwalker.tv/',
        `Its the machine learning as a service platform that
        ingests the user viewership data and generates the analytical insights for
        organization & recommendations for users`,
        [
           'Python Flask',
           'SparkQL',
           'ORC store',
           'Digital ocean',
        ]
    ),
    new ProjectData(
        9,
        'OTA Updates',
        '',
        'https://cloudtvos.com/',
        `It's an Over-The-Air update backend for Android devices
        delivering updates like brand updates, security patches & system app updates &
        more. The backend is capable of building a tree of conditions to be checked
        before delivering the OTA update to the device`,
        [
           'GoLang Backend',
           'ReactJS',
           'MongoDB',
           'AWS ECS',
        ]
    ),
    new ProjectData(
        8,
        'Home Defender devices',
        '',
        'https://www.cloudwalker.tv/',
        `These are devices built using medical precision
        sensors integrated with AWS IoT & a Companion mobile app. These devices are
        useful for the autonomous contactless recording of a visitor's body temperature
        and profiling, also raising alerts whenever necessary`,
        [
           'ESP8266',
           'Ambient Temperature sensors',
           'OLED display',
           'buzzer module',
           'IR proximity sensor',
           'Android companion app',
           'NodeJS',
           'NodeJS',
           'DynamoDB',
           'AWS IoT',
           'AWS Lambda'
        ]
    ),
    new ProjectData(
        7,
        'Cloudy',
        '',
        'https://cloudtvos.com/',
        `It's an embedded AI assistant for all CloudTVs. Users can interact &
        control the smart tv with the help of this assistant using a voice remote. This
        assistant also works on low ram Smart TVs. This is specialized for Smart TVs so it provides much more features & works better than Alexa & Google assistant by
        using the powers of vendor SDKs.`,
        [
           'Android system app',
           'Ambient Temperature sensors',
           'GoLang Microservices',
           'Wit.AI NLP',
           'RASA',
           'GCP Speech to text ',
           'NodeJS',
           'NodeJS',
           'MongoDB,',
           'AWS ECS',
        ]
    ),
    new ProjectData(
        6,
        'Neobank for Validus group',
        '',
        'https://validus.sg/2022/01/validus-adds-key-hires-to-its-senior-leadership-team/',
        `The lending platform was the entry point for customers where they can be SMEs
        or Investors. Investors invest & track their funds & SMEs can apply for loans.
        Neobank comes into the picture at the time of fund disbursal.
            Instead of putting funds directly in a SME's bank account, funds are kept in a Neobank virtual
        account so the investor can ensure the funds are being used for the right thing.
        The SME can add its employees to a Neobank account then their wallets will be
        created & from the SME Account, the funds can be disbursed in those wallets.
        Also, the spend control can be applied where spend categories & limits can be
        configured. Spend approval process was built where employees can upload
        receipts which will be approved by SMEs approver. This solution helps solve trust
        issues between investors & businesses here SMEs.`,
        [
           'Java Microservices',
           'VueJS frontend',
           'Amazon EKS',
           'RDS(MySQL)',
           'API Gateway',
           'private VPCs',
           'Flutter',
           'Terraform',
        ]
    ),
    new ProjectData(
        5,
        'GST Hero (Homegrown suite of business tools)',
        '',
        'https://gsthero.com/',
        `Worked with the CEO to understand product vision. Adopted automation to
        reduce operational overhead & enabled the use of Salesforce to manage leads &
        customer relations resulting in a revenue increase of 160% just by doing proper
        lead management. Also initiated a data engineering team also built a team & tech
        stack for this initiative`,
        []
    ),
    new ProjectData(
        4,
        'ERP for Bukalapak Ecommerce platform',
        '',
        'https://www.bukalapak.com/',
        `Ecommerce seller back office aggregator & management system designed to
        help sellers manage multiple marketplaces at one place. This system allows
        sellers to integrate multiple stores from the same or different marketplaces. We import and periodically sync data which includes products, orders, promotional
        data, store settings, etc from the marketplace to ERP. Using the system sellers
        can accept/reject, process shipments, manage returns, track users feedback,
        manage inventory, get reports and sales analytics.
              The system is built as Microservices-based service mesh architecture deployed on Kubernetes
        powered by Istio. Services communicate with each other with mutual TLS and
        gRPC as transport. To manage third-party API throttling used GCP Cloud Tasks
        (Task queue) with Cloud functions written in GoLang on the other end. For
        asynchronous interservice message queue used GCP PubSub and for frontend
        used React.JS with recoil for state management & WebSocket for notifications
        and async operations responses to update UI and notify sellers for updates.`,
        [
            'GoLang Microservices',
            'ReactJS',
            'Firebase',
            'service mesh',
            'Kubernetes',
            'Cloud functions',
            'CloudSQL(PostgreSQL)',
            'Redis',
            'GCP PubSub',
            'Cloud Tasks',
            'Bitbucket.'

        ]
    ),
    new ProjectData(
        3,
        'Cryptocurrency trading & portfolio application',
        '',
        'https://www.alpha5.io/',
        `The system collects order books from different exchanges via WebSocket or
        RPC interfaces, retrieves the user's crypto balances & past trade history, then
        aggregates whole data & stores it in Timescale DB. The mobile app flutter app
        then consumes this data via proto streaming over MQTT. The proto APIs allow
        users to place spot, feature orders, With algorithms implemented to Arbitrage
        across multiple currencies and exchanges in real-time. Using Geth (Ethereum
        node written in Go) Also built transaction scraper for DApp decentralized
        application users`,
        [
            'GoLang',
            'C++ Microservices',
            'ApacheMQ',
            'Flutter',
            'Geth,',
            'Protocol buffers',
            'TimescaleDB',
            'MongoDB',
            'Prometheus',
            'Grafana',
            'Kubernetes.'

        ]
    ),
    new ProjectData(
        2,
        'On-Road emergency and repair services',
        '',
        'https://youtu.be/wFo2-0FLdlc',
        `This is an application for locating
        nearby vehicle service stations in case of a highway vehicle failure or In case of a
        medical emergency, This app contacts the nearest ambulance operators and
        also displays the location of the requester on the operator's application. This
        project ranked in KPIT Sparkle 2019 Top 20 national projects.`,
        [
            'Android App',
            'GMS services',
            'NodeJS backend',
            'ReactJS Dashboard',
            'PostgreSQL',
            'Redis cache',
            'Digital Ocean'
        ]
    ),
    new ProjectData(
        1,
        'CarRace AR',
        '',
        'https://drive.google.com/file/d/182Td0uKxcxTnwOLFwzMYTfwYpssv0-gl/view?usp=sharing',
        `Augmented reality car racing game for Accenture Innovation
        Challenge. Ranked in top 20 projects nationally. Play a car racing game on
        augmented terrain on a simple sheet of paper.`,
        [
            'Unity3D',
            'Vuforia',
            'Android App',
            'NodeJS backend',
            'MongoDB',
            'AWS ECS'
        ]

    ),
    new ProjectData(
        0,
        'Maha-RTO Marathi Test',
        'https://github.com/tech-sumit/MahaRTOMarathiTest',
        '',
        `Android app created for Marathi literate users to
        practice for the LLR exam conducted by the Maharashtra State RTO department.`,
        [
            'Android App',
            'Google Translate API'
        ]
    )
]


// CAREERS DATA
const careersData =[
    new CareerData(
        'Spenmo',
        'Spenmo Technologies',
        'Lead Engineer GoLang',
        '03/2022',
        'Present',
        [
            `Spenmo is a SaaS product-based organization funded by Y Combinator & Tiger global. 
            The product vision is to be a Software CFO of a company. 
            My responsibility is to Lead the team of Top talent across the globe for GoLang & Microservice architecture. 
            I am helping Spenmo migrate from Monolith PHP architecture which is not scalable to the hyper scalable fault-tolerant organization-wide microservices architecture.`,
        ],
        [],
        'https://spenmo.com/',
        []
    ),
    new CareerData(
        'Argonaut HQ',
        'Argonaut HQ',
        'Senior Software Developer Founding Team',
        '01/2022',
        '3/2022',
        [
            `Here at Argonaut.dev we are trying to bridge the gap between startups & secure
            & scalable infrastructure. We are a silicon valley startup funded by Y Combinator.
            Our product offloads the allocation & management of infrastructure as well as deploys codes
            for teams. I am responsible for designing & engineering the system more from the
            Architectural & backend perspective.`,
        ],
        [],
        'https://www.argonaut.dev/',
        []

    ),
    new CareerData(
        'Perennial Systems',
        'Perennial Systems Inc.',
        'Tech Lead managing GoLang & DevOps vertical',
        '12/2020',
        '01/2022',
        [
            `I am responsible for learning & adopting new technologies in the organization,
            architect & build the systems from scratch, Guide & work with the team to build scalable
            & bulletproof systems. Built a team from scratch to 20+ talented developers & Ops
            persons.
            Helped the organization to build the next level of authority by promoting
            capable developers to mid-managers to grow the team further. Being in a product
            development organization contributed to multiple projects with roles like Solutions
            Architect & Tech Lead & built well-architected systems & took responsibility for the
            development cycles.
            I worked with Product owners to understand their needs and
            assisted them to build products.`
        ],
        [],
        '',
        [
           projectsData[8],
           projectsData[9],
           projectsData[10]
        ]

    ),
    new CareerData(
        'OpenConnect',
        'OpenConnect',
        'Senior Software Developer(Part-time)',
        '11/2020',
        '05/2021',
        [
            `I architected & built a Cryptocurrency trading & portfolio application for the
            invite-only members club.
            The system collects order books from different exchanges via WebSocket or
            RPC interfaces, retrieves the user's crypto balances & past trade history, then
            aggregates whole data & stores it in Timescale DB. The mobile app flutter app
            then consumes this data via proto streaming over MQTT. The proto APIs allow
            users to place spot, feature orders, With algorithms implemented to Arbitrage
            across multiple currencies and exchanges in real-time. Using Geth (Ethereum
            node written in Go) Also built transaction scraper for DApp decentralized
            application users.`
        ],
        [],
        '',
        [
          projectsData[11]   
        ]

    ),
    new CareerData(
        'Cloudwalker',
        'Cloudwalker Streaming Technologies',
        'Full-stack product developer',
        '6/2019',
        '12/2020',
        [
            `I was responsible for designing, building & deploying dashboards, server
            backends & Android TV & phone apps & to take complete responsibility for the projects
            allocated & Innovated by me.
            Built a highly scalable backend and android system app
            capable of diagnosing and fixing issues in devices having CloudTV OS.
            Optimized customer experience by enabling remote troubleshooting devices
            which reduced on-site support requests saving costs for the organization.
            Android system app, GoLang Microservices, AWS IoT, AWS SNS,NodeJS + ReactJS dashboard, MongoDB, Deployed on AWS ECS`
        ],
        [],
        '',
        [
         projectsData[0],
         projectsData[1],
         projectsData[2],
         projectsData[3],
         projectsData[4],
         projectsData[5],
         projectsData[6],
         projectsData[7],

        ]

    ),
    new CareerData(
        'Profusion',
        'Profusion Technologies',
        'Founder',
        '06/2016',
        '05/2019',
        [
            `Managed and directed firm operations.
            Pioneered the conceptualization, design and engineering of innovative products.
            
            On-Road Emergency and Repair Services App - Designed for users to swiftly locate nearby vehicle service stations during highway malfunctions.
            Facilitates immediate contact with the closest ambulance services during medical crises.
            Integrates real-time location display of the requester on the operator's platform.

            CarRace AR - An Augmented Reality car racing game.
            Developed for the Accenture Innovation Challenge and secured a position in the top 20 projects nationwide.
            Features: Enables users to engage in a car race on an augmented terrain using just a piece of paper.
            Tech Stack: Unity3D, Vuforia, Android App, NodeJS backend, MongoDB, and hosted on AWS ECS.

            Maha-RTO Marathi Test Android App - Curated for Marathi literate individuals aiming to prepare for the LLR examination, organized by the Maharashtra State RTO department.
            Incorporates the Google Translate API for optimal user experience.
            Tech Stack: Android App, Google Translate API.`
        ],
        [],
        '',
        [
            projectsData[12],
            projectsData[13],
            projectsData[14]
        ]
        

    )
]


// CONTACT DATA
const contactData ={
    'address':'Andheri West, Mumbai, Maharashtra - 400058',
    'phones': ['+91 7709922149'],
    'emails': ['mr.sumitagrawal.17@gmail.com']
}

// SKILLS DATA
const skillsData = [{
    toolTip: 'Golang',
    imgSrc: './assets/images/webp/golang.webp',
    proficiency: 5

},{
    toolTip: 'AWS',
    imgSrc: './assets/images/webp/aws.webp',
    proficiency: 5

},{
    toolTip:'Java',
    imgSrc: './assets/images/webp/java.webp',
    proficiency: 5

},{
    toolTip: 'MongoDb',
    imgSrc: './assets/images/webp/mongodb.webp',
    proficiency: 5

},{
    toolTip: 'Android',
    imgSrc: './assets/images/webp/Android.webp',
    proficiency: 5

},{
    toolTip: 'AWS Lambda',
    imgSrc: './assets/images/webp/AWS Lambda.webp',
    proficiency: 5

},{
    toolTip: 'Firebase',
    imgSrc: './assets/images/firebase.png',
    proficiency: 5

},{
    toolTip: 'C++',
    imgSrc: './assets/images/webp/C++.webp',
    proficiency: 5

},{
    toolTip: 'Cloud SQL',
    imgSrc: './assets/images/webp/CloudSQL.webp',
    proficiency: 5

},{
    toolTip: 'DynamoDB',
    imgSrc: './assets/images/webp/DynamoDB.webp',
    proficiency: 5

},{
    toolTip: 'Flutter',
    imgSrc: './assets/images/webp/flutter.webp',
    proficiency: 5

},{
    toolTip: 'Nodejs',
    imgSrc: './assets/images/webp/NodeJS.webp',
    proficiency: 5

},{
    toolTip: 'Flask',
    imgSrc: './assets/images/webp/Python Flask.webp',
    proficiency: 5

},{
    toolTip: 'SparkQL',
    imgSrc: './assets/images/webp/SparkQL.webp',
    proficiency: 5
},
{
    toolTip: 'vueJS',
    imgSrc: './assets/images/webp/vuejs.webp',
    proficiency: 5
}]



// TOOLS DATA
const toolsData =[{
    toolTip: 'Bitbuket',
    imgSrc: './assets/images/webp/Bitbucket.webp',
    proficiency: 5

},{
    toolTip: 'Cloud Tasks',
    imgSrc: './assets/images//webp/Cloud Tasks.webp',
    proficiency: 5

},{
    toolTip: 'Webpack',
    imgSrc: './assets/images/webpack.png',
    proficiency: 5

},{
    toolTip: 'Git',
    imgSrc: './assets/images/git.png',
    proficiency: 5

},{
    toolTip: 'Npm',
    imgSrc: './assets/images/npm.png',
    proficiency: 5

},{
    toolTip: 'Digital ocean',
    imgSrc: './assets/images/webp/Digital ocean.webp',
    proficiency: 5

},{
    toolTip: 'Github',
    imgSrc: './assets/images/webp/github.webp',
    proficiency: 5

},{
    toolTip: 'Grafana',
    imgSrc: './assets/images/webp/Grafana.webp',
    proficiency: 5

},{
    toolTip: 'Kubernetes',
    imgSrc: './assets/images/webp/Kubernetes.webp',
    proficiency: 5

},{
    toolTip: 'Prometheus',
    imgSrc: './assets/images/webp/Prometheus.webp',
    proficiency: 5

},{
    toolTip: 'Redis',
    imgSrc: './assets/images/webp/Redis.webp',
    proficiency: 5

},{
    toolTip: 'Terraform',
    imgSrc: './assets/images/webp/Terraform.webp',
    proficiency: 5

},{
    toolTip: 'TimescaleDB',
    imgSrc: './assets/images/webp/TimescaleDB.webp',
    proficiency: 5

}]

const Constants = {
    HOME,
    SKILLS,
    CAREER,
    PROJECTS,
    CONTACT,
    careersData,
    projectsData,
    contactData,
    skillsData,
    toolsData,
    facebookLink,
    linkedinLink,
    githubLink,
    twitterLink,
    instagramLink
}

export default Constants 
