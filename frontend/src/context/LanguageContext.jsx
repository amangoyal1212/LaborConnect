import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
    en: {
        // Auth
        appName: 'LaborConnect',
        tagline: 'Uber for Construction Labor',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        signingIn: 'Signing in...',
        creatingAccount: 'Creating Account...',
        createAccount: 'Create Account',
        signInToAccount: 'Sign in to your account',
        createYourAccount: 'Create your account to get started',
        phone: 'Phone Number',
        password: 'Password',
        enterPhone: 'Enter your phone number',
        enterPassword: 'Enter password',
        createPassword: 'Create password',
        fullName: 'Full Name',
        enterName: 'Enter your name',
        iAmA: 'I am a',
        laborer: 'Laborer',
        thekedar: 'Thekedar',
        noAccount: "Don't have an account?",
        haveAccount: 'Already have an account?',
        loginFailed: 'Login failed',
        signupFailed: 'Signup failed',

        // Navbar & Settings
        dashboard: 'Dashboard',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        language: 'Language',
        hindi: 'हिंदी',
        english: 'English',

        // Laborer Dashboard
        namaste: 'Namaste',
        findWork: 'Find work near you, track your tasks',
        nearbyJobs: 'Nearby Jobs',
        todayTasks: "Today's Tasks",
        jobsMatching: 'Jobs Matching Your Profile',
        refresh: 'Refresh',
        noJobsNearby: 'No jobs nearby',
        updateProfileHint: 'Update your profile with the correct pincode and worker type to see matching jobs',
        applyNow: 'Apply Now',
        urgent: 'URGENT',
        by: 'By',
        noTasks: 'No tasks for today',
        noTasksHint: "Your thekedar hasn't assigned any tasks yet",

        // Thekedar Dashboard  
        welcome: 'Welcome',
        manageJobs: 'Manage jobs, groups, and workers',
        postJob: 'Post Job',
        panic: 'Panic',
        groups: 'Groups',
        tasks: 'Tasks',
        chat: 'Chat',
        postNewJob: 'Post a New Job',
        jobTitle: 'Job Title',
        jobTitlePlaceholder: 'e.g. Need Mistri for Building',
        description: 'Description',
        describeWork: 'Describe the work...',
        workerType: 'Worker Type',
        selectType: 'Select',
        pincode: 'Pincode',
        markUrgent: 'Mark as Urgent',
        recentlyPosted: 'Recently Posted',
        noJobsPosted: 'No jobs posted yet',
        postFirstJob: 'Post your first job to see it here',
        jobId: 'Job ID',
        panicButton: 'Panic Button',
        panicDesc: 'Need urgent replacement? Send instant alerts to all matching available workers!',
        enterJobId: 'Enter Job ID',
        sendPanicAlert: 'SEND PANIC ALERT',
        createGroup: 'Create Group',
        groupName: 'Group Name',
        groupNamePlaceholder: 'e.g. Site A - Karol Bagh',
        addLaborerToGroup: 'Add Laborer to Group',
        groupId: 'Group ID',
        laborerUserId: 'Laborer User ID',
        laborerId: 'Laborer ID',
        addToGroup: 'Add to Group',
        yourGroups: 'Your Groups',
        noGroups: 'No groups yet',
        createFirstGroup: 'Create your first group',
        assignTask: 'Assign Task to Laborer',
        taskDescription: 'Task Description',
        taskDescPlaceholder: 'Describe what the laborer needs to do today...',

        // Profile
        updateProfile: 'Update Your Profile',
        skill: 'Your Skill',
        selectSkill: 'Select your skill',
        experience: 'Experience (Years)',
        dailyWage: 'Daily Wage (₹)',
        city: 'City',
        area: 'Area',
        availableToday: 'Available Today',
        saveProfile: 'Save Profile',
        saving: 'Saving...',
        companyName: 'Company Name',
        profileUpdated: 'Profile updated successfully! ✅',
        updateFailed: 'Update failed',

        // Chat
        groupChats: 'Group Chats',
        typeMessage: 'Type a message...',
        send: 'Send',
        noMessages: 'No messages yet',
        startChatting: 'Start the conversation!',
        selectGroup: 'Select a group to start chatting',
        noGroupsChat: 'No groups available for chat',
        joinGroupFirst: 'Create or join a group first',
    },
    hi: {
        // Auth
        appName: 'लेबरकनेक्ट',
        tagline: 'निर्माण मज़दूरों के लिए ऐप',
        signIn: 'साइन इन',
        signUp: 'साइन अप',
        signingIn: 'साइन इन हो रहा है...',
        creatingAccount: 'अकाउंट बन रहा है...',
        createAccount: 'अकाउंट बनाएं',
        signInToAccount: 'अपने अकाउंट में साइन इन करें',
        createYourAccount: 'शुरू करने के लिए अपना अकाउंट बनाएं',
        phone: 'फ़ोन नंबर',
        password: 'पासवर्ड',
        enterPhone: 'अपना फ़ोन नंबर डालें',
        enterPassword: 'पासवर्ड डालें',
        createPassword: 'पासवर्ड बनाएं',
        fullName: 'पूरा नाम',
        enterName: 'अपना नाम डालें',
        iAmA: 'मैं हूँ',
        laborer: 'मज़दूर',
        thekedar: 'ठेकेदार',
        noAccount: 'अकाउंट नहीं है?',
        haveAccount: 'पहले से अकाउंट है?',
        loginFailed: 'लॉगिन विफल',
        signupFailed: 'साइनअप विफल',

        // Navbar & Settings
        dashboard: 'डैशबोर्ड',
        profile: 'प्रोफ़ाइल',
        settings: 'सेटिंग्स',
        logout: 'लॉगआउट',
        darkMode: 'डार्क मोड',
        lightMode: 'लाइट मोड',
        language: 'भाषा',
        hindi: 'हिंदी',
        english: 'English',

        // Laborer Dashboard
        namaste: 'नमस्ते',
        findWork: 'अपने पास काम ढूंढें, टास्क ट्रैक करें',
        nearbyJobs: 'पास के काम',
        todayTasks: 'आज के टास्क',
        jobsMatching: 'आपकी प्रोफ़ाइल से मिलते काम',
        refresh: 'रीफ़्रेश',
        noJobsNearby: 'पास में कोई काम नहीं',
        updateProfileHint: 'मिलते-जुलते काम देखने के लिए अपना पिनकोड और वर्कर टाइप अपडेट करें',
        applyNow: 'अभी अप्लाई करें',
        urgent: 'ज़रूरी',
        by: 'द्वारा',
        noTasks: 'आज कोई टास्क नहीं',
        noTasksHint: 'आपके ठेकेदार ने अभी कोई टास्क नहीं दिया',

        // Thekedar Dashboard
        welcome: 'स्वागत है',
        manageJobs: 'काम, ग्रुप और वर्कर्स मैनेज करें',
        postJob: 'काम पोस्ट करें',
        panic: 'पैनिक',
        groups: 'ग्रुप',
        tasks: 'टास्क',
        chat: 'चैट',
        postNewJob: 'नया काम पोस्ट करें',
        jobTitle: 'काम का नाम',
        jobTitlePlaceholder: 'जैसे बिल्डिंग के लिए मिस्त्री चाहिए',
        description: 'विवरण',
        describeWork: 'काम का विवरण दें...',
        workerType: 'वर्कर टाइप',
        selectType: 'चुनें',
        pincode: 'पिनकोड',
        markUrgent: 'ज़रूरी मार्क करें',
        recentlyPosted: 'हाल ही में पोस्ट किए',
        noJobsPosted: 'अभी कोई काम पोस्ट नहीं',
        postFirstJob: 'अपना पहला काम यहाँ देखने के लिए पोस्ट करें',
        jobId: 'काम ID',
        panicButton: 'पैनिक बटन',
        panicDesc: 'तुरंत बदलाव चाहिए? सभी उपलब्ध वर्कर्स को अलर्ट भेजें!',
        enterJobId: 'काम ID डालें',
        sendPanicAlert: 'पैनिक अलर्ट भेजें',
        createGroup: 'ग्रुप बनाएं',
        groupName: 'ग्रुप का नाम',
        groupNamePlaceholder: 'जैसे साइट A - करोल बाग',
        addLaborerToGroup: 'ग्रुप में मज़दूर जोड़ें',
        groupId: 'ग्रुप ID',
        laborerUserId: 'मज़दूर यूज़र ID',
        laborerId: 'मज़दूर ID',
        addToGroup: 'ग्रुप में जोड़ें',
        yourGroups: 'आपके ग्रुप',
        noGroups: 'अभी कोई ग्रुप नहीं',
        createFirstGroup: 'अपना पहला ग्रुप बनाएं',
        assignTask: 'मज़दूर को टास्क दें',
        taskDescription: 'टास्क विवरण',
        taskDescPlaceholder: 'बताएं कि मज़दूर को आज क्या करना है...',

        // Profile
        updateProfile: 'अपनी प्रोफ़ाइल अपडेट करें',
        skill: 'आपका हुनर',
        selectSkill: 'अपना हुनर चुनें',
        experience: 'अनुभव (साल)',
        dailyWage: 'रोज़ की मज़दूरी (₹)',
        city: 'शहर',
        area: 'इलाका',
        availableToday: 'आज उपलब्ध',
        saveProfile: 'प्रोफ़ाइल सेव करें',
        saving: 'सेव हो रहा है...',
        companyName: 'कंपनी का नाम',
        profileUpdated: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई! ✅',
        updateFailed: 'अपडेट विफल',

        // Chat
        groupChats: 'ग्रुप चैट',
        typeMessage: 'मैसेज लिखें...',
        send: 'भेजें',
        noMessages: 'कोई मैसेज नहीं',
        startChatting: 'बातचीत शुरू करें!',
        selectGroup: 'चैट शुरू करने के लिए ग्रुप चुनें',
        noGroupsChat: 'चैट के लिए कोई ग्रुप नहीं',
        joinGroupFirst: 'पहले कोई ग्रुप बनाएं या जुड़ें',
    }
};

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => {
        return localStorage.getItem('lc_lang') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('lc_lang', lang);
    }, [lang]);

    const t = (key) => translations[lang]?.[key] || translations.en[key] || key;
    const toggleLang = () => setLang(prev => prev === 'en' ? 'hi' : 'en');

    return (
        <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLang = () => useContext(LanguageContext);
