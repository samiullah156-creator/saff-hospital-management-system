
import {
  User, Role, Doctor, Appointment, AppointmentStatus,
  BlogPost, InventoryItem, Invoice, ChatMessage
} from '../types';

// Mock Users
const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@saff.com', role: Role.ADMIN, avatarUrl: 'https://ui-avatars.com/api/?name=Admin', gender: 'Male' },
  { id: '2', name: 'John Doe', email: 'patient@saff.com', role: Role.PATIENT, avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe', gender: 'Male', phone: '+923001234567', age: 30, status: 'Outpatient' }
];

// Mock Doctors - Verified Images with High Resolution
const MOCK_DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Saff-ur-Rehman', specialty: 'Cardiology', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800', experience: '25 Years', availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], expertise: ['Angiography', 'Heart Failure', 'Hypertension'] },
  { id: 'd2', name: 'Dr. Ayesha Khan', specialty: 'Cardiology', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800', experience: '12 Years', availability: ['Mon', 'Wed', 'Fri'], expertise: ['Preventive Cardiology', 'Heart Disease'] },
  { id: 'd3', name: 'Dr. Bilal Ahmed', specialty: 'Pediatrics', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800', experience: '8 Years', availability: ['Tue', 'Thu', 'Sat'], expertise: ['Vaccination', 'Child Nutrition'] },
  { id: 'd4', name: 'Dr. Zara Malik', specialty: 'Neurology', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800', experience: '15 Years', availability: ['Mon', 'Thu'], expertise: ['Stroke', 'Migraine'] },
  { id: 'd5', name: 'Dr. John Doe', specialty: 'Ophthalmology', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800', experience: '10 Years', availability: ['Wed', 'Fri'], expertise: ['Cataract', 'Glaucoma'] },
  { id: 'd6', name: 'Dr. Samina Karim', specialty: 'Pulmonology', image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=800', experience: '18 Years', availability: ['Tue', 'Thu'], expertise: ['Asthma', 'COPD'] },
  { id: 'd7', name: 'Dr. Ali Hassan', specialty: 'Psychiatry', image: 'https://images.unsplash.com/photo-1582750433449-d22b1c74caf6?auto=format&fit=crop&q=80&w=800', experience: '7 Years', availability: ['Mon', 'Wed'], expertise: ['Anxiety', 'Depression'] },
  { id: 'd8', name: 'Dr. Hina Altaf', specialty: 'Dermatology', image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=800', experience: '9 Years', availability: ['Fri', 'Sat'], expertise: ['Acne', 'Laser Therapy'] },
  
  // New Doctors
  { id: 'd9', name: 'Dr. Rashid Latif', specialty: 'Gastroenterology', image: 'https://images.unsplash.com/photo-1612916194234-07fa952b5b3a?auto=format&fit=crop&q=80&w=800', experience: '14 Years', availability: ['Mon', 'Tue', 'Thu'], expertise: ['Endoscopy', 'Liver Disease'] },
  { id: 'd10', name: 'Dr. Sadia Raza', specialty: 'Gynecology', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800', experience: '11 Years', availability: ['Mon', 'Wed', 'Sat'], expertise: ['High-risk Pregnancy', 'Infertility'] },
  { id: 'd11', name: 'Dr. Taimoor Khan', specialty: 'Urology', image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=800', experience: '16 Years', availability: ['Tue', 'Thu', 'Fri'], expertise: ['Kidney Stones', 'Prostate Health'] },
  { id: 'd12', name: 'Dr. Nida Yasir', specialty: 'Nutrition', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800', experience: '6 Years', availability: ['Mon', 'Wed', 'Fri'], expertise: ['Weight Management', 'Diabetic Diet'] },
  { id: 'd13', name: 'Dr. Usman Farid', specialty: 'Orthopedics', image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=800', experience: '20 Years', availability: ['Mon', 'Thu'], expertise: ['Joint Replacement', 'Sports Injuries'] },
  { id: 'd14', name: 'Dr. Fahad Mustafa', specialty: 'Oncology', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800', experience: '13 Years', availability: ['Wed', 'Fri'], expertise: ['Chemotherapy', 'Tumor Surgery'] },
  { id: 'd15', name: 'Dr. Emily White', specialty: 'Psychiatry', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800', experience: '9 Years', availability: ['Tue', 'Sat'], expertise: ['Cognitive Therapy', 'Child Psychology'] },
  { id: 'd16', name: 'Dr. Zainab Bibi', specialty: 'Pathology', image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=800', experience: '10 Years', availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], expertise: ['Clinical Pathology', 'Hematology'] },
  { id: 'd17', name: 'Dr. Omar Farooq', specialty: 'Radiology', image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=800', experience: '12 Years', availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], expertise: ['MRI Interpretation', 'CT Scan'] },
  { id: 'd18', name: 'Dr. Hira Mani', specialty: 'Dental Care', image: 'https://images.unsplash.com/photo-1619334035290-80419d2b4fd5?auto=format&fit=crop&q=80&w=800', experience: '7 Years', availability: ['Mon', 'Wed', 'Fri'], expertise: ['Root Canal', 'Cosmetic Dentistry'] },
  { id: 'd19', name: 'Dr. Amani Khan', specialty: 'Rheumatology', image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=800', experience: '15 Years', availability: ['Tue', 'Thu'], expertise: ['Arthritis', 'Autoimmune Diseases'] },
  { id: 'd20', name: 'Dr. Jamil Ahmed', specialty: 'Nephrology', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800', experience: '18 Years', availability: ['Mon', 'Wed', 'Sat'], expertise: ['Kidney Failure', 'Dialysis'] },
  { id: 'd21', name: 'Dr. Kashif Mehmood', specialty: 'Pulmonology', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', experience: '14 Years', availability: ['Tue', 'Fri'], expertise: ['Sleep Apnea', 'Respiratory Infections'] },
  { id: 'd22', name: 'Dr. Maria Qureshi', specialty: 'Plastic Surgery', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800', experience: '11 Years', availability: ['Thu', 'Sat'], expertise: ['Reconstructive Surgery', 'Burns'] },
  { id: 'd23', name: 'Dr. Sajjad Ali', specialty: 'Vascular Surgery', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800', experience: '19 Years', availability: ['Mon', 'Wed'], expertise: ['Varicose Veins', 'Aneurysm'] },
];

// Content Generator Helper
const generateContent = (title: string, category: string, topicSpecifics: string) => {
  return `
In today's fast-paced world, understanding **${title}** is more critical than ever. This comprehensive guide explores everything you need to know about ${category}, offering medical insights, practical tips, and preventative measures to ensure you and your family stay healthy.

### Understanding the Basics

${topicSpecifics}

When we talk about ${title}, we are addressing a fundamental aspect of human health. The medical community at Saff Hospital emphasizes that early detection and consistent management are the keys to long-term well-being. Whether you are experiencing early symptoms or looking for preventative advice, knowledge is your first line of defense.

### Key Symptoms to Watch For

It is vital to listen to your body. Common signs that indicate you might need to consult a specialist in ${category} include:

*   **Persistent Discomfort:** Any pain or discomfort that lasts more than a few days should never be ignored.
*   **Changes in Vital Signs:** Unexplained changes in blood pressure, heart rate, or temperature.
*   **Fatigue and Lethargy:** Feeling unusually tired without exertion can be a subtle sign of underlying issues.
*   **Specific localized symptoms** relevant to ${category}, such as shortness of breath, localized pain, or visible changes in the body.

### Prevention and Management Strategies

**1. Lifestyle Modifications**
The most effective way to manage health is through lifestyle changes. This includes adopting a balanced diet rich in whole foods, reducing processed sugar intake, and ensuring you get at least 30 minutes of moderate exercise daily.

**2. Regular Screenings**
We cannot stress enough the importance of annual checkups. Regular blood work and screenings allow doctors to catch potential issues before they become life-threatening conditions.

**3. Stress Management**
Chronic stress affects every system in the body. Techniques such as mindfulness, yoga, and deep-breathing exercises can significantly improve your prognosis and general quality of life.

### When to See a Doctor?

If you notice any severe symptoms, do not wait. Immediate medical attention can prevent complications. At Saff Hospital, our **${category}** department is equipped with state-of-the-art technology to diagnose and treat complex conditions.

### Conclusion

Your health is your most valuable asset. By understanding **${title}** and taking proactive steps, you can lead a longer, healthier, and happier life. Remember, small daily habits compound into significant long-term health benefits.

*Disclaimer: This blog post is for informational purposes only and does not constitute medical advice. Always consult with a qualified healthcare provider for diagnosis and treatment.*
  `.trim();
};

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "5 Tips for a Healthy Heart",
    category: "Cardiology",
    date: "Oct 15, 2023",
    author: "Dr. Ayesha Khan",
    image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=1200",
    excerpt: "Heart disease is a leading cause of death, but it's preventable. Learn about the 5 simple lifestyle changes you can make today.",
    readTime: "5 min read",
    content: generateContent("Heart Health", "Cardiology", "Your heart is a muscle that needs care. High blood pressure, high cholesterol, and smoking are key risk factors.")
  },
  {
    id: 2,
    title: "Understanding Childhood Vaccination",
    category: "Pediatrics",
    date: "Oct 20, 2023",
    author: "Dr. Bilal Ahmed",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1200",
    excerpt: "Vaccines are crucial for your child's health. This guide explains the importance of vaccination schedules.",
    readTime: "6 min read",
    content: generateContent("Vaccination", "Pediatrics", "Vaccines protect children from serious and potentially fatal diseases. They work by preparing the body's immune system to fight specific pathogens.")
  },
  {
    id: 3,
    title: "Managing Diabetes Effectively",
    category: "Endocrinology",
    date: "Oct 25, 2023",
    author: "Dr. Saff-ur-Rehman",
    image: "https://images.unsplash.com/photo-1579684385136-1f140541250e?auto=format&fit=crop&q=80&w=1200",
    excerpt: "Living with diabetes requires careful management. Discover practical strategies for diet and monitoring.",
    readTime: "7 min read",
    content: generateContent("Diabetes Management", "Endocrinology", "Diabetes is a chronic condition that affects how your body turns food into energy. Effective management involves monitoring blood sugar levels.")
  },
  {
      id: 4,
      title: "The Hidden Signs of Diabetes",
      category: "Endocrinology",
      date: "Nov 02, 2023",
      author: "Dr. Kamal Ahmed",
      image: "https://images.unsplash.com/photo-1606166325683-e6deb697d301?auto=format&fit=crop&q=80&w=1200",
      excerpt: "Diabetes often develops silently. Learn to recognize the subtle early warning signs.",
      readTime: "5 min read",
      content: generateContent("Hidden Signs of Diabetes", "Endocrinology", "Diabetes often develops gradually, and many people live with pre-diabetes or Type 2 diabetes for years without knowing it.")
  },
  {
      id: 5,
      title: "Nutrition for Growing Kids",
      category: "Pediatrics",
      date: "Nov 08, 2023",
      author: "Dr. Bilal Ahmed",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200",
      excerpt: "Building a strong foundation for your child's health starts with nutrition.",
      readTime: "4 min read",
      content: generateContent("Child Nutrition", "Pediatrics", "Proper nutrition during childhood fosters proper growth, brain development, and a strong immune system.")
  },
  {
      id: 6,
      title: "The Power of Sleep for Wellness",
      category: "Wellness",
      date: "Nov 15, 2023",
      author: "Dr. Nida Yasir",
      image: "https://images.unsplash.com/photo-1511978293554-7b92f19bd77d?auto=format&fit=crop&q=80&w=1200",
      excerpt: "Sleep is as important as diet and exercise. Discover how quality sleep boosts immunity.",
      readTime: "6 min read",
      content: generateContent("Sleep Hygiene", "Wellness", "Sleep is the body's repair mechanism. During deep sleep, the body regenerates tissues, builds bone and muscle, and strengthens the immune system.")
  },
  {
      id: 7,
      title: "The Importance of Regular Health Checkups",
      category: "General Health",
      date: "Nov 20, 2023",
      author: "Dr. John Doe",
      image: "https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=1200",
      excerpt: "Regular health checkups are vital for maintaining good health and early detection.",
      readTime: "5 min read",
      content: generateContent("Regular Health Checkups", "General Health", "Many diseases are 'silent killers,' showing no symptoms until they are advanced. Regular checkups allow physicians to establish a baseline for your health.")
  },
  { 
      id: 8, 
      title: "Stress Management Techniques", 
      category: "Psychiatry", 
      date: "Nov 22, 2023", 
      author: "Dr. Ali Hassan", 
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200", 
      excerpt: "Learn effective ways to manage stress in your daily life.", 
      readTime: "4 min read",
      content: generateContent("Stress Management", "Psychiatry", "Stress triggers the body's 'fight or flight' response. Chronic activation of this system can lead to anxiety, depression, and physical health problems.")
  },
  { 
      id: 9, 
      title: "Benefits of Early Morning Walks", 
      category: "Wellness", 
      date: "Nov 25, 2023", 
      author: "Dr. Saff-ur-Rehman", 
      image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1200", 
      excerpt: "Start your day right with a brisk walk to boost metabolism.", 
      readTime: "3 min read", 
      content: generateContent("Morning Walks", "Wellness", "Walking is a low-impact exercise with high-impact results. A brisk morning walk jumpstarts your metabolism, improves circulation, and exposes you to natural sunlight.")
  },
  {
      id: 10,
      title: "Understanding Migraines",
      category: "Neurology",
      date: "Nov 28, 2023",
      author: "Dr. Zara Malik",
      image: "https://images.unsplash.com/photo-1544654290-0322312d9d08?auto=format&fit=crop&q=80&w=1200",
      excerpt: "Migraines are more than just headaches. Learn the triggers.",
      readTime: "5 min read",
      content: generateContent("Migraine Management", "Neurology", "A migraine is a neurological condition often characterized by intense, debilitating headaches. Symptoms can include nausea, vomiting, numbness or tingling.")
  },
  { 
      id: 11, 
      title: "Skin Care 101", 
      category: "Dermatology", 
      date: "Dec 01, 2023", 
      author: "Dr. Hina Altaf", 
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1200", 
      excerpt: "Basic routine for glowing and healthy skin.", 
      readTime: "4 min read", 
      content: generateContent("Basic Skin Care", "Dermatology", "Your skin is your body's largest organ and its first line of defense. A basic, effective routine consists of three steps: Cleanse, Moisturize, and Protect.")
  },
  { 
      id: 12, 
      title: "Kidney Stone Prevention", 
      category: "Urology", 
      date: "Dec 03, 2023", 
      author: "Dr. Taimoor Khan", 
      image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1200", 
      excerpt: "Hydration is key. Learn how to prevent painful kidney stones.", 
      readTime: "4 min read", 
      content: generateContent("Kidney Stone Prevention", "Urology", "Kidney stones are hard deposits made of minerals and salts that form inside your kidneys. They can be incredibly painful to pass.")
  },
  { 
      id: 13, 
      title: "Coping with Anxiety", 
      category: "Psychiatry", 
      date: "Dec 05, 2023", 
      author: "Dr. Emily White", 
      image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&q=80&w=1200", 
      excerpt: "Practical steps to handle anxiety attacks.", 
      readTime: "6 min read", 
      content: generateContent("Anxiety Management", "Psychiatry", "Anxiety disorders are the most common mental illness. Unlike occasional worry, anxiety disorders involve intense, excessive, and persistent worry.")
  },
  { 
      id: 14, 
      title: "Healthy Eating on a Budget", 
      category: "Nutrition", 
      date: "Dec 08, 2023", 
      author: "Dr. Bilal Ahmed", 
      image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&q=80&w=1200", 
      excerpt: "Eating healthy doesn't have to be expensive.", 
      readTime: "5 min read", 
      content: generateContent("Budget Nutrition", "Nutrition", "A common misconception is that healthy food is expensive. In reality, staples like lentils, beans, seasonal vegetables, eggs, and whole grains are cheap.")
  },
  { 
      id: 15, 
      title: "Signs of Vision Loss", 
      category: "Ophthalmology", 
      date: "Dec 10, 2023", 
      author: "Dr. John Doe", 
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=1200", 
      excerpt: "Protect your eyes by recognizing early symptoms.", 
      readTime: "4 min read", 
      content: generateContent("Vision Health", "Ophthalmology", "Vision loss often happens so gradually that patients don't notice it until it's significant. Early signs include needing more light to read.")
  },
  { 
      id: 16, 
      title: "The Role of Physiotherapy", 
      category: "Orthopedics", 
      date: "Dec 12, 2023", 
      author: "Dr. Usman Farid", 
      image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=1200", 
      excerpt: "Recover faster from injuries with proper physical therapy.", 
      readTime: "5 min read", 
      content: generateContent("Physiotherapy Benefits", "Orthopedics", "Physiotherapy is not just for athletes recovering from injury. It is vital for anyone suffering from musculoskeletal pain, mobility issues, or recovering.")
  },
  { 
      id: 17, 
      title: "Winter Health Tips", 
      category: "General Health", 
      date: "Dec 15, 2023", 
      author: "Dr. Samina Karim", 
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200", 
      excerpt: "Stay healthy during the cold flu season.", 
      readTime: "3 min read", 
      content: generateContent("Winter Wellness", "General Health", "Winter brings a spike in respiratory illnesses like the flu, common cold, and pneumonia. The cold air itself can irritate airways.")
  },
  { 
      id: 18, 
      title: "Pregnancy Diet Guide", 
      category: "Gynecology", 
      date: "Dec 18, 2023", 
      author: "Dr. Sadia Raza", 
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200", 
      excerpt: "What to eat and what to avoid during pregnancy.", 
      readTime: "6 min read", 
      content: generateContent("Pregnancy Nutrition", "Gynecology", "Nutrition during pregnancy is about quality, not just quantity. You are building a new life. Essential nutrients include Folic Acid.")
  },
  { 
      id: 19, 
      title: "Protecting Your Liver", 
      category: "Gastroenterology", 
      date: "Dec 20, 2023", 
      author: "Dr. Rashid Latif", 
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1200", 
      excerpt: "Essential tips for maintaining liver health.", 
      readTime: "5 min read", 
      content: generateContent("Liver Health", "Gastroenterology", "The liver is the body's primary filtration system, converting toxins into waste products, cleansing the blood, and metabolizing nutrients.")
  },
  { 
      id: 20, 
      title: "Understanding Asthma Triggers", 
      category: "Pulmonology", 
      date: "Dec 22, 2023", 
      author: "Dr. Samina Karim", 
      image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=1200", 
      excerpt: "Manage asthma by identifying your environment triggers.", 
      readTime: "4 min read", 
      content: generateContent("Asthma Management", "Pulmonology", "Asthma is a chronic inflammation of the airways. While medication is important, avoidance of triggers is the best prevention.")
  }
];

// Helper to simulate async db calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Local Storage Keys
const CURRENT_USER_KEY = 'saff_current_user';
const APPOINTMENTS_KEY = 'saff_appointments';
const USERS_KEY = 'saff_users';
const CHAT_HISTORY_KEY = 'saff_chat_history_';
const FAVORITE_DOCTORS_KEY = 'saff_fav_doctors';

export const dbService = {
  // Auth
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  login: async (email: string): Promise<User> => {
    await delay(500);
    // Simple mock login
    let user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // Auto-register generic user if not found for demo purposes, unless admin
    if (!user) {
        if (email.includes('admin')) {
             user = MOCK_USERS[0]; // Fallback to admin
        } else {
             user = {
                 id: Math.random().toString(36).substr(2, 9),
                 name: email.split('@')[0],
                 email: email,
                 role: Role.PATIENT,
                 avatarUrl: `https://ui-avatars.com/api/?name=${email.split('@')[0]}`,
                 gender: 'Unknown'
             };
        }
    }
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  logout: async (): Promise<void> => {
    await delay(300);
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getAllUsers: async (): Promise<User[]> => {
      await delay(300);
      return MOCK_USERS;
  },

  // Appointments
  getAppointments: async (userId: string): Promise<Appointment[]> => {
    await delay(300);
    const all = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
    return all.filter((a: Appointment) => a.patientId === userId);
  },

  getAllAppointments: async (): Promise<Appointment[]> => {
    await delay(300);
    return JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
  },

  // NEW METHOD: Get Booked Slots for a specific doctor and date
  getBookedSlots: async (doctorId: string, date: string, excludeAppId?: string): Promise<string[]> => {
      await delay(200);
      const all = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
      return all
          .filter((a: Appointment) => 
              a.doctorId === doctorId && 
              a.date === date && 
              a.status !== AppointmentStatus.CANCELLED &&
              a.id !== excludeAppId
          )
          .map((a: Appointment) => a.time);
  },

  createAppointment: async (appointment: Partial<Appointment>): Promise<Appointment> => {
    await delay(500);
    const newApp: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      status: AppointmentStatus.PENDING,
      patientId: '', // Should be provided
      patientName: '',
      doctorId: '',
      doctorName: '',
      date: '',
      time: '',
      reason: '',
      ...appointment as any
    };
    const all = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
    all.push(newApp);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(all));
    return newApp;
  },

  updateAppointment: async (appointment: Appointment): Promise<void> => {
      await delay(300);
      const all = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
      const index = all.findIndex((a: Appointment) => a.id === appointment.id);
      if (index !== -1) {
          all[index] = appointment;
          localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(all));
      }
  },

  cancelAppointment: async (appId: string, reason: string): Promise<void> => {
      await delay(300);
      const all = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
      const index = all.findIndex((a: Appointment) => a.id === appId);
      if (index !== -1) {
          all[index].status = AppointmentStatus.CANCELLED;
          all[index].cancellationReason = reason;
          localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(all));
      }
  },

  checkAvailability: async (doctorId: string, date: string, time: string, excludeAppId?: string): Promise<boolean> => {
      await delay(200);
      const all = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
      const conflict = all.find((a: Appointment) => 
          a.doctorId === doctorId && 
          a.date === date && 
          a.time === time && 
          a.status !== AppointmentStatus.CANCELLED &&
          a.id !== excludeAppId
      );
      return !conflict;
  },

  // Doctors
  getDoctors: async (): Promise<Doctor[]> => {
    await delay(300);
    return MOCK_DOCTORS;
  },

  getDoctorById: async (id: string): Promise<Doctor | undefined> => {
      await delay(100);
      return MOCK_DOCTORS.find(d => d.id === id);
  },

  // Blog
  getBlogPosts: async (): Promise<BlogPost[]> => {
    await delay(300);
    return BLOG_POSTS;
  },

  getBlogPostById: async (id: number): Promise<BlogPost | undefined> => {
      await delay(100);
      return BLOG_POSTS.find(p => p.id === id);
  },

  getRelatedPosts: async (category: string, currentId: number): Promise<BlogPost[]> => {
      await delay(100);
      return BLOG_POSTS.filter(p => p.category === category && p.id !== currentId).slice(0, 3);
  },

  // Chat
  getChatHistory: (userId: string): ChatMessage[] => {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY + userId);
    return stored ? JSON.parse(stored) : [];
  },

  saveChatHistory: (userId: string, messages: ChatMessage[]): void => {
    localStorage.setItem(CHAT_HISTORY_KEY + userId, JSON.stringify(messages));
  },

  clearChatHistory: (userId: string): void => {
    localStorage.removeItem(CHAT_HISTORY_KEY + userId);
  },

  // Admin / Other
  getInventory: async (): Promise<InventoryItem[]> => {
      await delay(200);
      // Mock inventory
      return [
          { id: 1, name: 'Panadol Extra', stock: 15, unit: 'Box', category: 'Medicine', status: 'Low Stock' },
          { id: 2, name: 'Surgical Masks', stock: 500, unit: 'Pc', category: 'Supplies', status: 'In Stock' },
          { id: 3, name: 'Insulin Syringes', stock: 0, unit: 'Box', category: 'Supplies', status: 'Out of Stock' },
          { id: 4, name: 'Augmentin 625mg', stock: 45, unit: 'Box', category: 'Medicine', status: 'In Stock' },
      ];
  },

  getInvoices: async (): Promise<Invoice[]> => {
      await delay(200);
      return [
          { id: 'INV-001', patientName: 'Ali Khan', service: 'Consultation', amount: 2500, date: '2023-10-25', status: 'Paid' },
          { id: 'INV-002', patientName: 'Sana Mir', service: 'MRI Scan', amount: 15000, date: '2023-10-26', status: 'Pending' }
      ];
  },

  updateStock: async (id: number, change: number): Promise<void> => {
      await delay(100);
  },

  updateInventoryItem: async (item: InventoryItem): Promise<void> => {
      await delay(100);
  },

  createInvoice: async (invoice: any): Promise<void> => {
      await delay(200);
  },

  addPatient: async (patient: any): Promise<void> => {
      await delay(300);
      MOCK_USERS.push({
          id: Math.random().toString(36).substr(2, 9),
          ...patient,
          role: Role.PATIENT
      });
  },

  deleteUser: async (id: string): Promise<void> => {
      await delay(200);
      // In mock, we can't easily delete from const MOCK_USERS without changing it to let or mutating array
      const index = MOCK_USERS.findIndex(u => u.id === id);
      if (index > -1) MOCK_USERS.splice(index, 1);
  },

  updateUser: async (user: User): Promise<void> => {
      await delay(300);
      const index = MOCK_USERS.findIndex(u => u.id === user.id);
      if (index > -1) MOCK_USERS[index] = user;
      
      // Also update current session if needed
      const current = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || '{}');
      if (current.id === user.id) {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      }
  },

  // Features
  sendReminder: async (appId: string, method: string): Promise<void> => {
      await delay(500);
  },

  sendBatchReminders: async (): Promise<{count: number, date: string}> => {
      await delay(1000);
      return { count: 5, date: new Date().toLocaleDateString() };
  },

  // Favorites
  isDoctorFavorite: (doctorId: string): boolean => {
      const favs = JSON.parse(localStorage.getItem(FAVORITE_DOCTORS_KEY) || '[]');
      return favs.includes(doctorId);
  },

  toggleFavoriteDoctor: async (doctorId: string): Promise<boolean> => {
      await delay(100);
      const favs = JSON.parse(localStorage.getItem(FAVORITE_DOCTORS_KEY) || '[]');
      let newFavs;
      let isFav;
      if (favs.includes(doctorId)) {
          newFavs = favs.filter((id: string) => id !== doctorId);
          isFav = false;
      } else {
          newFavs = [...favs, doctorId];
          isFav = true;
      }
      localStorage.setItem(FAVORITE_DOCTORS_KEY, JSON.stringify(newFavs));
      return isFav;
  },

  getFavoriteDoctors: async (): Promise<Doctor[]> => {
      await delay(200);
      const favIds = JSON.parse(localStorage.getItem(FAVORITE_DOCTORS_KEY) || '[]');
      return MOCK_DOCTORS.filter(d => favIds.includes(d.id));
  },

  submitContactForm: async (data: any): Promise<void> => {
      await delay(1000);
      console.log("Contact form submitted:", data);
  }
};
